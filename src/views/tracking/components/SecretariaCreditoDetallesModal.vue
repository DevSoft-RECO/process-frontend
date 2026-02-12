<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
                <div>
                     <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mb-2">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Revisión de Secretaría Crédito
                    </span>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Detalles del Expediente
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
                    </p>
                    <p class="text-sm text-gray-500 mt-1">
                        Contrato: <span class="font-mono font-bold text-gray-800 dark:text-gray-300">{{ numeroContrato }}</span>
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
                     <!-- Garantías -->
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

                    <!-- Documentos -->
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

            <!-- Footer con Acciones de Secretaría -->
            <div class="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex flex-col md:flex-row justify-end gap-3 flex-wrap">
                 <!-- Botón Cerrar (Siempre visible) -->
                 <button @click="close" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                    Cerrar
                </button>

                <div class="w-full md:w-auto border-l border-gray-300 dark:border-gray-600 mx-2 hidden md:block"></div>

                 <!-- Acción: Aceptar / Validar (Visual) -->
                <button v-if="expediente?.seguimientos?.[0]?.id_estado === 5" @click="handleAction('aceptar')" class="px-5 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Aceptar
                </button>

                <!-- Acción: Enviar a Abogado (Visible solo en estado 7) -->
                <button v-if="expediente?.seguimientos?.[0]?.id_estado === 7" @click="handleAction('enviarAbogado')" class="px-5 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Enviar a Abogado
                </button>

                <!-- Acción: Ver Documento (Si existe path_contrato) -->
                <button v-if="hasContrato" @click="verDocumento" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Documento
                </button>

                <!-- Acción: Finalizar Proceso (Si hay contrato) -->
                <!-- Estado Finalizado -->
                <span v-if="isFinalized" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    Estado Final: {{ finalizedStatus }}
                </span>

                <!-- Acción: Finalizar Proceso (Si hay contrato y NO está finalizado) -->
                    <button 
                        v-if="hasContrato && !isFinalized" 
                        @click="finalizarProceso" 
                        :class="[
                            'px-5 py-2.5 text-white rounded-lg shadow-md transition flex items-center gap-2',
                            esEnviadoAArchivos ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                        ]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path v-if="esEnviadoAArchivos" stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ esEnviadoAArchivos ? 'Enviar a Archivos' : 'Revisar y finalizar' }}
                    </button>

                <!-- Acción: Adjuntar (Si es estado 10 y NO tiene contrato y NO está cargando) -->
                <button v-if="isDevuelto && !hasContrato && !loadingDetalles" @click="adjuntarExpediente" class="px-5 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Adjuntar Expediente
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
const bufetes = ref<any[]>([]) // Store bufetes list

watch(() => props.show, (newVal) => {
    if (newVal && props.expediente) {
        fetchDetalles()
        fetchBufetes() // Load bufetes when modal opens
    } else {
        detallesData.value = {}
    }
})

const fetchBufetes = async () => {
    try {
        const res = await api.get('/bufetes')
        bufetes.value = res.data
    } catch (error) {
        console.error('Error loading bufetes:', error)
    }
}

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

const hasContrato = computed(() => {
    // Check if the latest tracking (which should be state 10 in this context) has path_contrato
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return false;
    // We check the first one because API returns ordered desc
    const latest = detallesData.value.expediente.seguimientos[0];
    return !!latest.path_contrato;
})

const isDevuelto = computed(() => {
    return props.expediente?.seguimientos?.[0]?.id_estado === 10;
})

const isFinalized = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return false;
    const latest = detallesData.value.expediente.seguimientos[0];
    return !!latest.es_un_pagare;
})

const finalizedStatus = computed(() => {
    if (!isFinalized.value) return '';
    const latest = detallesData.value.expediente.seguimientos[0];
    return latest.es_un_pagare === 'si' ? 'Pagaré (Enviado a secreatria agencia)' : 'Archivo (Contrato Enviado)';
})

const close = () => {
    emit('close')
}

