<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Archivo Histórico
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Expedientes archivados históricamente.
        </p>
      </div>
      <div class="flex flex-col md:flex-row gap-2">
         <!-- Search Input -->
         <div class="relative">
            <input 
                v-model="searchQuery" 
                @keyup.enter="handleSearch"
                type="text" 
                placeholder="Buscar por Contrato..." 
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope focus:border-transparent outline-none w-full md:w-64 transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
         </div>

         <button @click="handleSearch" class="px-4 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-900 transition flex items-center justify-center gap-2 text-sm shadow-md">
            Buscar
         </button>

         <button @click="resetFetch" class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refrescar
         </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-4 py-3 min-w-[120px]">Código / Agencia</th>
                        <th scope="col" class="px-4 py-3 min-w-[150px]">Fecha / Documento</th>
                        <th scope="col" class="px-4 py-3 min-w-[200px]">Asociado / Monto</th>
                        <th scope="col" class="px-4 py-3 min-w-[150px]">Garantía / Contrato</th>
                        <th scope="col" class="px-4 py-3 text-center min-w-[100px]">Garantía</th>
                        <th scope="col" class="px-4 py-3 min-w-[150px]">Inscripción Otros</th>
                        <th scope="col" class="px-4 py-3 min-w-[150px]">Ingreso / Estado</th>
                        <th scope="col" class="px-4 py-3 text-center min-w-[80px]">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                            <div class="flex justify-center items-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-verde-cope" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando expedientes...
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                            {{ message || 'No hay expedientes en el archivo histórico.' }}
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <!-- Código / Agencia -->
                        <td class="px-4 py-3 sticky left-0 bg-white dark:bg-gray-800">
                            <div class="font-bold text-gray-900 dark:text-white">{{ exp.codigo_cliente }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ exp.agencia }}</div>
                        </td>

                        <!-- Fecha Inicio / No. Documento -->
                        <td class="px-4 py-3">
                            <div class="text-gray-900 dark:text-gray-200 text-sm mb-1">{{ formatDate(exp.fecha_inicio) }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ exp.numero_documento }}</div>
                        </td>

                        <!-- Asociado / Monto -->
                        <td class="px-4 py-3">
                            <div class="font-medium text-gray-900 dark:text-white mb-1">{{ exp.asociado }}</div>
                            <div class="text-xs font-mono text-gray-600 dark:text-gray-300">{{ formatCurrency(exp.monto) }}</div>
                        </td>

                        <!-- Tipo Garantía / Contrato -->
                        <td class="px-4 py-3">
                             <div class="text-sm text-gray-700 dark:text-gray-300 mb-1">{{ exp.tipo_garantia }}</div>
                             <div class="text-xs text-indigo-600 dark:text-indigo-400">{{ exp.contrato }}</div>
                        </td>

                        <!-- Datos Garantía -->
                        <td class="px-4 py-3 text-center">
                            <button 
                               v-if="exp.datos_garantia"
                               @click="showGarantia(exp.datos_garantia)"
                               class="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 transition"
                            >
                                Ver
                            </button>
                             <span v-else class="text-xs text-gray-400 italic">N/A</span>
                        </td>

                        <!-- Inscripción Otros -->
                        <td class="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs">
                             <span class="line-clamp-2" :title="exp.inscripcion_otros_contratos">
                                {{ exp.inscripcion_otros_contratos }}
                             </span>
                        </td>

                        <!-- Ingreso / Estado -->
                         <td class="px-4 py-3">
                             <div class="text-gray-700 dark:text-gray-300 text-xs mb-1">{{ exp.ingreso }}</div>
                             <span :class="[
                                'px-2 py-0.5 rounded-full text-[10px] font-medium border',
                                'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                             ]">
                                {{ exp.estado || 'N/A' }}
                             </span>
                        </td>

                        <!-- Acciones -->
                        <td class="px-4 py-3 text-center">
                             <button 
                                @click="openModal(exp)"
                                title="Ver / Editar"
                                class="text-gray-500 hover:text-azul-cope dark:text-gray-400 dark:hover:text-white transition"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                             </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination / Load More -->
        <div v-if="nextPageUrl && !isSearching" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-center">
            <button 
                @click="loadMore" 
                :disabled="loading"
                class="text-sm font-medium text-verde-cope hover:text-green-700 disabled:opacity-50 flex items-center gap-2"
            >
                <span v-if="loading" class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                {{ loading ? 'Cargando...' : 'Cargar más expedientes' }}
            </button>
        </div>
    </div>

    <!-- Modal -->
    <ArchivoHistoricoModal 
        :isOpen="showModal"
        :expediente="selectedExpediente"
        @close="showModal = false"
        @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import ArchivoHistoricoModal from './components/ArchivoHistoricoModal.vue'

interface Expediente {
    codigo_cliente: number
    agencia: string
    fecha_inicio: string
    numero_documento: string
    asociado: string
    monto: number
    tipo_garantia: string
    datos_garantia: string
    contrato: string
    inscripcion_otros_contratos: string
    ingreso: string
    estado: string
    inventario: string
    salida: string
    observacion: string
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)
const searchQuery = ref('')
const isSearching = ref(false)
const message = ref('')

// Modal state
const showModal = ref(false)
const selectedExpediente = ref<Expediente | null>(null)

const openModal = (exp: Expediente) => {
    selectedExpediente.value = exp
    showModal.value = true
}

const handleSave = () => {
    // Refresh list after edit
    if (isSearching.value) {
        handleSearch()
    } else {
        fetchExpedientes(null) // Reset to first page to see updates
    }
}

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    message.value = ''
    // Use relative URL for default, or pass full URL (api instance handles it)
    const endpoint = url || '/expedientes'
    
    try {
        const response = await api.get(endpoint)
        if (response.data.success) {
            const pagination = response.data.data
            // If it's the first page (no url provided), replace data. If loading more, append.
            if (!url) {
                expedientes.value = pagination.data
            } else {
                expedientes.value = [...expedientes.value, ...pagination.data]
            }
            
            nextPageUrl.value = pagination.next_page_url
        }
    } catch (error) {
        console.error("Error fetching expedientes:", error)
    } finally {
        loading.value = false
    }
}

const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        resetFetch()
        return
    }

    loading.value = true
    isSearching.value = true
    expedientes.value = [] // Clear current list
    message.value = ''
    nextPageUrl.value = null // Disable pagination logic during search

    try {
        const response = await api.post('/expedientes/search-by-codigo', {
            contrato: searchQuery.value
        })

        if (response.data.success) {
            expedientes.value = [response.data.data] // Exact match returns single object, wrap in array
        }
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            message.value = 'No se encontró ningún expediente con ese contrato.'
            Swal.fire('No encontrado', 'No existe un expediente con ese contrato.', 'info')
        } else {
            console.error("Search error", error)
            Swal.fire('Error', 'Ocurrió un error al buscar.', 'error')
        }
    } finally {
        loading.value = false
    }
}

const resetFetch = () => {
    searchQuery.value = ''
    isSearching.value = false
    fetchExpedientes(null)
}

const loadMore = () => {
    if (nextPageUrl.value) {
        fetchExpedientes(nextPageUrl.value)
    }
}

const showGarantia = (text: string) => {
    Swal.fire({
        title: 'Datos de Garantía',
        text: text,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#003366', // Azul cope
        width: '600px',
        customClass: {
            htmlContainer: 'text-left text-sm max-h-[60vh] overflow-y-auto'
        }
    })
}

const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ' 
    }).format(amount)
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-GT')
}

onMounted(() => {
    fetchExpedientes()
})
</script>
