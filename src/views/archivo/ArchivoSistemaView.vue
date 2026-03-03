<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-6">
             <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <Encabezado
                    title="Archivo Sistema"
                    subtitle="Listado histórico completo de expedientes finalizados en sistema."
                    labelIndicator="Archivo"
                    indicator-color="bg-orange-600"
                />
            </div>

             <!-- Filtros -->
             <!-- Placeholder for future filters if needed -->
        </div>

        <!-- Table Card -->
        <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                     <thead class="bg-table-azul dark:bg-table-verde text-white">
                        <tr>
                            <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">
                                ID Exp
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Código / Cliente
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Agencia
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Asociado
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Monto / Tasa
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Desembolso / Producto
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Fecha Archivo
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
                                    <span class="font-medium text-xs">Cargando histórico...</span>
                                </div>
                            </td>
                        </tr>
                         <tr v-else-if="expedientes.length === 0">
                             <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <p class="text-base font-medium text-slate-500 dark:text-slate-400">No hay expedientes en el sistema de archivo.</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="exp in expedientes" :key="exp.id_seguimiento" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td class="px-4 py-4 text-center">
                                <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.nuevo_expediente?.id }}</span>
                            </td>

                             <td class="px-6 py-4">
                                <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.nuevo_expediente?.codigo_cliente }}</div>
                                <div class="text-[12px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.nuevo_expediente?.cui || '---' }}</div>
                            </td>
                            
                             <td class="px-6 py-4">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                     {{ exp.nuevo_expediente?.id_agencia || '-' }}
                                </div>
                            </td>

                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                {{ exp.nuevo_expediente?.nombre_asociado }}
                            </td>
                            
                             <td class="px-6 py-4">
                                <div class="font-mono font-bold text-azul-cope dark:text-blue-300">
                                    {{ formatCurrency(exp.nuevo_expediente?.monto_documento || 0) }}
                                </div>
                                <div class="text-[11px] text-verde-cope dark:text-green-500 font-medium mt-0.5 uppercase">
                                    Tasa: {{ exp.nuevo_expediente?.tasa_interes || '0' }}%
                                </div>
                            </td>

                             <td class="px-6 py-4">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.nuevo_expediente?.fecha_inicio ? formatDate(exp.nuevo_expediente.fecha_inicio) : 'N/A' }}
                                </div>
                                <div class="text-[11px] text-verde-cope font-bold mt-0.5 uppercase italic">
                                    Prod: #{{ exp.nuevo_expediente?.numero_documento || exp.nuevo_expediente?.id }}
                                </div>
                            </td>

                             <td class="px-6 py-4 text-center">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.archivado_at ? formatDate(exp.archivado_at) : '-' }}
                                </div>
                                 <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1">
                                    Finalizado
                                </span>
                            </td>

                            <td class="px-2 py-4 text-center">
                                <button 
                                    @click="verDetalles(exp)" 
                                    class="p-2 text-azul-cope hover:bg-azul-cope hover:text-white rounded-lg transition-all border border-azul-cope/20 group/btn shadow-sm"
                                    title="Ver Detalles"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Mostrando <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.from }}</span> a <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.to }}</span> de <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span> registros
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

      <!-- Modal Detalles (Placeholder Logic) -->
      <!-- Podrías reutilizar TrackingModal o DetallesModal aquí si fuera necesario -->
      <ArchivoDetalleModal 
        :show="showModal" 
        :id-seguimiento="selectedId" 
        @close="showModal = false" 
      />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
// Keeping the original import. Depending on where this file is, adjust path if needed.
// Based on previous file content, it was imported from './components/ArchivoDetalleModal.vue'
import ArchivoDetalleModal from './components/ArchivoDetalleModal.vue' 
import Encabezado from '../../components/common/encabezado.vue'

interface Expediente {
    id_seguimiento: number;
    nuevo_expediente: {
        id: number;
        codigo_cliente: string;
        nombre_asociado: string;
        monto_documento: number;
        id_agencia?: string;
        cui: string;
        tasa_interes: number;
        fecha_inicio: string;
        numero_documento: string;
    } | null;
    archivado_at: string | null;
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
const showModal = ref(false)
const selectedId = ref<number | null>(null)

const fetchExpedientes = async (page: number = 1) => {
    loading.value = true
    try {
        const response = await api.get('/archivo/sistema', {
            params: { page }
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
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
    } finally {
        loading.value = false
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

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    // Si tiene 'T' o espacio (timestamp completo), parsear directo
    if (dateString.includes('T') || dateString.includes(' ')) {
         return new Date(dateString).toLocaleDateString('es-ES')
    }
    // Si es solo fecha YYYY-MM-DD
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES')
}

const verDetalles = (exp: any) => {
    selectedId.value = exp.id_seguimiento
    showModal.value = true
}

onMounted(() => {
    fetchExpedientes()
})
</script>
