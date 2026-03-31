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

        if (token) {
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers.Authorization = authHeader;
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
            
            // Evitar bucles de redirección (Cerrojo SSO)
            if (!sessionStorage.getItem(AUTH_KEYS.SSO_LOCK)) {
                sessionStorage.setItem(AUTH_KEYS.SSO_LOCK, 'true');
                sessionStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
                sessionStorage.removeItem(AUTH_KEYS.USER_DATA);

                import('@/services/AuthService').then(module => {
                    module.default.login();
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
