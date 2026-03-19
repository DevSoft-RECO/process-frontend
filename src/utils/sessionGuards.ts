import api from '@/api/axios';
import Swal from 'sweetalert2';

export const startSessionGuards = () => {
    // ----------------------------------------------------
    // 1. EL "HEARTBEAT" CADA 5 MINUTOS (Sondeo Seguro)
    // ----------------------------------------------------
    setInterval(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'https://api.madre.com';
            api.get(`${MOTHER_API_URL}/api/me`).catch(() => {
                console.log("Heartbeat detectó cierre global u offline.");
            });
        }
    }, 5 * 60 * 1000); // 5 minutos

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
            const token = localStorage.getItem('access_token');
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
