<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <Encabezado
                    title="Buzón de Recibidos (Archivo)"
                    subtitle="Expedientes enviados a archivo (Estado 4)."
                    labelIndicator="Archivo"
                    indicator-color="bg-orange-600"
                />
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
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Desembolso / Producto
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Fecha Envío
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Garantía
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Contrato
                            </th>
                            <th scope="col" class="w-20 px-2 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                        <tr v-if="loading && expedientes.length === 0">
                            <td colspan="10" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 border-4 border-verde-cope border-t-transparent rounded-full animate-spin"></div>
                                    <span class="font-medium text-xs">Cargando expedientes...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="expedientes.length === 0">
                             <td colspan="10" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p class="text-base font-medium text-slate-500 dark:text-slate-400">No hay expedientes en archivo.</p>
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

                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white" :title="exp.nombre_asociado">
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
                                    {{ exp.fechas?.f_enviado_archivos ? formatDate(exp.fechas.f_enviado_archivos) : '-' }}
                                </div>
                            </td>
                            
                            <!-- Garantía Real -->
                            <td class="px-6 py-4 text-center align-middle">
                                <div class="flex flex-col items-center gap-2">
                                    <!-- Status/Action -->
                                    <span v-if="exp.seguimientos?.[0]?.recibi_garantia_real" 
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 truncate max-w-[120px]"
                                        :title="exp.seguimientos[0].recibi_garantia_real">
                                        {{ exp.seguimientos[0].recibi_garantia_real }}
                                    </span>
                                    
                                    <button v-else-if="exp.seguimientos?.[0]?.enviado_a_archivos === 'Si'"
                                            @click="openRecibirGarantiaModal(exp)"
                                            class="px-3 py-1.5 text-[11px] font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1">
                                        <span>Recibir Garantía</span>
                                    </button>
                                    
                                    <span v-else class="text-slate-400 text-[10px] italic">No aplica</span>

                                     <!-- Observation Icon (Less intrusive) -->
                                    <button 
                                        v-if="exp.seguimientos?.[0]?.observacion_envio"
                                        @click="showObservation(exp.seguimientos[0].observacion_envio)"
                                        class="text-orange-500 hover:text-orange-600 transition-colors"
                                        title="Ver observación de envío"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>

                            <!-- Contrato -->
                             <td class="px-6 py-4 text-center align-middle">
                                <span v-if="exp.seguimientos?.[0]?.es_un_pagare === 'Pendiente' || exp.seguimientos?.[0]?.es_un_pagare === null" 
                                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                    En Proceso...
                                </span>

                                <button v-else-if="exp.seguimientos?.[0]?.es_un_pagare === 'no' && !exp.seguimientos?.[0]?.recibi_contrato"
                                        @click="recibirContratoAction(exp)"
                                        class="px-2 py-1 text-[10px] font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm">
                                    Recibir Contrato
                                </button>
                                
                                <span v-else class="text-slate-500 text-xs">
                                    {{ exp.seguimientos?.[0]?.recibi_contrato || 'No aplica' }}
                                </span>
                            </td>

                            <td class="px-2 py-4 text-center">
                                <div class="flex justify-center">
                                    <button 
                                        v-if="exp.seguimientos?.[0]?.archivado_at"
                                        disabled
                                        class="p-2 text-green-600 bg-green-50 rounded-lg border border-green-200 cursor-not-allowed opacity-75"
                                        title="Completado"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                     <button 
                                        v-else
                                        @click="archivarAction(exp)" 
                                        :disabled="!canArchive(exp)"
                                        :class="[
                                            'p-2 rounded-lg transition-all border group/btn shadow-sm',
                                            canArchive(exp) 
                                                ? 'text-azul-cope hover:bg-azul-cope hover:text-white border-azul-cope/20' 
                                                : 'text-slate-300 border-slate-200 cursor-not-allowed bg-slate-50'
                                        ]"
                                        :title="!canArchive(exp) ? 'Debe completar Garantía/Contrato' : 'Archivar Expediente'"
                                     >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
             <!-- Paginación -->
            <div v-if="nextPageUrl" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                <button @click="loadMore" :disabled="loading" class="text-sm text-azul-cope font-bold hover:text-blue-800 transition-colors">
                    {{ loading ? 'Cargando...' : 'Cargar más expedientes' }}
                </button>
            </div>
        </div>

        <ArchivoDetalleModal 
            :show="showDetalleModal"
            :id-seguimiento="selectedSeguimientoId"
            :show-receive-action="true"
            @close="showDetalleModal = false"
            @confirm-receive="handleConfirmReceiveFromModal"
        />
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '../../components/common/encabezado.vue'
import ArchivoDetalleModal from './components/ArchivoDetalleModal.vue'

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
        f_enviado_archivos: string | null;
    } | null;
    seguimientos?: Array<{
        id_seguimiento: number;
        observacion_envio?: string;
        recibi_garantia_real?: string;
        es_un_pagare?: string;
        recibi_contrato?: string;
        archivado_at?: string;
        enviado_a_archivos?: string;
        numero_contrato?: string;
    }>;
}
  
