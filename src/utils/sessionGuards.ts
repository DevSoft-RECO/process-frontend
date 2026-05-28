import Swal from 'sweetalert2';
import { AUTH_KEYS } from './auth-keys';

export const startSessionGuards = () => {
    // ----------------------------------------------------
    // 1. EL AVISO DE CORTE DE JORNADA A LAS 5:50 PM
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
