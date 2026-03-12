<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Archivo Histórico"
          subtitle="Expedientes archivados históricamente."
          labelIndicator="Archivo"
          indicator-color="bg-orange-600"
          />
      </div>
      <div class="flex flex-col md:flex-row gap-2">
         <!-- Search Input -->
         <div class="relative">
            <input 
                v-model="searchQuery" 
                @keyup.enter="handleSearch"
                type="text" 
                placeholder="Buscar por Doc, Cuenta, Código o Nombre..." 
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

          <!-- Filtro Agencia -->
          <div class="w-full md:w-48">
            <select 
                v-model="selectedAgencia" 
                @change="fetchExpedientes(1)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope outline-none transition-all"
            >
                <option value="">Todas las Agencias</option>
                <option v-for="agencia in agencias" :key="agencia" :value="agencia">
                    {{ agencia }}
                </option>
            </select>
          </div>

          <!-- Filtro Estado -->
          <div class="w-full md:w-48">
            <select 
                v-model="selectedEstado" 
                @change="fetchExpedientes(1)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope outline-none transition-all"
            >
                <option value="">Todos los Estados</option>
                <option v-for="estado in estados" :key="estado" :value="estado">
                    {{ estado }}
                </option>
            </select>
          </div>

          <!-- Filtro Orden -->
          <div class="w-full md:w-40">
            <select 
                v-model="sortOrder" 
                @change="fetchExpedientes(1)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope outline-none transition-all"
            >
                <option value="desc">Más Recientes</option>
                <option value="asc">Más Antiguos</option>
            </select>
          </div>

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
                        <th scope="col" class="px-4 py-3 min-w-[150px]">Localizacion</th>
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
                    <tr v-for="exp in expedientes" :key="exp.id" 
                        class="transition border-b border-gray-100 dark:border-gray-800/50"
                        :class="[
                            exp.estado === 'COMPLETO' ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20' : 
                            exp.estado === 'COMPLETO SADEC' ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20' : 
                            exp.estado === 'INCOMPLETO' ? 'bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20' : 
                            exp.estado === 'FALTANTE' ? 'bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20' : 
                            'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                        ]"
                    >
                        <!-- Código / Agencia -->
                        <td 
                            class="px-4 py-3 sticky left-0 z-10 transition-colors duration-200"
                            :class="[
                                exp.estado === 'COMPLETO' ? 'bg-green-50 dark:bg-gray-800/95' : 
                                exp.estado === 'COMPLETO SADEC' ? 'bg-green-50 dark:bg-gray-800/95' : 
                                exp.estado === 'INCOMPLETO' ? 'bg-yellow-50 dark:bg-gray-800/95' : 
                                exp.estado === 'FALTANTE' ? 'bg-red-50 dark:bg-gray-800/95' : 
                                'bg-white dark:bg-gray-800'
                            ]"
                        >
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

                        <!-- Localización -->
                         <td class="px-4 py-3">
                             <span :class="[
                                'px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors',
                                exp.localizacion === 'EN ARCHIVO' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                                exp.localizacion === 'RETIRADO' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : 
                                exp.localizacion === 'FALTANTE' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
                                'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                             ]">
                                {{ exp.localizacion || 'N/A' }}
                             </span>
                        </td>

                        <!-- Ingreso / Estado -->
                         <td class="px-4 py-3">
                             <div class="text-gray-700 dark:text-gray-300 text-xs mb-1">{{ exp.ingreso }}</div>
                             <span :class="[
                                'px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors',
                                exp.estado === 'COMPLETO' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                                exp.estado === 'COMPLETO SADEC' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                                exp.estado === 'INCOMPLETO' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : 
                                exp.estado === 'FALTANTE' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
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
        <!-- Pagination -->
        <div v-if="pagination.last_page > 1 && !isSearching" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                Mostrando <span class="font-bold text-gray-700 dark:text-gray-200">{{ pagination.from }}</span> a <span class="font-bold text-gray-700 dark:text-gray-200">{{ pagination.to }}</span> de <span class="font-bold text-gray-700 dark:text-gray-200">{{ pagination.total }}</span> registros
            </div>
            
            <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button 
                    @click="goToPage(pagination.current_page - 1)"
                    :disabled="pagination.current_page === 1 || loading"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-800"
                >
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                </button>
                
                <template v-for="page in displayedPages" :key="page">
                    <button 
                        v-if="page !== '...'"
                        @click="goToPage(page as number)"
                        :class="[
                            pagination.current_page === page 
                                ? 'relative z-10 inline-flex items-center bg-azul-cope px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-cope' 
                                : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-800'
                        ]"
                    >
                        {{ page }}
                    </button>
                    <span 
                        v-else
                        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-400 dark:ring-gray-600"
                    >
                        ...
                    </span>
                </template>

                <button 
                    @click="goToPage(pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.last_page || loading"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-800"
                >
                    <span class="sr-only">Siguiente</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                </button>
            </nav>
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
import Encabezado from '../../components/common/encabezado.vue'

interface Expediente {
    id: number
    codigo_cliente: number
    agencia: string
    fecha_inicio: string
    numero_documento: string
    asociado: string
    monto: number
    tipo_garantia: string
    datos_garantia: string
    contrato: string
    localizacion: string
    ingreso: string
    estado: string
    inventario: string
    salida: string
    observacion: string
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
})
const searchQuery = ref('')
const isSearching = ref(false)
const message = ref('')

// Filters
const sortOrder = ref('desc')
const selectedAgencia = ref('')
const selectedEstado = ref('')
const agencias = ref<string[]>([])
const estados = ref<string[]>([])

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
        fetchExpedientes(1) // Reset to first page to see updates
    }
}

const fetchExpedientes = async (page: number = 1) => {
    loading.value = true
    message.value = ''
    
    try {
        const response = await api.get('/expedientes', {
            params: { 
                page,
                sort: sortOrder.value,
                agencia: selectedAgencia.value,
                estado: selectedEstado.value
            }
        })
        if (response.data.success) {
            const resData = response.data.data
            expedientes.value = resData.data
            pagination.value = {
                current_page: resData.current_page,
                last_page: resData.last_page,
                total: resData.total,
                from: resData.from,
                to: resData.to
            }
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

    try {
        const response = await api.post('/expedientes/search-by-codigo', {
            contrato: searchQuery.value
        })

        if (response.data.success) {
            expedientes.value = response.data.data // Now returns an array of matching records
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
    sortOrder.value = 'desc'
    selectedAgencia.value = ''
    selectedEstado.value = ''
    fetchExpedientes(1)
}

const fetchAgencias = async () => {
    try {
        const res = await api.get('/expedientes/agencias')
        if (res.data.success) {
            agencias.value = res.data.data
        }
    } catch (error) {
        console.error("Error fetching agencias:", error)
    }
}

const fetchEstados = async () => {
    try {
        const res = await api.get('/expedientes/estados')
        if (res.data.success) {
            estados.value = res.data.data
        }
    } catch (error) {
        console.error("Error fetching estados:", error)
    }
}

const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.last_page && !loading.value) {
        fetchExpedientes(page)
    }
}

// Compute displayed pages for pagination
import { computed } from 'vue'
const displayedPages = computed(() => {
    const current = pagination.value.current_page
    const last = pagination.value.last_page
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
            range.push(i)
        }
    }

    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
})

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
    // Si la fecha viene como YYYY-MM-DD (10 caracteres), forzar hora local
    if (dateStr.length === 10) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString()
    }
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('es-GT')
}

onMounted(() => {
    fetchExpedientes()
    fetchAgencias()
    fetchEstados()
})
</script>
