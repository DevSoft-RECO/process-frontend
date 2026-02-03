import axios, { type InternalAxiosRequestConfig } from 'axios';

// URL de la App Madre (Debe estar en .env)
// Helper para asegurar que la URL termine en /api
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // Quitamos slash final si existe
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // Si no termina en /api, lo agregamos
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const MOTHER_API_URL = getBaseUrl();

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
        // Aseguramos que el path sea relativo a baseURL (/api)
        // O si baseURL ya tiene /api, entonces solo /users/search.
        // Si baseURL es localhost:8000/api -> /users/search -> localhost:8000/api/users/search
        return motherApi.get(`/users/search?q=${query}`);
    },

    getMyProfile() {
        return motherApi.get('/me');
    }
};
