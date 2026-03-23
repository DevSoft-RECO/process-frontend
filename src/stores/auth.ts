import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'

export interface User {
    [key: string]: any;
    roles?: string[];
    permissions?: string[];
    permisos?: string[];
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {

    // --- MIGRACIÓN Y LIMPIEZA DE CACHÉ (Anti-Old-Data) ---
    const STORAGE_VERSION = 'v3_hija5_clean'; 
    if (localStorage.getItem('yk_storage_version') !== STORAGE_VERSION) {
        const keysToRemove = ['access_token', 'user_data', 'pkce_verifier'];
        keysToRemove.forEach(k => {
           localStorage.removeItem(k);
           sessionStorage.removeItem(k);
        });
        localStorage.setItem('yk_storage_version', STORAGE_VERSION);
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user_data') || 'null'))
    const token = ref<string | null>(sessionStorage.getItem('access_token') || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    async function login(redirectTo: string | null = null): Promise<void> {
        if (processingSSO.value) return;
        processingSSO.value = true;
        
        if (redirectTo) {
            sessionStorage.setItem('auth_redirect_to', String(redirectTo));
        }
        
        await AuthService.login();
    }

    async function handlePKCECallback(code: string): Promise<void> {
        const verifier = sessionStorage.getItem('pkce_verifier')
        if (!verifier) throw new Error('No se encontró el verifier PKCE')

        const client_id = import.meta.env.VITE_CLIENT_ID;
        const redirect_uri = `${window.location.origin}/callback`;
        const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';

        const { default: axios } = await import('axios');
        const response = await axios.post(`${MOTHER_API_URL}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: client_id,
            redirect_uri: redirect_uri,
            code_verifier: verifier,
            code: code
        });

        const accessToken = response.data.access_token;
        token.value = accessToken;
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.removeItem('pkce_verifier');
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
            sessionStorage.setItem('user_data', JSON.stringify(userData))
            // Quitamos de localStorage si estuviera ahí por versiones anteriores
            localStorage.removeItem('user_data')
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
