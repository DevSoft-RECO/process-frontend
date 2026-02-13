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
            <div v-if="nextPageUrl" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                 <button @click="loadMore" :disabled="loading" class="text-sm text-azul-cope font-bold hover:text-blue-800 transition-colors">
                    {{ loading ? 'Cargando...' : 'Cargar más registros' }}
                </button>
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
const nextPageUrl = ref<string | null>(null)
const showModal = ref(false)
const selectedId = ref<number | null>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/archivo/sistema'
        const res = await api.get(endpoint)

        if (res.data.success) {
            if (!url) {
                expedientes.value = res.data.data.data
            } else {
                expedientes.value = [...expedientes.value, ...res.data.data.data]
            }
            nextPageUrl.value = res.data.data.next_page_url
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

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
