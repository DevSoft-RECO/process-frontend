import axios from 'axios';

// Variables de entorno
const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';
const MOTHER_APP_URL = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173';

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
        const redirect_uri = `${window.location.origin}/callback`;
        
        const authUrl = `${MOTHER_API_URL}/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=&code_challenge=${challenge}&code_challenge_method=S256`;
        window.location.href = authUrl;
    },

    /**
     * 2. PROCESAR TOKEN DIRECTO (SSO Implícito)
     */
    processDirectToken(token: string, userData: any = null): TokenResponse {
        if (!token) throw new Error('Token no proporcionado.');

        localStorage.setItem('access_token', token);

        if (userData) {
            const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
            localStorage.setItem('user_data', JSON.stringify(user));
            return { access_token: token, user };
        }

        return { access_token: token };
    },

    /**
     * 3. OBTENER USUARIO (API Madre)
     */
    async getUser(): Promise<any> {
        const token = localStorage.getItem('access_token');
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
        window.location.href = `${MOTHER_APP_URL}/logout`;
    },

    logoutLocal(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('user_data');
        sessionStorage.removeItem('pkce_verifier');
    }
};
