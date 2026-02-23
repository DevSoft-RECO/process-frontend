import { defineStore } from 'pinia';
import api from '@/api/axios';
import Swal from 'sweetalert2';

export interface Report {
    id: number;
    usuario_id: number;
    tipo_reporte: string;
    estado: 'pendiente' | 'procesando' | 'completado' | 'fallido';
    progreso_porcentaje: number;
    file_path: string | null;
    error_msg: string | null;
    created_at: string;
    updated_at: string;
}

export const useReportStore = defineStore('report', {
    state: () => ({
        myReports: [] as Report[],
        loadingReports: false as boolean,
        isRequesting: false as boolean,
        pollingInterval: null as ReturnType<typeof setInterval> | null,
        isWidgetVisible: false as boolean,
        isWidgetMinimized: false as boolean
    }),
    getters: {
        activeReports: (state) => state.myReports.filter(r => r.estado === 'pendiente' || r.estado === 'procesando'),
        completedReports: (state) => state.myReports.filter(r => r.estado === 'completado'),
        failedReports: (state) => state.myReports.filter(r => r.estado === 'fallido'),
        hasActiveReports: (state) => state.myReports.some(r => r.estado === 'pendiente' || r.estado === 'procesando')
    },
    actions: {
        async requestSegaCSV() {
            this.isRequesting = true;
            try {
                await api.post('/exportar/seguimiento-csv');


                // Mostrar widget 
                this.isWidgetVisible = true;
                this.isWidgetMinimized = false;

                await this.fetchMyReports(); // Cargar la nueva info
            } catch (error) {
                console.error('Error enviando a cola', error);
                Swal.fire('Error', 'No se pudo generar la solicitud del reporte.', 'error');
            } finally {
                this.isRequesting = false;
            }
        },

        async requestReporteGeneralAgencias(agenciasIds: number[]) {
            this.isRequesting = true;
            try {
                await api.post('/exportar/general-agencias', {
                    agencias: agenciasIds
                });

                this.isWidgetVisible = true;
                this.isWidgetMinimized = false;
                await this.fetchMyReports();
            } catch (error) {
                console.error('Error enviando a cola reporte de agencias', error);
                Swal.fire('Error', 'No se pudo generar el reporte de agencias.', 'error');
            } finally {
                this.isRequesting = false;
            }
        },

        async fetchMyReports() {
            if (this.myReports.length === 0) {
                this.loadingReports = true;
            }
            try {
                const response = await api.get('/exportar/mis-reportes');
                if (response.data && response.data.success) {
                    this.myReports = response.data.data;

                    // Asegurarnos que el widget esté visible si hay reportes que no hemos cerrado
                    if (this.myReports.length > 0) {
                        this.isWidgetVisible = true;
                    }

                    // Iniciar polling si hay algo en progreso, y detenerlo si no hay
                    if (this.hasActiveReports) {
                        this.startPolling();
                    } else {
                        this.stopPolling();
                    }
                }
            } catch (error) {
                console.error('Error leyendo reportes', error);
            } finally {
                this.loadingReports = false;
            }
        },

        async downloadReportFile(id: number) {
            try {
                Swal.fire({
                    title: 'Descargando...',
                    text: 'Preparando archivo local...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                const response = await api.get(`/exportar/descargar/${id}`, {
                    responseType: 'blob'
                });

                let filename = `Reporte_Expedientes_${id}.csv`;
                const disposition = response.headers['content-disposition'];
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();

                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
                window.URL.revokeObjectURL(url);

                Swal.close();
            } catch (error) {
                console.error('Error bajando reporte completado', error);
                Swal.fire('Error', 'El archivo no existe o ya caducó. Genera uno nuevo.', 'error');
            }
        },

        async deleteReport(id: number) {
            const result = await Swal.fire({
                title: '¿Eliminar reporte?',
                text: "El archivo descargable será borrado de los servidores.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/exportar/borrar/${id}`);
                    // Remover de la lista local en UI
                    this.myReports = this.myReports.filter(r => r.id !== id);

                    if (this.myReports.length === 0) {
                        this.isWidgetVisible = false;
                    }

                    Swal.fire({
                        title: 'Eliminado',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } catch (error) {
                    console.error('Fallo borrar reporte', error);
                    Swal.fire('Error', 'No se pudo eliminar el archivo', 'error');
                }
            }
        },

        startPolling() {
            if (this.pollingInterval) return;

            this.pollingInterval = setInterval(async () => {
                if (!this.hasActiveReports) {
                    this.stopPolling();
                    return;
                }
                await this.fetchMyReports();
            }, 5000);
        },

        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },

        toggleMinimize() {
            this.isWidgetMinimized = !this.isWidgetMinimized;
        },

        openWidget() {
            this.isWidgetVisible = true;
            this.isWidgetMinimized = false;
        },

        closeWidget() {
            this.isWidgetVisible = false;
            this.isWidgetMinimized = false;
            this.stopPolling(); // Para de preguntar si el admin lo cerró a la fuerza
        }
    }
});
