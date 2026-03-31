import axios, { type InternalAxiosRequestConfig } from 'axios';
import { AUTH_KEYS } from '../utils/auth-keys';

// URL de la App Madre (Desde el .env)
const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';

const motherApi = axios.create({
    baseURL: `${MOTHER_API_URL}/api`,
});

// Interceptor para inyectar SIEMPRE el token desde sessionStorage
motherApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
        if (token) {
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers.Authorization = authHeader;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default {
    // El "Buscador Global" para asignar tareas a gente que aun no entra a la hija
    searchUsers(query: string) {
        // Aseguramos que el path sea relativo a baseURL (/api)
        // O si baseURL ya tiene /api, entonces solo /users/search.
        // Si baseURL es localhost:8000/api -> /users/search -> localhost:8000/api/users/search
        return motherApi.get(`/users/search?q=${query}`);
    },

    getMyProfile() {
        return motherApi.get('/me');
    }
};
