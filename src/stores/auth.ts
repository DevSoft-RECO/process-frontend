import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'
import { AUTH_KEYS } from '../utils/auth-keys'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export interface User {
    [key: string]: any;
    roles?: string[];
    permissions?: string[];
    permisos?: string[];
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {

    // --- MIGRACIÓN Y LIMPIEZA DE CACHÉ (Anti-Old-Data) ---
    const STORAGE_VERSION = 'v5_prefixed'; 
    const isCallbackPage = window.location.pathname.includes('/callback');
    const hasPKCEVerifier = !!localStorage.getItem(AUTH_KEYS.PKCE_VERIFIER);
    const hasNewToken = !!sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);

    const savedVersion = localStorage.getItem(AUTH_KEYS.STORAGE_VERSION);

    if (savedVersion !== STORAGE_VERSION) {
        if (!isCallbackPage && !hasPKCEVerifier && !hasNewToken) {
            AuthService.logoutLocal();
            localStorage.setItem(AUTH_KEYS.STORAGE_VERSION, STORAGE_VERSION);
        } else {
            localStorage.setItem(AUTH_KEYS.STORAGE_VERSION, STORAGE_VERSION);
        }
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem(AUTH_KEYS.USER_DATA) || 'null'))
    const token = ref<string | null>(sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN) || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- VARIABLES REACTIVAS DE SOCKETS Y CONTROL DE INACTIVIDAD ---
    const echoInstance = ref<any>(null)
    const showInactivityModal = ref<boolean>(false)
    const inactivitySessionId = ref<string | null>(null)
    const inactivityCountdown = ref<number>(300)
    const isHeartbeatLoading = ref<boolean>(false)
    let countdownTimerId: any = null

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    async function login(redirectTo: string | null = null): Promise<void> {
        if (processingSSO.value) return;
        processingSSO.value = true;
        
        if (redirectTo) {
            sessionStorage.setItem(AUTH_KEYS.AUTH_REDIRECT, String(redirectTo));
        }
        
        await AuthService.login();
    }

    async function handlePKCECallback(code: string): Promise<void> {
        // --- TOLERANCIA TOTAL A NOMBRES (Anti-Cache) ---
        // Intentamos todas las combinaciones posibles por si el navegador usó un script viejo para salir
        const localPrefixed = localStorage.getItem(AUTH_KEYS.PKCE_VERIFIER);
        const sessionPrefixed = sessionStorage.getItem(AUTH_KEYS.PKCE_VERIFIER);
        const sessionLegacy = sessionStorage.getItem('pkce_verifier'); // Clave sin prefijo (lo que detectó el log)
        const localLegacy = localStorage.getItem('pkce_verifier');

        const finalVerifier = localPrefixed || sessionPrefixed || sessionLegacy || localLegacy;

        if (!finalVerifier) {
            throw new Error('No se encontró el verifier PKCE en ningún almacenamiento (Tolerancia Fallida)');
        }


        const client_id = import.meta.env.VITE_CLIENT_ID;
        const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
        const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';

        const { default: axios } = await import('axios');
        
        const response = await axios.post(`${MOTHER_API_URL}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: client_id,
            redirect_uri: redirect_uri,
            code_verifier: finalVerifier,
            code: code
        });

        const accessToken = response.data.access_token;
        
        token.value = accessToken;
        sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
        
        // Limpiar verifier de todos los posibles lugares
        sessionStorage.removeItem(AUTH_KEYS.PKCE_VERIFIER);
        localStorage.removeItem(AUTH_KEYS.PKCE_VERIFIER);
        processingSSO.value = false;

        await fetchUser(true); // Forzar descarga de perfil limpio tras login

        // CRÍTICO: Inicializar WebSockets de inmediato tras obtener el token
        initSessionSocket()
    }

    async function handleDirectToken(incomingToken: string, userData: any = null): Promise<void> {
        processingSSO.value = true
        try {
            const data = AuthService.processDirectToken(incomingToken, userData)
            token.value = data.access_token

            if (data.user) {
                user.value = data.user
            } else {
                await fetchUser()
            }

        } catch (error) {
            console.error('Error procesando token SSO:', error)
            throw error
        } finally {
            processingSSO.value = false
        }
    }

    function logout(): void {
        disconnectSessionSocket()
        user.value = null
        token.value = null
        isReady.value = false
        AuthService.logout()
    }

    async function fetchUser(force = false): Promise<void> {
        if (!token.value) {
            isReady.value = true
            return
        }

        // SI FORCE ES TRUE, IGNORAMOS EL CACHÉ Y OBLIGAMOS A CONSULTAR AL BACKEND
        if (!force && user.value) {
            isReady.value = true
            return
        }

        try {
            const { default: api } = await import('../api/axios')
            const response = await api.get('/me')
            const userData = response.data

            user.value = userData
            sessionStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData))
        } catch (error) {
            console.warn('Sesión expirada o inválida, o error al conectar con Api', error)
        } finally {
            isReady.value = true
        }
    }

    function hasPermission(permission: string): boolean {
        if (!user.value) return false

        if (user.value.roles && user.value.roles.includes('Super Admin')) return true

        const userPerms = user.value.permissions || user.value.permisos || []
        if (Array.isArray(userPerms)) {
            return userPerms.includes(permission)
        }

        return false
    }

    function hasRole(role: string): boolean {
        if (!user.value) return false
        return !!(user.value.roles && user.value.roles.includes(role))
    }

    async function checkAuth(): Promise<void> {
        await fetchUser()
    }

    // --- MÉTODOS DE SOCKETS Y CIERRE ---
    function initSessionSocket(): void {
        if (!token.value || !user.value) return
        if (echoInstance.value) return // Evitar conexiones duplicadas

        (window as any).Pusher = Pusher

        echoInstance.value = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
            wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8082,
            wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8082,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${import.meta.env.VITE_MOTHER_API_URL}/api/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    Accept: 'application/json'
                }
            }
        })

        // Escuchar canal privado del usuario centralizado
        echoInstance.value.private(`user.${user.value.id}`)
            .listen('.InactivityExpiringSoon', (e: any) => {
                inactivitySessionId.value = e.sessionId
                inactivityCountdown.value = Math.round(e.remainingSeconds) || 300
                showInactivityModal.value = true
                startLocalCountdown()
            })
            .listen('.SessionRenewed', (e: any) => {
                if (inactivitySessionId.value === e.sessionId) {
                    showInactivityModal.value = false
                    stopLocalCountdown()
                }
            })
            .listen('.SessionForceClosed', () => {
                stopLocalCountdown()
                disconnectSessionSocket()
                AuthService.logoutLocal()
                const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                window.location.href = `${motherAppUrl}/login?session_expired=true`
            })
            .error((error: any) => {
                console.warn('Error de autorización en canal de sockets:', error)
                if (error && (error.status === 401 || error.status === 403)) {
                    stopLocalCountdown()
                    disconnectSessionSocket()
                    AuthService.logoutLocal()
                    const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                    window.location.href = `${motherAppUrl}/login?session_expired=true`
                }
            })
    }

    function disconnectSessionSocket(): void {
        if (echoInstance.value) {
            echoInstance.value.disconnect()
            echoInstance.value = null
        }
        showInactivityModal.value = false
        inactivitySessionId.value = null
        stopLocalCountdown()
    }

    function startLocalCountdown(): void {
        if (countdownTimerId) clearInterval(countdownTimerId)
        countdownTimerId = setInterval(() => {
            if (inactivityCountdown.value > 0) {
                inactivityCountdown.value--
            } else {
                clearInterval(countdownTimerId)
                AuthService.logoutLocal()
                const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                window.location.href = `${motherAppUrl}/login?session_expired=true`
            }
        }, 1000)
    }

    function stopLocalCountdown(): void {
        if (countdownTimerId) {
            clearInterval(countdownTimerId)
            countdownTimerId = null
        }
    }

    async function sendHeartbeatPing(): Promise<void> {
        if (!inactivitySessionId.value || isHeartbeatLoading.value) return
        isHeartbeatLoading.value = true
        try {
            const motherApiUrl = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000'
            const { default: axios } = await import('axios')
            await axios.post(`${motherApiUrl}/api/sso/heartbeat`, {
                session_id: inactivitySessionId.value
            }, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            showInactivityModal.value = false
            stopLocalCountdown()
        } catch (err) {
            console.error('Error al enviar ping de heartbeat a la Madre:', err)
            logout()
        } finally {
            isHeartbeatLoading.value = false
        }
    }

    return {
        user,
        token,
        processingSSO,
        isReady,
        userAvatar,
        login,
        handlePKCECallback,
        handleDirectToken,
        logout,
        fetchUser,
        checkAuth,
        hasPermission,
        hasRole,
        // Sockets e Inactividad
        echoInstance,
        showInactivityModal,
        inactivitySessionId,
        inactivityCountdown,
        isHeartbeatLoading,
        initSessionSocket,
        disconnectSessionSocket,
        sendHeartbeatPing
    }
})
