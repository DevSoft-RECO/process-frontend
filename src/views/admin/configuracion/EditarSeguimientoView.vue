<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Editar Seguimiento de Expediente</h2>

    <!-- Buscador -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar Expediente
          </label>
          <div class="relative">
             <input
              v-model="searchQuery"
              type="text"
              placeholder="Ingrese ID o Número de Documento"
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-verde-cope focus:border-verde-cope
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <button
          @click="handleSearch"
          :disabled="loading"
          class="px-6 py-2 bg-verde-cope hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Buscar</span>
        </button>
      </div>

      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="expediente" class="fade-in space-y-6">
        
        <!-- Header del Expediente -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ expediente.numero_documento }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ expediente.id }} | Asesor: {{ expediente.usuario_asesor }}</p>
            </div>
            <button 
                @click="saveChanges" 
                :disabled="saving"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-2"
            >
                <svg v-if="saving" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>Guardar Cambios</span>
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Panel Seguimiento -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">Estado y Seguimiento</h3>
                </div>
                <div class="p-6 grid grid-cols-1 gap-4">
                    <!-- ID Estado -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Estado Principal</label>
                        <input v-model.number="formSeguimiento.id_estado" type="number" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                    <!-- ID Estado Secundario -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Estado Secundario</label>
                        <input v-model.number="formSeguimiento.id_estado_secundario" type="number" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                    <!-- Enviado a Archivos -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Enviado a Archivos (Si/No)</label>
                         <select v-model="formSeguimiento.enviado_a_archivos" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                             <option :value="null">N/A</option>
                        </select>
                    </div>

                     <!-- Archivo Administrativo -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo Administrativo (Si/No)</label>
                         <select v-model="formSeguimiento.archivo_administrativo" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                             <option :value="null">N/A</option>
                        </select>
                    </div>

                     <!-- Observación Rechazo -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Observación Rechazo</label>
                        <textarea v-model="formSeguimiento.observacion_rechazo" rows="2" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50"></textarea>
                    </div>

                    <!-- Observación Legal -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Observación Legal</label>
                        <textarea v-model="formSeguimiento.observacion_legal" rows="2" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50"></textarea>
                    </div>

                    <!-- Observación Envio -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Observación Envío</label>
                        <textarea v-model="formSeguimiento.observacion_envio" rows="2" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50"></textarea>
                    </div>


                    <!-- Es Pagaré -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Es Pagaré (si/no)</label>
                        <input v-model="formSeguimiento.es_un_pagare" type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                    <!-- Número de Contrato -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Contrato</label>
                        <input v-model="formSeguimiento.numero_contrato" type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                    <!-- Bufete ID -->
                    <div>
                         <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bufete ID</label>
                        <input v-model.number="formSeguimiento.bufete_id" type="number" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                    <!-- Recibí Pagaré -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recibí Pagaré</label>
                         <select v-model="formSeguimiento.recibi_pagare" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                             <option :value="null">N/A</option>
                        </select>
                    </div>

                    <!-- Recibí Garantía Real -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recibí Garantía Real</label>
                         <select v-model="formSeguimiento.recibi_garantia_real" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                             <option :value="null">N/A</option>
                        </select>
                    </div>

                    <!-- Recibí Contrato -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recibí Contrato</label>
                         <select v-model="formSeguimiento.recibi_contrato" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                             <option :value="null">N/A</option>
                        </select>
                    </div>

                    <!-- Path Contrato -->
                    <div class="lg:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Path Contrato</label>
                        <input v-model="formSeguimiento.path_contrato" type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>

                     <!-- Archivado At -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivado At (Timestamp)</label>
                         <input v-model="formSeguimiento.archivado_at" type="datetime-local" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>
                </div>
            </div>

            <!-- Panel Fechas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">Fechas (Cronología)</h3>
                </div>
                <div class="p-6 grid grid-cols-1 gap-4">
                    <div v-for="(value, key) in formFechas" :key="key">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{{ formatLabel(key) }}</label>
                        <input type="datetime-local" v-model="formFechas[key]" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50">
                    </div>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/api/axios'
import Swal from 'sweetalert2'

const searchQuery = ref('')
const expediente = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const formSeguimiento = ref({})
const formFechas = ref({})

// Lista de fechas editables
const dateFields = [
    'f_recepcion_secretaria',
    'f_analisis_credito',
    'f_comite_credito',
    'f_desembolso',
    'f_entrega_agencia',
    'f_envio_abogado',
    'f_retorno_abogado',
    'f_enviado_archivos',
    'f_ingreso_archivo',
    'f_enviado_secretaria_credito',
    'f_aceptado_secretaria',
    'f_retorno_asesores',
    'f_enviado_protocolos',
    'f_ultimo_rechazo',
    'f_aceptado_secretaria_credito',
    'f_aceptado_abogado',
    'f_almacenado_admin'
]

const handleSearch = async () => {
    if (!searchQuery.value) return
    
    loading.value = true
    error.value = null
    expediente.value = null
    
    try {
        const response = await axios.get('/editar-seguimiento/search', {
            params: { query: searchQuery.value }
        })
        const data = response.data.data
        expediente.value = data
        
        // Populate Forms
        formSeguimiento.value = { ...data.seguimientos }
        // Ensure archived_at is formatted for datetime-local
        if (formSeguimiento.value.archivado_at) {
             formSeguimiento.value.archivado_at = formatDateTimeLocal(formSeguimiento.value.archivado_at)
        }
        
        // Initialize dates
        const fechas = data.fechas || {}
        const newFechas = {}
        dateFields.forEach(field => {
            // Convertir formato si es necesario, datetime-local espera YYYY-MM-DDTHH:MM
            newFechas[field] = formatDateTimeLocal(fechas[field])
        })
        formFechas.value = newFechas

    } catch (e) {
        error.value = e.response?.data?.message || 'Error al buscar el expediente.'
    } finally {
        loading.value = false
    }
}

const saveChanges = async () => {
    if (!expediente.value) return

    saving.value = true
    try {
        await axios.put(`/editar-seguimiento/${expediente.value.id}`, {
            seguimiento: formSeguimiento.value,
            fechas: formFechas.value
        })

        await Swal.fire('Guardado', 'La información de seguimiento ha sido actualizada.', 'success')
        
    } catch (e) {
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error')
    } finally {
        saving.value = false
    }
}

const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/^f /, 'Fecha ')
}

// Convert DB datetime (YYYY-MM-DD HH:MM:SS) to input datetime-local (YYYY-MM-DDTHH:MM)
const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    return dateString.substring(0, 16).replace(' ', 'T')
}

</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
