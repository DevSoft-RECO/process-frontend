<template>
  <div class="px-6 py-8">
    <div class="mb-8 fade-in">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <svg class="w-8 h-8 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        </svg>
        Solicitud de Retiro de Documento Administrativo
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11">
        Busque un expediente por su ID o Número de Documento para solicitar su retiro.
      </p>
    </div>

    <!-- Buscador -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 fade-in">
      <form @submit.prevent="buscarExpediente" class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Criterio de Búsqueda (ID o No. Documento)
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="criterioBusqueda"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-verde-cope/50 focus:border-verde-cope transition-all duration-200"
              placeholder="Ej. 12345 o DOC-2023-001"
              :disabled="isLoading"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="isLoading || !criterioBusqueda"
          class="w-full md:w-auto px-6 py-2.5 bg-verde-cope hover:bg-verde-cope/90 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ isLoading ? 'Buscando...' : 'Buscar Expediente' }}
        </button>
      </form>

      <!-- Mensajes de Error/Éxito de Búsqueda -->
      <div v-if="mensajeError" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 fade-in">
        <svg class="h-5 w-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800 dark:text-red-400">Error en la búsqueda</h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ mensajeError }}</p>
        </div>
      </div>
    </div>

    <!-- Resultados de Búsqueda -->
    <div v-if="expedienteEncontrado" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden fade-in relative">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-azul-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detalles del Expediente
        </h3>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Validado para Retiro
        </span>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Asociado</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">{{ expedienteEncontrado.nombre_asociado }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No. CUI</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ expedienteEncontrado.cui || 'N/A' }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No. Documento</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ expedienteEncontrado.numero_documento }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Código de Cliente</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ expedienteEncontrado.codigo_cliente }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Agencia</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ expedienteEncontrado.agencia?.nombre || 'N/A' }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monto</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ expedienteEncontrado.monto_documento || 'N/A' }}</p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button 
            @click="limpiarBusqueda"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="modalConfirmacion = true"
            class="px-4 py-2 text-sm font-medium text-white bg-azul-cope hover:bg-azul-cope/90 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Solicitud de Retiro
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación y Justificación -->
    <div v-if="modalConfirmacion" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 fade-in">
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="modalConfirmacion = false"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between shrink-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Confirmar Solicitud
                </h3>
                <button @click="modalConfirmacion = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
                    <p class="text-sm text-blue-800 dark:text-blue-300">
                        Está a punto de solicitar el retiro físico del expediente de <strong>{{ expedienteEncontrado?.nombre_asociado }}</strong>.
                    </p>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo / Justificación *</label>
                        <textarea 
                            v-model="observaciones"
                            rows="4"
                            class="block w-full border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-verde-cope/50 focus:border-verde-cope sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            placeholder="Detalle la razón por la que requiere retirar este expediente (Ej. Revisión de firmas, Actualización de datos, etc.)."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 shrink-0 flex justify-end gap-3">
                <button 
                    @click="modalConfirmacion = false"
                    :disabled="isSubmitting"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button 
                    @click="confirmarYEnviar"
                    :disabled="isSubmitting || !observaciones.trim()"
                    class="px-4 py-2 text-sm font-medium text-white bg-azul-cope border border-transparent rounded-lg shadow-sm hover:bg-azul-cope/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-cope flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isSubmitting ? 'Enviando...' : 'Confirmar Solicitud' }}</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Active and Historic Requests Section -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden fade-in flex flex-col h-[500px]">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex space-x-4">
            <button 
                @click="activeTab = 'active'"
                class="pb-2 text-lg font-semibold border-b-2 transition-colors"
                :class="activeTab === 'active' ? 'border-azul-cope text-azul-cope dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
                Solicitudes Activas
            </button>
            <button 
                @click="activeTab = 'historic'"
                class="pb-2 text-lg font-semibold border-b-2 transition-colors"
                :class="activeTab === 'historic' ? 'border-azul-cope text-azul-cope dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
                Historial (Finalizadas)
            </button>
            <div class="flex-1 flex justify-end">
                <button @click="loadRequests" class="text-gray-500 hover:text-azul-cope transition-colors flex items-center gap-1 text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Actualizar
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-auto custom-scrollbar p-0">
            <!-- Active Table -->
            <table v-if="activeTab === 'active'" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expediente</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documento</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loadingRequests">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500">Cargando solicitudes...</td>
                    </tr>
                    <tr v-else-if="activeRequests.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500 flex flex-col items-center justify-center">
                            <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2z" /></svg>
                            <p>No tienes solicitudes activas en este momento.</p>
                        </td>
                    </tr>
                    <tr v-for="req in activeRequests" :key="req.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {{ formatDate(req.fecha_solicitud) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                            <div v-if="req.expediente">
                                <div>{{ req.expediente.nombre_asociado }}</div>
                                <div class="text-xs text-gray-500 mt-1">ID: {{ req.expediente.id }}</div>
                            </div>
                            <span v-else class="text-gray-400">N/A</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ req.expediente?.numero_documento || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getStatusClass(req.estado)" class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border">
                                {{ req.estado.toUpperCase() }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Historic Table -->
            <table v-if="activeTab === 'historic'" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Finalización</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expediente</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documento</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loadingRequests">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500">Cargando historial...</td>
                    </tr>
                    <tr v-else-if="historicRequests.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                            <p>No tienes solicitudes finalizadas en tu historial.</p>
                        </td>
                    </tr>
                    <tr v-for="req in historicRequests" :key="req.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {{ formatDate(req.fecha_finalizacion || req.updated_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                            <div v-if="req.expediente">
                                <div>{{ req.expediente.nombre_asociado }}</div>
                                <div class="text-xs text-gray-500 mt-1">ID: {{ req.expediente.id }}</div>
                            </div>
                            <span v-else class="text-gray-400">N/A</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ req.expediente?.numero_documento || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                                ARCHIVADO
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Pagination Component placeholder -->
        <div class="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Mostrando <span class="font-medium">{{ activeTab === 'active' ? activeRequests.length : historicRequests.length }}</span> resultados.
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estados
const criterioBusqueda = ref('')
const isLoading = ref(false)
const mensajeError = ref('')
const expedienteEncontrado = ref<any>(null)
const modalConfirmacion = ref(false)
const observaciones = ref('')
const isSubmitting = ref(false)

const activeTab = ref('active')
const loadingRequests = ref(false)
const activeRequests = ref<any[]>([])
const historicRequests = ref<any[]>([])

// Métodos
const loadRequests = async () => {
    loadingRequests.value = true
    try {
        const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;

        // Cargar solicitudes activas
        const resActive = await api.get('/solicitudes-administrativas', {
            params: { id_agencia: agencyId }
        });
        if (resActive.data.success) {
            activeRequests.value = resActive.data.data.data;
        }

        // Cargar historial
        const resHistoric = await api.get('/solicitudes-administrativas/historico', {
            params: { id_agencia: agencyId }
        });
        if (resHistoric.data.success) {
            historicRequests.value = resHistoric.data.data.data;
        }
    } catch (error) {
        console.error("Error cargando solicitudes:", error);
    } finally {
        loadingRequests.value = false;
    }
}

// Cargar al inicio
import { onMounted } from 'vue'
onMounted(() => {
    loadRequests()
})

const getStatusClass = (estado: string) => {
    switch (estado?.toLowerCase()) {
        case 'activo':
        case 'pendiente':
            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800'
        case 'aprobado':
            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800'
        case 'rechazado':
            return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    }
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

const buscarExpediente = async () => {
    if (!criterioBusqueda.value) return

    isLoading.value = true
    mensajeError.value = ''
    expedienteEncontrado.value = null

    try {
        const response = await api.get('/solicitudes-administrativas/buscar', {
            params: {
                criterio: criterioBusqueda.value
            }
        })

        if (response.data.success) {
            expedienteEncontrado.value = response.data.expediente
        }

    } catch (error: any) {
        if (error.response) {
            mensajeError.value = error.response.data.message || 'Error al validar el expediente.'
        } else {
            mensajeError.value = 'Error de conexión. Intente nuevamente.'
        }
    } finally {
        isLoading.value = false
    }
}

const limpiarBusqueda = () => {
    criterioBusqueda.value = ''
    expedienteEncontrado.value = null
    mensajeError.value = ''
    observaciones.value = ''
}

const confirmarYEnviar = async () => {
    // 1. Validar Justificación
    if (!observaciones.value.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe ingresar el motivo de la solicitud.',
            confirmButtonColor: '#005D97'
        });
        return;
    }

    // 2. Obtener la agencia del usuario (Se asume del authStore según otras vistas)
    const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;

    if (!agencyId) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Sesión',
            text: 'No se pudo identificar a qué agencia pertenece su usuario.',
            confirmButtonColor: '#005D97'
        });
        return;
    }

    isSubmitting.value = true;

    try {
        const payload = {
            id_expediente: expedienteEncontrado.value?.id,
            id_agencia: agencyId,
            observaciones: observaciones.value
        };

        const response = await api.post('/solicitudes-administrativas', payload);

        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Enviada',
                text: 'La solicitud de retiro administrativo se generó correctamente.',
                confirmButtonColor: '#10B981'
            }).then(() => {
                modalConfirmacion.value = false;
                limpiarBusqueda();
                loadRequests(); // Recargar las tablas
            });
        }
    } catch (error: any) {
        let msg = 'Ocurrió un error inesperado al enviar la solicitud.';
        if (error.response && error.response.data && error.response.data.message) {
            msg = error.response.data.message;
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
            confirmButtonColor: '#005D97'
        });
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
