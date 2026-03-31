import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { AUTH_KEYS } from '../utils/auth-keys';

// Cliente para la App Hija (Local / Espejo)
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // Aseguramos que apunte a /api
    headers: {
        'Accept': 'application/json'
    }
});

// --- INTERCEPTOR DE REQUEST (Salida) ---
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);

        console.log(`[Axios Local] Preparando petición a: ${config.url}`);

        if (token) {
            console.log("[Axios Local] Token encontrado en sessionStorage. Agregando header Authorization.");
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers.Authorization = authHeader;
        } else {
            console.warn("[Axios Local] ADVERTENCIA: No se encontró token en sessionStorage. La petición irá sin autenticación.");
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPONSE (Llegada) ---
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            console.error('[Axios Local] Error 401. El token fue enviado pero rechazado por el servidor.');
            
            // Evitar bucles de redirección (Cerrojo SSO)
            if (!sessionStorage.getItem(AUTH_KEYS.SSO_LOCK)) {
                sessionStorage.setItem(AUTH_KEYS.SSO_LOCK, 'true');
                sessionStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
                sessionStorage.removeItem(AUTH_KEYS.USER_DATA);

                /*
                import('@/services/AuthService').then(module => {
                    module.default.login();
                });
                */
                console.error("[Axios Local] Error 401 detectado, pero la redirección automática está deshabilitada (Modo Debug).");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
