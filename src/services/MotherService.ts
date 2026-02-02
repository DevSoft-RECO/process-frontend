import axios, { type InternalAxiosRequestConfig } from 'axios';

// URL de la App Madre (Debe estar en .env)
const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'https://process.yamankutx.com.gt/api';

const motherApi = axios.create({
    baseURL: MOTHER_API_URL,
});

// Interceptor para inyectar SIEMPRE el token que tienes en localStorage
motherApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
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
        return motherApi.get(`/users/search?q=${query}`);
    },

    getMyProfile() {
        return motherApi.get('/me');
    }
};