const verDocumento = async () => {
    try {
        const res = await api.get(`/secretaria-credito/ver-contrato/${props.expediente.id}`)
        if (res.data.success) {
            window.open(res.data.url, '_blank')
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo abrir el documento.', 'error')
    }
}

const adjuntarExpediente = async () => {
    const { value: file } = await Swal.fire({
        title: 'Adjuntar Expediente Escaneado',
        input: 'file',
        inputAttributes: {
            'accept': 'application/pdf',
            'aria-label': 'Subir expediente escaneado'
        },
        html: `
            <p class="text-sm text-gray-500 mb-4">Seleccione el archivo PDF del expediente escaneado para el cliente <b>${props.expediente.codigo_cliente}</b>.</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm: true,
        preConfirm: async (file) => {
            if (!file) {
                Swal.showValidationMessage('Por favor seleccione un archivo')
                return
            }
            
            const formData = new FormData()
            formData.append('file', file)
            formData.append('id', props.expediente.id)

            try {
                const response = await api.post('/secretaria-credito/guardar-escaneado', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Error al subir')
                }
                
                return response.data
            } catch (error: any) {
                Swal.showValidationMessage(
                    `Error: ${error.response?.data?.message || 'No se pudo subir el archivo'}`
                )
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })

    if (file) {
        Swal.fire({
            title: '¡Subido!',
            text: 'El expediente ha sido escaneado y adjuntado correctamente.',
            icon: 'success'
        })
        fetchDetalles() // Refresh modal details (to show "Ver Documento")
        emit('refresh') // Refresh parent list
    }
}

// ... (resto de tus computed properties existentes)

// ... (resto de tus computed properties existentes)

// 1. Nueva propiedad computada para detectar si ya fue enviado a archivos
const esEnviadoAArchivos = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return false;
    const latest = detallesData.value.expediente.seguimientos[0];
    // Ajustar según el caso exacto de tu DB ('Si', 'si', etc)
    return latest.enviado_a_archivos === 'Si' || latest.enviado_a_archivos === 'si';
})

// 2. Función finalizarProceso actualizada
const finalizarProceso = async () => {
    // 1. Extraemos la observación del último seguimiento
    const ultimoSeguimiento = detallesData.value?.expediente?.seguimientos?.[0];
    const observacion = ultimoSeguimiento?.observacion_envio || 'sin observación';
    
    let esPagareFinal = 'no';

    // CASO A: No ha sido enviado a archivos (Preguntamos con radio buttons)
    if (!esEnviadoAArchivos.value) {
        const { value: selection } = await Swal.fire({
            title: '¿Es un Pagaré?',
            html: `
                <div class="text-center">
                    <p class="mb-4 text-gray-700">
                        la observacion de la agrantia indica: <br>
                        <b class="text-blue-700">"${observacion}"</b>
                    </p>
                    <p class="mb-4 text-sm font-semibold">¿Confirma que el documento es un pagaré?</p>
                    <div class="flex justify-center gap-8">
                        <label class="inline-flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="es_pagare" value="si" class="h-5 w-5 text-indigo-600">
                            <span class="text-gray-900">Sí (Pagaré)</span>
                        </label>
                        <label class="inline-flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="es_pagare" value="no" class="h-5 w-5 text-red-600">
                            <span class="text-gray-900">No (Contrato)</span>
                        </label>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4F46E5',
            preConfirm: () => {
                const checked = document.querySelector('input[name="es_pagare"]:checked');
                if (!checked) {
                    Swal.showValidationMessage('Debe seleccionar una opción');
                    return null;
                }
                return (checked as HTMLInputElement).value;
            }
        });

        if (!selection) return;
        esPagareFinal = selection;

    } else {
        // CASO B: Ya fue enviado a archivos (Confirmación directa)
        const confirm = await Swal.fire({
            title: '¿Enviar a Archivos?',
            html: `
                <p class="text-gray-700">
                    en las observaciones de la garantia indica <b class="text-green-700">"${observacion}"</b>. 
                    <br><br>¿Confirmar envío a Archivo?
                </p>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sí, Enviar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10B981'
        });

        if (!confirm.isConfirmed) return;
        esPagareFinal = 'no';
    }

    // 2. Envío al Backend
    try {
        const res = await api.post('/secretaria-credito/finalizar-proceso', {
            id: props.expediente.id,
            es_pagare: esPagareFinal
        });
        
        if (res.data.success) {
            Swal.fire('Éxito', 'Proceso finalizado correctamente.', 'success');
            emit('refresh');
            emit('close');
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Error al procesar.', 'error');
    }
}


const handleAction = async (action: string) => {
    if (action === 'aceptar') {
        const result = await Swal.fire({
            title: '¿Aceptar Expediente?',
            text: "El expediente pasará a estado Aceptado (Estado 7) y se moverá al Buzón de Aceptados.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // green-500
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Aceptar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                const res = await api.post('/secretaria-credito/aceptar', {
                    id: props.expediente.id
                })
                if (res.data.success) {
                    Swal.fire('Aceptado', 'El expediente ha sido aceptado correctamente.', 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al aceptar expediente.', 'error')
            }
        }
        return;
    }

    if (action === 'enviarAbogado') {
        // Create options object for SweetAlert
        const bufeteOptions: any = {};
        bufetes.value.forEach(b => {
            const userName = b.user?.name || 'Usuario desconocido';
            const agency = b.agencia?.nombre || 'Sin agencia';
            bufeteOptions[b.id] = `${userName} - ${agency}`;
        });

        const result = await Swal.fire({
            title: '¿Enviar a Abogado?',
            text: "Seleccione el abogado a quien se enviará el expediente. Pasará a estado 'En manos de abogado' (Estado 8).",
            icon: 'question',
            input: 'select',
            inputOptions: bufeteOptions,
            inputPlaceholder: 'Seleccione un abogado',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5', // indigo-600
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Enviar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe seleccionar un abogado'
                }
            }
        })

        if (result.isConfirmed && result.value) {
            try {
                const res = await api.post('/secretaria-credito/enviar-abogado', {
                    id: props.expediente.id,
                    bufete_id: result.value // Pass selected bufete_id
                })
                if (res.data.success) {
                    Swal.fire('Enviado', 'El expediente ha sido enviado al abogado correctamente.', 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al enviar expediente.', 'error')
            }
        }
        return;
    }
}
</script>
