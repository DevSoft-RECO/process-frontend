<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop with Blur -->
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="close"></div>

        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 font-sans">
            
            <!-- Header Premium -->
            <div class="bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start shrink-0 z-10">
                <div>
                     <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mb-3 tracking-wide">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        En manos de Abogado
                    </span>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Detalles del Expediente
                    </h2>
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                            <span class="font-medium text-gray-900 dark:text-gray-200">{{ expediente?.codigo_cliente }}</span>
                        </span>
                        <span class="hidden sm:inline text-gray-300">|</span>
                        <span class="flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span class="font-medium text-gray-900 dark:text-gray-200">{{ expediente?.nombre_asociado }}</span>
                        </span>
                         <span class="hidden sm:inline text-gray-300" v-if="numeroContrato">|</span>
                        <span class="flex items-center gap-1.5" v-if="numeroContrato">
                             <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             <span class="font-mono font-bold text-gray-700 dark:text-gray-300">{{ numeroContrato }}</span>
                        </span>
                    </div>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body Scrollable -->
            <div class="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-8">
                
                <div v-if="loadingDetalles" class="flex flex-col justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <span class="text-gray-500 text-sm">Cargando información completa...</span>
                </div>

                <div v-else class="space-y-10 max-w-5xl mx-auto">
                    


                    <!-- Sección Garantías -->
                    <div>
                        <div class="flex items-center gap-3 mb-6">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Garantías Asociadas</h3>
                            <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                         <div v-if="detallesData.garantias && detallesData.garantias.length > 0" class="grid grid-cols-1 gap-4">
                            <div v-for="g in detallesData.garantias" :key="g.id" class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-sm">
                                <div class="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div class="flex items-center gap-3">
                                        <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </span>
                                        <span class="font-semibold text-gray-900 dark:text-white">{{ g.nombre }}</span>
                                    </div>
                                    <span class="text-xs font-mono text-gray-400 uppercase">ID: {{ g.id }}</span>
                                </div>
                                
                                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <!-- Codeudores -->
                                    <div v-if="g.pivot">
                                        <h4 class="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            Codeudores
                                        </h4>
                                        <ul class="space-y-2 text-sm">
                                            <li v-for="i in 4" :key="`c-${i}`" v-show="g.pivot[`codeudor${i}`]" class="flex items-start gap-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                                                <span class="text-gray-400 text-xs mt-0.5">{{ i }}.</span>
                                                <span class="font-medium">{{ g.pivot[`codeudor${i}`] }}</span>
                                            </li>
                                            <li v-if="!g.pivot.codeudor1 && !g.pivot.codeudor2 && !g.pivot.codeudor3 && !g.pivot.codeudor4" class="text-gray-400 italic text-sm pl-2">
                                                Sin codeudores registrados
                                            </li>
                                        </ul>
                                    </div>

                                    <!-- Observaciones -->
                                    <div v-if="g.pivot">
                                        <h4 class="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                            Observaciones
                                        </h4>
                                         <ul class="space-y-2 text-sm">
                                            <li v-for="i in 4" :key="`o-${i}`" v-show="g.pivot[`observacion${i}`]" class="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                                <span class="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></span>
                                                <span>{{ g.pivot[`observacion${i}`] }}</span>
                                            </li>
                                             <li v-if="!g.pivot.observacion1 && !g.pivot.observacion2 && !g.pivot.observacion3 && !g.pivot.observacion4" class="text-gray-400 italic text-sm pl-2">
                                                Sin observaciones
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p class="text-gray-500">No hay garantías registradas para este expediente.</p>
                        </div>
                    </div>

                    <!-- Sección Documentos -->
                    <div class="pb-6">
                        <div class="flex items-center gap-3 mb-6">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Documentos Vinculados</h3>
                             <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                         <div v-if="detallesData.documentos && detallesData.documentos.length > 0" class="space-y-4">
                            <div v-for="d in detallesData.documentos" :key="d.id" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <!-- Header Documento -->
                                <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 dark:border-gray-600">
                                    <div class="flex items-center gap-3">
                                         <span class="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </span>
                                        <div>
                                            <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ d.tipo_documento?.nombre || 'Documento' }}</h4>
                                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{{ d.fecha }}</span>
                                                <span v-if="d.numero" class="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-mono">#{{ d.numero }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right" v-if="d.monto_poliza">
                                        <p class="text-xs text-gray-500 uppercase">Monto Póliza</p>
                                        <p class="font-bold text-gray-900 dark:text-white font-mono">{{ formatCurrency(d.monto_poliza) }}</p>
                                    </div>
                                </div>

                                <!-- Body Documento -->
                                <div class="p-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                        <!-- Info Propiedad -->
                                        <div class="col-span-1 md:col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                            <h5 class="text-xs font-bold text-gray-400 uppercase mb-3">Datos Registrales</h5>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span class="block text-gray-500 text-xs mb-0.5">Registro</span>
                                                    <span class="font-medium text-gray-900 dark:text-white">{{ d.registro_propiedad?.nombre || 'N/A' }}</span>
                                                </div>
                                                <div>
                                                    <span class="block text-gray-500 text-xs mb-0.5">Finca / Folio / Libro</span>
                                                    <span class="font-mono font-medium text-gray-900 dark:text-white">{{ d.no_finca || '-' }} - {{ d.folio || '-' }} - {{ d.libro || '-' }}</span>
                                                </div>
                                                <div>
                                                    <span class="block text-gray-500 text-xs mb-0.5">No. Dominio</span>
                                                    <span class="font-medium text-gray-900 dark:text-white">{{ d.no_dominio || 'N/A' }}</span>
                                                </div>
                                                <div>
                                                    <span class="block text-gray-500 text-xs mb-0.5">Referencia</span>
                                                    <span class="font-medium text-gray-900 dark:text-white truncate">{{ d.referencia || 'N/A' }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Info Personal -->
                                        <div class="col-span-1 md:col-span-2 space-y-4">
                                             <div>
                                                <span class="block text-gray-500 text-xs mb-1 font-bold uppercase">Propietario / Titular</span>
                                                <span class="text-gray-900 dark:text-white block bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">{{ d.propietario || 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-gray-500 text-xs mb-1 font-bold uppercase">Autorizador / Notario</span>
                                                <span class="text-gray-900 dark:text-white block bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">{{ d.autorizador || 'N/A' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="d.observacion" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                         <p class="text-xs font-bold text-gray-400 uppercase mb-1">Observaciones</p>
                                         <p class="text-gray-600 dark:text-gray-300 italic text-sm">{{ d.observacion }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p class="text-gray-500">No hay documentos vinculados a este expediente.</p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer Action -->
            <div class="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0 flex justify-end">
                <button @click="close" class="px-6 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-200 dark:shadow-none">
                    Cerrar Vista
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close', 'refresh'])

const loadingDetalles = ref(false)
const detallesData = ref<any>({})

watch(() => props.show, (newVal) => {
    if (newVal && props.expediente) {
        fetchDetalles()
    } else {
        detallesData.value = {}
    }
})

const fetchDetalles = async () => {
    loadingDetalles.value = true
    try {
        const res = await api.get(`/nuevos-expedientes/${props.expediente.id}/detalles`)
        if (res.data.success) {
            detallesData.value = res.data.data
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los detalles.', 'error')
    } finally {
        loadingDetalles.value = false
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const numeroContrato = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return null;
    const latest = detallesData.value.expediente.seguimientos[0];
    return latest.numero_contrato;
})

const close = () => {
    emit('close')
}
</script>
