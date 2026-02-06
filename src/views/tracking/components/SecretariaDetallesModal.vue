<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
                <div>
                     <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mb-2">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Revisión de Secretaría
                    </span>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Detalles del Expediente
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
                         <span v-if="numeroContrato" class="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Contrato: {{ numeroContrato }}
                        </span>
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
                     <!-- Rejection Alert -->
                    <div v-if="ultimoRechazo" class="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-md">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm leading-5 font-medium text-red-800 dark:text-red-200">
                                    Motivo del Regreso / Rechazo
                                </h3>
                                <div class="mt-2 text-sm leading-5 text-red-700 dark:text-red-300">
                                    <p class="font-medium italic">"{{ ultimoRechazo.observacion_rechazo }}"</p>
                                </div>
                            </div>
                        </div>
                    </div>

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

                <!-- Acción: Adjuntar Contrato (Visible si estado 3 y no tiene contrato) -->
                 <button v-if="currentState === 3 && !numeroContrato" @click="handleAction('adjuntar-contrato')" class="px-5 py-2.5 text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Agregar No. Contrato
                </button>

                <!-- Acción: Rechazar / Regresar (Visible si no es 3) -->
                <button v-if="currentState !== 3" @click="handleAction('rechazar')" class="px-5 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Rechazar / Regresar
                </button>

                 <!-- Acción: Enviar a Archivo (Solo visible si estado 3) -->
                <button v-if="currentState === 3 && !isArchivoActionTaken" @click="handleAction('archivo')" class="px-5 py-2.5 text-white bg-gray-600 rounded-lg hover:bg-gray-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Validar Envío a Archivo
                </button>

                 <!-- Acción: Enviar a Protocolo (Visible si estado 3) -->
                <button v-if="currentState === 3" @click="handleAction('protocolo')" class="px-5 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Enviar a Protocolo
                </button>

                 <!-- Acción: Archivar Administrativamente (Visible si estado 3) -->
                <button v-if="currentState === 3" @click="handleAction('administrativo')" class="px-5 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archivar Administrativamente
                </button>

                 <!-- Acción: Aceptar / Validar (Visible si no es 3) -->
                 <button v-if="currentState !== 3" @click="handleAction('aceptar')" class="px-5 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Aceptar Expediente
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

const ultimoRechazo = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) {
        return null;
    }
    const latest = detallesData.value.expediente.seguimientos[0];
    if (latest.id_estado === 2 && latest.observacion_rechazo) {
        return latest;
    }
    return null;
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

