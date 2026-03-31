import axios from 'axios';
import { AUTH_KEYS } from '../utils/auth-keys';

// Variables de entorno
const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';

export interface UserData {
    [key: string]: any;
}

export interface TokenResponse {
    access_token: string;
    user?: UserData;
}

export default {
    /**
     * 1. INICIAR LOGIN (Navegador)
     */
    async login(): Promise<void> {
        const { preparePKCE } = await import('../utils/auth-crypto');
        const challenge = await preparePKCE();
        const client_id = import.meta.env.VITE_CLIENT_ID || '019b27d0-4adc-70f7-ba93-84024bf43d46';
        const redirect_uri = import.meta.env.VITE_REDIRECT_URI;

        const authUrl = new URL(`${MOTHER_API_URL}/oauth/authorize`);
        authUrl.searchParams.append('client_id', client_id);
        authUrl.searchParams.append('redirect_uri', redirect_uri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', '*');
        authUrl.searchParams.append('code_challenge', challenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');
        authUrl.searchParams.append('v', Date.now().toString());

        // Anti-Race Condition: setTimeout de 300ms para asegurar que el almacenamiento se persista
        setTimeout(() => {
            window.location.href = authUrl.toString();
        }, 300);
    },

    /**
     * 2. PROCESAR TOKEN DIRECTO (SSO Implícito)
     */
    processDirectToken(token: string, userData: any = null): TokenResponse {
        if (!token) throw new Error('Token no proporcionado.');

        sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);

        if (userData) {
            const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
            sessionStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(user));
            return { access_token: token, user };
        }

        return { access_token: token };
    },

    /**
     * 3. OBTENER USUARIO (API Madre)
     */
    async getUser(): Promise<any> {
        const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
        if (!token) throw new Error("No hay token disponible");

        const response = await axios.get(`${MOTHER_API_URL}/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        return response.data;
    },

    /**
     * 4. LOGOUT CENTRALIZADO (Desde App Madre)
     */
    logout(): void {
        this.logoutLocal();
        window.location.href = `${MOTHER_API_URL}/logout`;
    },

    logoutLocal(): void {
        // 1. Limpiar claves prefijadas (NUEVO ESTÁNDAR)
        const keysToRemove = Object.values(AUTH_KEYS);
        keysToRemove.forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });

        // 2. Limpiar claves antiguas/comunes (HISTÓRICO)
        // Para evitar colisiones si el usuario tiene pestañas viejas abiertas.
        const legacyKeys = ['access_token', 'user_data', 'pkce_verifier', 'auth_redirect_to', 'yk_storage_version'];
        legacyKeys.forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
    }
};
