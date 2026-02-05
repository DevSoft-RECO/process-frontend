<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        Detalles del Expediente
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
                    </p>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[70vh]">
                <div v-if="loadingDetalles" class="flex justify-center p-8">
                     <svg class="animate-spin h-8 w-8 text-verde-cope" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <div v-else class="space-y-8">
                    
                    <!-- Garantías (Expanded) -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Garantías Asociadas
                        </h3>
                         <div v-if="detallesData.garantias && detallesData.garantias.length > 0" class="grid gap-4">
                             <div v-for="g in detallesData.garantias" :key="g.id" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="flex items-start justify-between">
                                    <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {{ g.nombre }}
                                        <span class="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">ID: {{ g.id }}</span>
                                    </h4>
                                </div>
                                
                                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" v-if="g.pivot">
                                    <!-- Codeudores -->
                                    <div class="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b dark:border-gray-600 pb-1">Codeudores</h5>
                                        <ul class="space-y-1">
                                            <li v-if="g.pivot.codeudor1"><span class="text-gray-500 dark:text-gray-400">1.</span> {{ g.pivot.codeudor1 }}</li>
                                            <li v-if="g.pivot.codeudor2"><span class="text-gray-500 dark:text-gray-400">2.</span> {{ g.pivot.codeudor2 }}</li>
                                            <li v-if="g.pivot.codeudor3"><span class="text-gray-500 dark:text-gray-400">3.</span> {{ g.pivot.codeudor3 }}</li>
                                            <li v-if="g.pivot.codeudor4"><span class="text-gray-500 dark:text-gray-400">4.</span> {{ g.pivot.codeudor4 }}</li>
                                            <li v-if="!g.pivot.codeudor1 && !g.pivot.codeudor2 && !g.pivot.codeudor3 && !g.pivot.codeudor4" class="italic text-gray-400">Sin codeudores registrados</li>
                                        </ul>
                                    </div>
                                    <!-- Observaciones -->
                                    <div class="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b dark:border-gray-600 pb-1">Observaciones</h5>
                                         <ul class="space-y-1">
                                            <li v-if="g.pivot.observacion1"><span class="text-gray-500 dark:text-gray-400">1.</span> {{ g.pivot.observacion1 }}</li>
                                            <li v-if="g.pivot.observacion2"><span class="text-gray-500 dark:text-gray-400">2.</span> {{ g.pivot.observacion2 }}</li>
                                            <li v-if="g.pivot.observacion3"><span class="text-gray-500 dark:text-gray-400">3.</span> {{ g.pivot.observacion3 }}</li>
                                            <li v-if="g.pivot.observacion4"><span class="text-gray-500 dark:text-gray-400">4.</span> {{ g.pivot.observacion4 }}</li>
                                            <li v-if="!g.pivot.observacion1 && !g.pivot.observacion2 && !g.pivot.observacion3 && !g.pivot.observacion4" class="italic text-gray-400">Sin observaciones registradas</li>
                                        </ul>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <p v-else class="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded">No hay garantías asociadas.</p>
                    </div>

                    <!-- Documentos (Expanded) -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Documentos Vinculados
                        </h3>
                         <div v-if="detallesData.documentos && detallesData.documentos.length > 0" class="space-y-4">
                             <div v-for="d in detallesData.documentos" :key="d.id" class="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold text-gray-700 dark:text-gray-200">{{ d.tipo_documento?.nombre || 'Documento' }}</span>
                                        <span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">No: {{ d.numero }}</span>
                                    </div>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ d.fecha }}</span>
                                </div>
                                <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                                    
                                    <div class="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                                         <div>
                                            <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Registro de Propiedad</span>
                                            <span class="font-medium text-gray-900 dark:text-white">{{ d.registro_propiedad?.nombre || 'N/A' }}</span>
                                        </div>
                                        <div>
                                            <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Monto Póliza</span>
                                            <span class="font-medium text-gray-900 dark:text-white font-mono">{{ d.monto_poliza ? formatCurrency(d.monto_poliza) : 'N/A' }}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Finca / Folio / Libro</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.no_finca || '-' }} / {{ d.folio || '-' }} / {{ d.libro || '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">No. Dominio</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.no_dominio || 'N/A' }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Referencia</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.referencia || 'N/A' }}</span>
                                    </div>
                                    <div class="md:col-span-2 lg:col-span-1">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Propietario / Titular</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.propietario || 'N/A' }}</span>
                                    </div>
                                     <div class="md:col-span-2 lg:col-span-1">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Autorizador / Notario</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.autorizador || 'N/A' }}</span>
                                    </div>
                                     <div class="col-span-1 md:col-span-2 lg:col-span-3 pt-2 border-t border-gray-100 dark:border-gray-700" v-if="d.observacion">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Observaciones</span>
                                        <p class="text-gray-700 dark:text-gray-300 italic">{{ d.observacion }}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                         <p v-else class="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded">No hay documentos vinculados.</p>
                    </div>

                </div>
            </div>
            <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                 <button @click="close" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                    Cerrar
                </button>
                 <button 
                    @click="sendExpediente"
                    class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Enviar Expediente
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close'])

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
        const res = await api.get(`/nuevos-expedientes/${props.expediente.codigo_cliente}/detalles`)
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

const sendExpediente = () => {
    console.log('Enviar expediente:', props.expediente)
    Swal.fire({
        icon: 'info',
        title: 'Próximamente',
        text: 'Esta funcionalidad de envío estará disponible pronto.',
    })
}

// Formatters
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const close = () => {
    emit('close')
}
</script>
