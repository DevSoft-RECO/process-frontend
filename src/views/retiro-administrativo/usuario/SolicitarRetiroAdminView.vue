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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'

// Estados
const criterioBusqueda = ref('')
const isLoading = ref(false)
const mensajeError = ref('')
const expedienteEncontrado = ref<any>(null)
const modalConfirmacion = ref(false)

// Métodos
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
}
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