const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)
  
const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/archivo/buzon-recibidos'
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

const canArchive = (exp: Expediente) => {
    const s = exp.seguimientos?.[0];
    if (!s) return false;

    // 1. Si el flujo no ha decidido, BLOQUEO TOTAL
    if (s.es_un_pagare === 'Pendiente' || s.es_un_pagare === null) {
        return false;
    }

    // 2. Definimos si falta algo por recibir
    const faltaGarantia = (s.enviado_a_archivos === 'Si' && !s.recibi_garantia_real);
    const faltaContrato = (s.es_un_pagare === 'no' && !s.recibi_contrato);

    // Solo habilitar si NO falta nada
    return !faltaGarantia && !faltaContrato;
}
  
const archivarAction = async (exp: Expediente) => {
    const result = await Swal.fire({
        title: '¿Archivar Expediente?',
        text: `¿Estás seguro de archivar el expediente ${exp.codigo_cliente}? Se creará un registro histórico.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, archivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#003366'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.post(`/archivo/archivar/${exp.id}`)
            if (res.data.success) {
                Swal.fire('Éxito', res.data.message, 'success')
                fetchExpedientes() // Refresh to update button state
            }
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || 'No se pudo archivar el expediente.'
            Swal.fire('Error', msg, 'error')
        }
    }
}
  
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    if (dateString.includes('T') || dateString.includes(' ')) {
         return new Date(dateString).toLocaleDateString('es-ES')
    }
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES')
}
  
const showObservation = (text: string) => {
    Swal.fire({
        title: 'Observación Garantía',
        text: text,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    })
}

// Removed unused recibirGarantia


const recibirContratoAction = async (exp: Expediente) => {
    const contrato = exp.seguimientos?.[0]?.numero_contrato || 'Sin Número';
    const result = await Swal.fire({
        title: '¿Confirmar recepción?',
        html: `
            <p>Estas por recibir el contrato: <b class="text-blue-600 text-lg">${contrato}</b></p>
            <p class="text-sm text-gray-600 mt-2">Del expediente id: <b>${exp.id}</b></p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, recibir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2563EB'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.post(`/archivo/recibir-contrato/${exp.id}`)
            if (res.data.success) {
                Swal.fire('Éxito', res.data.message, 'success')
                fetchExpedientes() // Refresh
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
        }
    }
}


// Modal Logic
const showDetalleModal = ref(false)
const selectedSeguimientoId = ref<number | null>(null)
const selectedExpedienteForReceive = ref<Expediente | null>(null)

const openRecibirGarantiaModal = (exp: Expediente) => {
    if (!exp.seguimientos?.[0]) return
    selectedExpedienteForReceive.value = exp
    selectedSeguimientoId.value = exp.seguimientos[0].id_seguimiento
    showDetalleModal.value = true
}

const handleConfirmReceiveFromModal = async () => {
    if (!selectedExpedienteForReceive.value) return
    
    // Close modal first or keep open? User might want to see success.
    // Let's call the API.
    try {
        const exp = selectedExpedienteForReceive.value
        // Logic from receivingGarantia
        const res = await api.post(`/archivo/recibir-garantia/${exp.id}`)
        
        if (res.data.success) {
            Swal.fire('Éxito', res.data.message, 'success')
            showDetalleModal.value = false
            fetchExpedientes() // Refresh
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
    }
}

onMounted(() => {
    fetchExpedientes()
})
</script>
