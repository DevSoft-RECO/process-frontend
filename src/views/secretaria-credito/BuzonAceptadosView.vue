<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <div>
                 <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Buzón Secretaría Créditos
                </span>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Buzón Aceptados</h1>
                <p class="text-sm text-gray-500 mt-1">Expedientes aceptados por Secretaría Crédito.</p>
            </div>
            
            <div class="flex items-center gap-3">
                 <button @click="fetchExpedientes" class="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Filtros y Búsqueda -->
         <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="relative w-full md:max-w-md">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    v-model="search"
                    @input="debouncedSearch"
                    type="text" 
                    placeholder="Buscar por código, nombre o CUI..." 
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-verde-cope focus:border-verde-cope sm:text-sm transition-colors"
                >
            </div>
        </div>

        <!-- Tabla -->
         <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Id Expediente</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código / Cliente</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asociado</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Aceptado</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-if="loading" class="animate-pulse">
                            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Cargando expedientes...</td>
                        </tr>
                        <tr v-else-if="expedientes.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-base font-medium text-gray-900 dark:text-gray-200">No hay expedientes aceptados</p>
                                    <p class="text-sm mt-1">El buzón de aceptados está vacío.</p>
                                </div>
                            </td>
                        </tr>
                         <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="ml-4">
                                        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ exp.id }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="ml-4">
                                        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ exp.codigo_cliente }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ exp.nombre_asociado }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-gray-200 font-mono">{{ formatCurrency(exp.monto_documento) }}</div>
                            </td>
                             <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-gray-200">
                                    {{ exp.fechas?.f_aceptado_secretaria_credito ? new Date(exp.fechas.f_aceptado_secretaria_credito).toLocaleDateString() : 'N/A' }}
                                </div>
                                <div v-if="exp.fechas?.f_aceptado_secretaria_credito" class="text-xs text-gray-500">
                                    {{ new Date(exp.fechas.f_aceptado_secretaria_credito).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                    @click="openDetails(exp)"
                                    class="text-verde-cope hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Revisar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <!-- Paginación omitted for brevity, keeping same structure in replace but focusing on content -->
             <!-- ... (Pagination code is fine to stay as is from the clone, just updated table headers/content above) ... -->
             <!-- Re-including pagination start to match context correctly -->
              <div v-if="pagination.total > 0" class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
                <!-- Mobile pagination -->
                <div class="flex-1 flex justify-between sm:hidden">
                    <button 
                         @click="changePage(pagination.current_page - 1)" 
                         :disabled="pagination.current_page === 1"
                         class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <button 
                         @click="changePage(pagination.current_page + 1)"
                         :disabled="pagination.current_page === pagination.last_page"
                         class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
                 <!-- Desktop pagination -->
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span class="font-medium">{{ pagination.from }}</span> a <span class="font-medium">{{ pagination.to }}</span> de <span class="font-medium">{{ pagination.total }}</span> resultados
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                @click="changePage(pagination.current_page - 1)"
                                :disabled="pagination.current_page === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span class="sr-only">Anterior</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <!-- Simple page counter for brevity -->
                            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">
                                {{ pagination.current_page }}
                            </span>
                            <button
                                @click="changePage(pagination.current_page + 1)"
                                :disabled="pagination.current_page === pagination.last_page"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span class="sr-only">Siguiente</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <SecretariaCreditoDetallesModal 
            :show="showModal"
            :expediente="selectedExpediente"
            @close="closeModal"
            @refresh="fetchExpedientes"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import SecretariaCreditoDetallesModal from '../tracking/components/SecretariaCreditoDetallesModal.vue' // Adjust path if moved or aliased

const expedientes = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
})

const showModal = ref(false)
const selectedExpediente = ref<any>(null)

// Debounce helper
let timeout: any = null
const debouncedSearch = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        pagination.value.current_page = 1
        fetchExpedientes()
    }, 500)
}

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const params = {
            page: pagination.value.current_page,
            search: search.value
        }
        const res = await api.get('/secretaria-credito/aceptados', { params })
        if (res.data.success) {
            expedientes.value = res.data.data.data
            pagination.value = {
                current_page: res.data.data.current_page,
                last_page: res.data.data.last_page,
                total: res.data.data.total,
                from: res.data.data.from,
                to: res.data.data.to
            }
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
    } finally {
        loading.value = false
    }
}

const changePage = (page: number) => {
    if (page > 0 && page <= pagination.value.last_page) {
        pagination.value.current_page = page
        fetchExpedientes()
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const openDetails = (expediente: any) => {
    selectedExpediente.value = expediente
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedExpediente.value = null
}

onMounted(() => {
    fetchExpedientes()
})
</script>
