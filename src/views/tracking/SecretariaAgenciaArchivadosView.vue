<template>
  <div class="space-y-6">
    <!-- Header with Tabs -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Encabezado
            title="Buzón Archivados Administrativamente"
            subtitle="Expedientes que han sido archivados administrativamente (sin garantía real)."
            labelIndicator="Secretaria Agencia"
            indicator-color="bg-purple-600"
            />
        </div>
      </div>
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
                            Fecha Aceptado
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                            Estado Actual
                        </th>

                        <th scope="col" class="w-20 px-2 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                    <tr v-if="loading && expedientes.length === 0">
                        <td colspan="9" class="px-6 py-12 text-center text-slate-400">
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 border-4 border-verde-cope border-t-transparent rounded-full animate-spin"></div>
                                <span class="font-medium text-xs">Cargando datos...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0">
                        <td colspan="9" class="px-6 py-12 text-center text-slate-400">
                           No hay expedientes archivados administrativamente.
                        </td>
                    </tr>

                    <tr v-for="exp in expedientes" :key="exp.id" 
                        class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        
                        <td class="px-4 py-4 text-center">
                            <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.id }}</span>
                        </td>
                        
                        <td class="px-6 py-4">
                            <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
                            <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.cui || '---' }}</div>
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
                            <div class="text-[10px] text-naranja-cope font-bold mt-0.5 uppercase italic">
                                Prod: #{{ exp.numero_documento || exp.id }}
                            </div>
                        </td>

                        <td class="px-6 py-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                            {{ exp.fechas?.f_aceptado_secretaria ? formatDate(exp.fechas.f_aceptado_secretaria) : '-' }}
                        </td>

                        <td class="px-6 py-4 text-center">
                             <div class="flex flex-col items-center">
                                <span v-if="exp.seguimientos?.[0]?.estado" 
                                      class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 shadow-sm">
                                    {{ exp.seguimientos[0].estado?.nombre }}
                                </span>
                                <span v-else class="text-xs text-slate-400 italic">Desconocido</span>

                                <span v-if="exp.seguimientos?.[0]?.estadoSecundario || exp.seguimientos?.[0]?.estado_secundario" class="text-[10px] text-slate-500 mt-1">
                                    + {{ (exp.seguimientos[0].estadoSecundario || exp.seguimientos[0].estado_secundario)?.nombre }}
                                </span>
                             </div>
                        </td>



                        <td class="px-2 py-4 text-center">
                            <button @click="openDetalles(exp)" 
                                class="p-2 text-azul-cope hover:bg-azul-cope hover:text-white rounded-lg transition-all border border-azul-cope/20 group/btn shadow-sm"
                                title="Revisar Expediente">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="nextPageUrl" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
            <button @click="loadMore" :disabled="loading" 
                class="text-xs text-azul-cope font-bold hover:text-blue-700 transition-colors uppercase tracking-widest">
                {{ loading ? 'Sincronizando...' : 'Cargar más' }}
            </button>
        </div>
    </div>

    <!-- Modal Detalles (Secretaria) -->
    <SecretariaDetallesModal 
        :show="showModal" 
        :expediente="selectedExpediente" 
        :is-archived-view="true"
        @close="showModal = false"
        @refresh="handleRefresh" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

import SecretariaDetallesModal from './components/SecretariaDetallesModal.vue'
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
        f_enviado_secretaria: string | null;
        f_retorno_asesores: string | null;
        f_aceptado_secretaria: string | null;
    } | null;
    seguimientos?: Array<{
        estado?: {
            nombre: string;
        };

        estadoSecundario?: {
            nombre: string;
        };
        estado_secundario?: {
            nombre: string;
        };
    }>;
}



const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)
// const activeTab = ref<'buzon' | 'regresados' | 'aceptados'>('buzon')

// Modal State
const showModal = ref(false)
const selectedExpediente = ref<any>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/secretaria-agencia/buzon-archivados'
        
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
    } finally {
        loading.value = false
    }
}

// watch(activeTab, () => {
    // fetchExpedientes()
// })

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}



const openDetalles = (expor: any) => {
    selectedExpediente.value = expor
    showModal.value = true
}

const handleRefresh = () => {
    fetchExpedientes()
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
}

onMounted(() => {
    fetchExpedientes()
})
</script>
