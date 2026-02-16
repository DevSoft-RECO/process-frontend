<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Traslado de Expedientes</h2>

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

    <!-- Resultados del Expediente -->
    <div v-if="expediente" class="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
        <!-- Detalles del Expediente -->
        <div class="lg:col-span-2 space-y-6">
             <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">Datos del Expediente</h3>
                     <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                        ID: {{ expediente.id }}
                    </span>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Documento</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">{{ expediente.numero_documento }}</p>
                    </div>
                     <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Código Cliente</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">{{ expediente.codigo_cliente }}</p>
                    </div>
                     <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre Asociado</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">{{ expediente.nombre_asociado }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Agencia</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">{{ expediente.agencia?.nombre || 'N/A' }}</p>
                    </div>
                     <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monto</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">Q {{ expediente.monto_documento }}</p>
                    </div>
                     <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">CUI</p>
                        <p class="text-base font-semibold text-gray-800 dark:text-white">{{ expediente.cui }}</p>
                    </div>
                </div>
             </div>
        </div>

        <!-- Panel de Traslado -->
        <div class="lg:col-span-1">
             <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-6">
                <div class="bg-verde-cope/10 px-6 py-4 border-b border-verde-cope/20">
                    <h3 class="text-lg font-bold text-verde-cope">Gestión de Traslado</h3>
                </div>
                <div class="p-6 space-y-6">
                    
                    <!-- Asesor Actual -->
                    <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Asesor Actual</p>
                        <div class="flex items-center gap-3">
                             <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 font-bold">
                                {{ getInitials(expediente.usuario_asesor) }}
                            </div>
                            <p class="font-bold text-gray-800 dark:text-white text-lg">
                                {{ expediente.usuario_asesor || 'Sin Asignar' }}
                            </p>
                        </div>
                    </div>

                    <!-- Selección de Nuevo Asesor -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                             Nuevo Asesor Destino (Usuario)
                        </label>
                        
                        <div class="relative">
                            <input
                                v-model="userSearch"
                                type="text"
                                placeholder="Ingrese el usuario del asesor..."
                                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-verde-cope focus:border-verde-cope
                                       dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            />
                             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                         </div>
                         <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                             Ingrese el nombre de usuario exacto del asesor al que desea trasladar el expediente.
                         </p>
                    </div>

                    <button
                        @click="confirmTransfer"
                        :disabled="!userSearch || updating"
                        class="w-full py-3 px-4 bg-verde-cope hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        <svg v-if="updating" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span v-else>Confirmar Traslado</span>
                    </button>

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
const error = ref(null)
const updating = ref(false)

// Búsqueda de Usuarios
const userSearch = ref('') // Username manual
const showDropdown = ref(false) // Dejado por compatibilidad si se usa luego, o remover. En este diseño simplificado no se usa.

const handleSearch = async () => {
    if (!searchQuery.value) return
    
    loading.value = true
    error.value = null
    expediente.value = null
    userSearch.value = ''

    try {
        const response = await axios.get('/traslado-expedientes/search', {
            params: { query: searchQuery.value }
        })
        expediente.value = response.data.data
        if(!response.data.data) {
             error.value = 'No se encontraron expedientes con ese criterio.'
        }
    } catch (e) {
        error.value = e.response?.data?.message || 'Error al buscar el expediente.'
    } finally {
        loading.value = false
    }
}

// Búsqueda de usuarios (Debounce manual simple)


const confirmTransfer = async () => {
    if (!expediente.value || !userSearch.value) return

    const result = await Swal.fire({
        title: '¿Confirmar Traslado?',
        html: `Vas a trasladar el expediente <b>${expediente.value.numero_documento}</b><br>
               Del asesor: <b>${expediente.value.usuario_asesor || 'N/A'}</b><br>
               Al asesor: <b>${userSearch.value}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10B981', // Verde Cope
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, trasladar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        updating.value = true
        try {
            await axios.put(`/traslado-expedientes/${expediente.value.id}/asesor`, {
                usuario_asesor: userSearch.value 
            })

            await Swal.fire('¡Éxito!', 'El expediente ha sido trasladado correctamente.', 'success')
            
            // Recargar datos
            handleSearch()
            userSearch.value = '' // Limpiar campo

        } catch (e) {
            Swal.fire('Error', e.response?.data?.message || 'Hubo un problema al trasladar.', 'error')
        } finally {
            updating.value = false
        }
    }
}

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
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
