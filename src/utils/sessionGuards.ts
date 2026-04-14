import api from '@/api/axios';
import Swal from 'sweetalert2';
import { AUTH_KEYS } from './auth-keys';

export const startSessionGuards = () => {
    // ----------------------------------------------------
    // 1. EL "HEARTBEAT" CADA 5 MINUTOS (Sondeo Seguro)
    // ----------------------------------------------------
    setInterval(() => {
        const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
        if (token) {
            const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'https://api-portal.yamankutx.com.gt';
            api.get(`${MOTHER_API_URL}/api/me`).catch((error) => {
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado por inactividad. Serás redirigido al inicio por seguridad.',
                        confirmButtonText: 'Entendido',
                        allowOutsideClick: false,
                        confirmButtonColor: '#3085d6',
                    }).then(() => {
                        const MOTHER_FRONT_URL = import.meta.env.VITE_MOTHER_APP_URL || 'https://api-portal.yamankutx.com.gt';
                        window.location.href = `${MOTHER_FRONT_URL}/login?session_expired=true`;
                    });
                }
            });
        }
    }, 5 * 60 * 1000); // cada 5 minutos

    // ----------------------------------------------------
    // 2. EL AVISO DE CORTE DE JORNADA A LAS 5:50 PM
    // ----------------------------------------------------
    // Calculamos cuántos milisegundos faltan para las 17:50
    const now = new Date();
    const alertTime = new Date();
    alertTime.setHours(17, 50, 0, 0); // 5:50:00 PM
    let msUntilAlert = alertTime.getTime() - now.getTime();

    // Si ya pasaron las 5:50 PM, no ponemos el timeout para hoy
    if (msUntilAlert > 0) {
        setTimeout(() => {
            const token = sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
            if (token) {
                // Notificación visual flotante estilo Toast (Top End)
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Jornada por finalizar',
                    text: 'Tu sesión se cerrará en 10 minutos. Por favor, guarda tus cambios.',
                    showConfirmButton: true,
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#f59e0b',
                    timer: 60000 // Se oculta solo en 1 minuto
                });
            }
        }, msUntilAlert);
    }
};
