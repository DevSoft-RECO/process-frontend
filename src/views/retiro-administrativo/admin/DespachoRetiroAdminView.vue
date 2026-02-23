<template>
  <div class="px-6 py-8 h-full flex flex-col">
    <div class="mb-8 fade-in shrink-0">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <svg class="w-8 h-8 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Despacho de Retiros Administrativos
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11">
        Bandeja central para gestionar y despachar los expedientes solicitados por las agencias.
      </p>
    </div>

    <div class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden fade-in flex flex-col min-h-[500px]">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex space-x-6 shrink-0">
            <button 
                @click="setTab('pendientes')"
                class="pb-2 text-md font-semibold border-b-2 transition-colors flex items-center gap-2"
                :class="activeTab === 'pendientes' ? 'border-azul-cope text-azul-cope dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Buzón Entrantes
            </button>
            <button 
                @click="setTab('despachados')"
                class="pb-2 text-md font-semibold border-b-2 transition-colors flex items-center gap-2"
                :class="activeTab === 'despachados' ? 'border-azul-cope text-azul-cope dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                Despachados / En Ruta
            </button>
            <button 
                @click="setTab('historico')"
                class="pb-2 text-md font-semibold border-b-2 transition-colors flex items-center gap-2"
                :class="activeTab === 'historico' ? 'border-azul-cope text-azul-cope dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                Historial Finalizados
            </button>
            <div class="flex-1 flex justify-end">
                <button @click="loadRequests(1)" class="text-gray-500 hover:text-azul-cope transition-colors flex items-center gap-1 text-sm font-medium">
                    <svg class="w-4 h-4" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Actualizar
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-auto custom-scrollbar p-0">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detalles Solicitud</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Origen / Solicitante</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expediente</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Motivo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading">
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                            <svg class="animate-spin h-8 w-8 mx-auto text-azul-cope mb-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando solicitudes...
                        </td>
                    </tr>
                    <tr v-else-if="requests.length === 0">
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                            <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            <p class="text-lg">No se encontraron solicitudes en esta bandeja.</p>
                        </td>
                    </tr>
                    <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-bold text-gray-900 dark:text-white">ID: #{{ req.id }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {{ formatDate(req.fecha_solicitud) }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ req.agencia?.nombre || 'Agencia Desconocida' }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ req.usuario_solicita?.name || 'Usuario Desconocido' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            <div v-if="req.expediente">
                                <div class="font-medium truncate max-w-[200px]" :title="req.expediente.nombre_asociado">{{ req.expediente.nombre_asociado }}</div>
                                <div class="text-xs text-gray-500 mt-1">Doc: {{ req.expediente.numero_documento || 'N/A' }}</div>
                            </div>
                            <span v-else class="text-gray-400">N/A</span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" :title="req.observaciones">
                            {{ req.observaciones || 'Sin observaciones' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getStatusClass(req.estado_solicitud)" class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border">
                                {{ formatEstado(req.estado_solicitud) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end gap-2">
                                <!-- Botón Aceptar Solicitud -->
                                <button
                                    v-if="req.estado_solicitud === 'pendiente'"
                                    @click="aceptarSolicitud(req)"
                                    class="text-azul-cope bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                    title="Marcar como Recibido"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                    Aceptar
                                </button>

                                <!-- Botón Despachar Expediente -->
                                <button
                                    v-if="req.estado_solicitud === 'recibido_por_admin'"
                                    @click="abrirModalDespacho(req)"
                                    class="text-white bg-verde-cope hover:bg-verde-cope/90 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                    title="Despachar Físicamente"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    Despachar
                                </button>
                                
                                <!-- Botón Confirmar Reingreso -->
                                <button
                                    v-if="req.estado_solicitud === 'despachado' && req.estado === 'retornando'"
                                    @click="confirmarReingresoExpediente(req)"
                                    class="text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                    title="Confirmar que el expediente regresó al Archivo"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                    Reingresar y Cerrar
                                </button>

                                <span v-if="req.estado_solicitud === 'despachado' && req.estado !== 'retornando'" class="text-xs text-gray-400 italic">En Agencia...</span>
                                <span v-if="req.estado_solicitud === 'archivado'" class="text-xs text-gray-400 italic">Finalizado</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Pagination Component -->
        <div v-if="lastPage > 1" class="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between shrink-0">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Mostrando pág {{ currentPage }} de {{ lastPage }} ({{ totalResults }} totales)
            </div>
            <div class="flex gap-2">
                <button 
                    @click="loadRequests(currentPage - 1)" 
                    :disabled="currentPage === 1"
                    class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Anterior
                </button>
                <button 
                    @click="loadRequests(currentPage + 1)" 
                    :disabled="currentPage === lastPage"
                    class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const activeTab = ref('pendientes')
const loading = ref(false)
const requests = ref<any[]>([])

const currentPage = ref(1)
const lastPage = ref(1)
const totalResults = ref(0)

const setTab = (tab: string) => {
    activeTab.value = tab
    loadRequests(1)
}

const loadRequests = async (page = 1) => {
    loading.value = true
    try {
        const response = await api.get('/solicitudes-administrativas/admin', {
            params: {
                estado: activeTab.value,
                page: page
            }
        });
        
        if (response.data.success) {
            requests.value = response.data.data.data;
            currentPage.value = response.data.data.current_page;
            lastPage.value = response.data.data.last_page;
            totalResults.value = response.data.data.total;
        }
    } catch (error) {
        console.error("Error cargando solicitudes admin:", error);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    } finally {
        loading.value = false;
    }
}

const aceptarSolicitud = async (req: any) => {
    try {
        const response = await api.post(`/solicitudes-administrativas/${req.id}/aceptar`);
        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Aceptada',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            loadRequests(currentPage.value);
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Error al aceptar la solicitud', 'error');
    }
}

const abrirModalDespacho = async (req: any) => {
    const { value: observacionesAdicionales, isConfirmed } = await Swal.fire({
        title: 'Despachar Archivo Administrativo',
        html: `¿Confirmar salida física del archivo administrativo del expediente <b>${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id})</b> hacia ${req.agencia?.nombre}?<br><br>Puede agregar una nota de despacho (opcional):`,
        input: 'textarea',
        inputPlaceholder: 'Observaciones de envío...',
        showCancelButton: true,
        confirmButtonText: 'Despachar Archivo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
    });

    if (isConfirmed) {
        despacharExpediente(req.id, observacionesAdicionales);
    }
}

const despacharExpediente = async (id: number, notas: string) => {
    try {
        const response = await api.post(`/solicitudes-administrativas/${id}/despachar`, {
            observacion_despacho: notas
        });
        
        if (response.data.success) {
            Swal.fire('Despachado', 'El expediente ha sido registrado como enviado.', 'success');
            loadRequests(currentPage.value);
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Error al despachar el expediente', 'error');
    }
}

const confirmarReingresoExpediente = async (req: any) => {
    const { isConfirmed } = await Swal.fire({
        title: 'Reingresar Archivo Administrativo',
        text: `¿Confirma que el archivo administrativo del expediente ${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id}) está físicamente de vuelta y quiere archivar esta solicitud?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reingresar y cerrar',
        cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
        try {
            const response = await api.post(`/solicitudes-administrativas/${req.id}/reingreso`);
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Finalizado',
                    text: 'El expediente fue reingresado y la solicitud archivada.',
                    timer: 2500,
                    showConfirmButton: false
                });
                loadRequests(currentPage.value);
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error al reingresar el expediente', 'error');
        }
    }
}

const getStatusClass = (estado: string) => {
    switch (estado?.toLowerCase()) {
        case 'pendiente':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800'
        case 'recibido_por_admin':
            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800'
        case 'despachado':
            return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800'
        case 'archivado':
            return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    }
}

const formatEstado = (estado: string) => {
    if (!estado) return 'Desconocido';
    const clean = estado.replace(/_/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    loadRequests()
})
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
</style>
