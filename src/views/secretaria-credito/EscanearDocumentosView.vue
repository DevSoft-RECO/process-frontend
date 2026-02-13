<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <Encabezado
                    title="Escanear Documentos"
                    subtitle="Expedientes devueltos por abogados que requieren escaneo."
                    labelIndicator="Secretaria Créditos"
                    indicator-color="bg-cyan-600"
                />
                
                <div class="flex items-center gap-3">
                     <button @click="fetchExpedientes" class="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition shadow-sm" title="Refrescar listado">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Filtros y Búsqueda -->
             <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
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
        </div>

        <!-- Tabla -->
         <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                    <thead class="bg-table-azul dark:bg-table-verde text-white">
                        <tr>
                            <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">
                                ID Exp
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Código / CUI
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Nombre Asociado
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Monto / Tasa
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Desembolso / Producto
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Fecha Devolución
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Abogado / Bufete
                            </th>
                            <th scope="col" class="w-20 px-2 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                        <tr v-if="loading && expedientes.length === 0">
                            <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 border-4 border-verde-cope border-t-transparent rounded-full animate-spin"></div>
                                    <span class="font-medium text-xs">Cargando expedientes...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="expedientes.length === 0">
                             <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p class="text-base font-medium text-slate-500 dark:text-slate-400">No hay expedientes para escanear</p>
                                    <p class="text-sm mt-1">No se encontraron expedientes devueltos pendientes de escaneo.</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                             <td class="px-4 py-4 text-center">
                                <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.id }}</span>
                            </td>

                             <td class="px-6 py-4">
                                <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
                                <div class="text-[12px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.cui || '---' }}</div>
                            </td>

                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                {{ exp.nombre_asociado }}
                            </td>
                            
                             <td class="px-6 py-4">
                                <div class="font-mono font-bold text-azul-cope dark:text-blue-300">
                                    {{ formatCurrency(exp.monto_documento) }}
                                </div>
                                <div class="text-[11px] text-verde-cope dark:text-green-500 font-medium mt-0.5 uppercase">
                                    Tasa: {{ exp.tasa_interes || '0' }}%
                                </div>
                            </td>

                             <td class="px-6 py-4">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.fecha_inicio ? formatDate(exp.fecha_inicio) : 'N/A' }}
                                </div>
                                <div class="text-[11px] text-verde-cope font-bold mt-0.5 uppercase italic">
                                    Prod: #{{ exp.numero_documento || exp.id }}
                                </div>
                            </td>

                             <td class="px-6 py-4 text-center">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.fechas?.f_enviado_secretaria_credito ? new Date(exp.fechas.f_enviado_secretaria_credito).toLocaleDateString() : 'N/A' }}
                                </div>
                            </td>
                            
                            <td class="px-6 py-4">
                                <div class="text-slate-700 dark:text-slate-300 font-medium text-xs">
                                   {{ exp.seguimientos?.[0]?.bufete?.user?.name || 'Desconocido' }}
                                </div>
                                <div class="text-[11px] text-slate-400 mt-0.5">
                                    {{ exp.seguimientos?.[0]?.bufete?.agencia?.nombre || 'Sin Agencia' }}
                                </div>
                            </td>

                            <td class="px-2 py-4 text-center">
                                <button 
                                    @click="openDetails(exp)"
                                    class="p-2 text-azul-cope hover:bg-azul-cope hover:text-white rounded-lg transition-all border border-azul-cope/20 group/btn shadow-sm"
                                    title="Revisar Expediente">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

             <!-- Paginación -->
             <div v-if="pagination.total > 0" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
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
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            Mostrando <span class="font-bold text-slate-700 dark:text-slate-300">{{ pagination.from }}</span> a <span class="font-bold text-slate-700 dark:text-slate-300">{{ pagination.to }}</span> de <span class="font-bold text-slate-700 dark:text-slate-300">{{ pagination.total }}</span> resultados
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
import SecretariaCreditoDetallesModal from '../tracking/components/SecretariaCreditoDetallesModal.vue'
import Encabezado from '../../components/common/encabezado.vue'

interface Expediente {
    id: number;
    codigo_cliente: string;
    nombre_asociado: string;
    monto_documento: number;
    cui: string;
    tasa_interes: number;
    fecha_inicio: string;
    numero_documento: string;
    fechas: {
        f_enviado_secretaria_credito: string | null;
    } | null;
    seguimientos?: Array<{
        bufete?: {
            user?: {
                name: string;
            };
            agencia?: {
                nombre: string;
            };
        };
    }>;
}

const expedientes = ref<Expediente[]>([])
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
        const res = await api.get('/secretaria-credito/escanear-documentos', { params })
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

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    if (dateString.includes('T')) {
         return new Date(dateString).toLocaleDateString('es-ES')
    }
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES')
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