const handleAction = async (action: string) => {
    console.log('Acción seleccionada:', action)
    
    if (action === 'rechazar') {
        const result = await Swal.fire({
            title: 'Rechazar / Regresar',
            text: "Por favor ingrese el motivo del rechazo:",
            input: 'textarea',
            inputPlaceholder: 'Escriba la observación aquí...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Regresar a Asesores',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debes escribir una observación'
                }
            }
        })

        if (result.isConfirmed) {
            try {
                const res = await api.post('/seguimiento/rechazar', {
                    codigo_cliente: props.expediente.codigo_cliente,
                    observacion: result.value
                })

                if (res.data.success) {
                    Swal.fire('Regresado', 'El expediente ha sido regresado a asesores.', 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al rechazar expediente.', 'error')
            }
        }
        return;
    }

    if (action === 'aceptar') {
        const result = await Swal.fire({
            title: '¿Aceptar Expediente?',
            text: "El expediente pasará a estado Aceptado (Estado 3) y se habilitará el envío a archivo.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // green-500
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Aceptar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                const res = await api.post('/seguimiento/aceptar', {
                    codigo_cliente: props.expediente.codigo_cliente
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

    if (action === 'adjuntar-contrato') {
        const result = await Swal.fire({
            title: 'Adjuntar Contrato',
            text: "Ingrese el número de contrato:",
            input: 'text',
            inputPlaceholder: 'Número de contrato...',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe ingresar un número de contrato'
                }
            }
        })

        if (result.isConfirmed) {
            try {
                const res = await api.post('/secretaria-agencia/adjuntar-contrato', {
                    codigo_cliente: props.expediente.codigo_cliente,
                    numero_contrato: result.value
                })

                if (res.data.success) {
                    Swal.fire('Guardado', 'Número de contrato adjuntado correctamente.', 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al adjuntar contrato.', 'error')
            }
        }
        return;
    }

    if (action === 'archivo') {
        const { value: formValues } = await Swal.fire({
            title: 'Enviar a Archivo',
            html:
                '<div class="text-left space-y-4">' +
                '<p class="text-sm font-medium text-gray-900">¿El expediente tiene garantía real?</p>' +
                '<div class="flex flex-col gap-2">' +
                '  <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">' +
                '      <input type="radio" name="swal-garantia" value="si" class="h-4 w-4 text-verde-cope focus:ring-verde-cope border-gray-300">' +
                '      <span class="text-gray-900">Sí (Registrar envío físico)</span>' +
                '  </label>' +
                '  <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">' +
                '      <input type="radio" name="swal-garantia" value="no" class="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300" checked>' +
                '      <span class="text-gray-900">No (Solo registrar razon)</span>' +
                '  </label>' +
                '</div>' +
                '<label class="block text-sm font-medium text-gray-700 mt-2">Observación de Envío *</label>' +
                '<textarea id="swal-input-obs" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-verde-cope" rows="3" placeholder="Ingrese detalles del envío..."></textarea>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Procesar Envío',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const radioSi = document.querySelector('input[name="swal-garantia"][value="si"]') as HTMLInputElement
                const garantia = radioSi.checked
                const obs = (document.getElementById('swal-input-obs') as HTMLInputElement).value
                
                if (!obs) {
                    Swal.showValidationMessage('Debe ingresar una observación')
                    return false
                }
                return { garantia: garantia, obs: obs }
            }
        })

        if (formValues) {
            try {
                const res = await api.post('/seguimiento/enviar-archivo', {
                    codigo_cliente: props.expediente.codigo_cliente,
                    tiene_garantia_real: formValues.garantia,
                    observacion: formValues.obs
                })

                if (res.data.success) {
                    let msg = formValues.garantia 
                         ? 'Expediente marcado con Garantía Real y enviado.'
                         : 'Información registrada correctamente.';
                    
                    Swal.fire('Procesado', msg, 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al enviar a archivo.', 'error')
            }
        }
    }

    if (action === 'protocolo') {
        const result = await Swal.fire({
            title: '¿Enviar a Protocolo?',
            text: "El expediente será enviado a protocolo y saldra de su buzon al ser aceptado, una vez aceptado tambien podra archivarlo si este no cuenta con garantia real.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5', // indigo-600
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Enviar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                const res = await api.post('/seguimiento/enviar-protocolo', {
                    codigo_cliente: props.expediente.codigo_cliente
                })
                if (res.data.success) {
                    Swal.fire('Enviado', 'El expediente ha sido enviado a protocolo.', 'success')
                    emit('refresh')
                    emit('close')
                }
            } catch (error: any) {
                console.error(error)
                Swal.fire('Error', error.response?.data?.message || 'Error al enviar a protocolo.', 'error')
            }
        }
        return;
    }

    if (action === 'administrativo') {
        Swal.fire({
            icon: 'info',
            title: 'Próximamente',
            text: 'Funcionalidad de Archivo Administrativo en construcción.',
        })
    }
}

const currentState = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return 0;
    return detallesData.value.expediente.seguimientos[0].id_estado;
})

const isArchivoActionTaken = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return false;
    const latest = detallesData.value.expediente.seguimientos[0];
    // If state is 3 AND we have a value for 'enviado_a_archivos' (Si/No) or an observation
    // Since default might be 'No' from migration (if we didn't migrate nullable), checking observation is safer for "action taken"
    // But user wants it to disappear.
    // If the backend defaults to 'No' on creation/reset, then 'No' doesn't mean action taken.
    // However, we only set 'observacion_envio' when doing this specific action in State 3.
    return latest.id_estado === 3 && !!latest.observacion_envio;
})

const numeroContrato = computed(() => {
    if (!detallesData.value?.expediente?.seguimientos || detallesData.value.expediente.seguimientos.length === 0) return null;
    const latest = detallesData.value.expediente.seguimientos[0];
    return latest.numero_contrato;
})

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const close = () => {
    emit('close')
}
</script>
