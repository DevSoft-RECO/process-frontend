import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'
import { AUTH_KEYS } from '../utils/auth-keys'

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
    
    console.log(`[Store] Version Check: Local=${savedVersion}, App=${STORAGE_VERSION}. Flow: Callback=${isCallbackPage}, Verifier=${hasPKCEVerifier}, Token=${hasNewToken}`);

    if (savedVersion !== STORAGE_VERSION) {
        if (!isCallbackPage && !hasPKCEVerifier && !hasNewToken) {
            console.warn("[Store] Versión antigua detectada. Ejecutando limpieza nuclear de almacenamiento...");
            AuthService.logoutLocal();
            localStorage.setItem(AUTH_KEYS.STORAGE_VERSION, STORAGE_VERSION);
        } else {
            console.log("[Store] Versión pendiente de actualizar, pero respetando flujo PKCE activo.");
            localStorage.setItem(AUTH_KEYS.STORAGE_VERSION, STORAGE_VERSION);
        }
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem(AUTH_KEYS.USER_DATA) || 'null'))
    const token = ref<string | null>(sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN) || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    console.log(`[Store] Estado Inicial: Token=${!!token.value ? 'SI' : 'NO'}, User=${!!user.value ? 'SI' : 'NO'}`);

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
        const localVerifier = localStorage.getItem(AUTH_KEYS.PKCE_VERIFIER);
        const sessionVerifier = sessionStorage.getItem(AUTH_KEYS.PKCE_VERIFIER);
        
        if (!localVerifier && !sessionVerifier) {
            throw new Error('No se encontró el verifier PKCE en ningún almacenamiento');
        }

        const finalVerifier = localVerifier || (sessionVerifier as string);

        const client_id = import.meta.env.VITE_CLIENT_ID;
        const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
        const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';

        const { default: axios } = await import('axios');
        console.log(`[Store] Intercambiando código PKCE... Code=${code.substring(0, 10)}...`);
        
        const response = await axios.post(`${MOTHER_API_URL}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: client_id,
            redirect_uri: redirect_uri,
            code_verifier: finalVerifier,
            code: code
        });

        const accessToken = response.data.access_token;
        console.log(`[Store] Token recibido con éxito. Guardando en key: ${AUTH_KEYS.ACCESS_TOKEN}`);
        
        token.value = accessToken;
        sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
        
        // Limpiar verifier de todos los posibles lugares
        sessionStorage.removeItem(AUTH_KEYS.PKCE_VERIFIER);
        localStorage.removeItem(AUTH_KEYS.PKCE_VERIFIER);
        processingSSO.value = false;

        await fetchUser(true); // Forzar descarga de perfil limpio tras login
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
        hasRole
    }
})
