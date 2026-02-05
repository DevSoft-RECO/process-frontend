<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        Rastreo de Expediente
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}
                    </p>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="p-8">
                <!-- Stepper Container -->
                <div class="relative">
                    <!-- Vertical Line -->
                    <div class="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    <!-- Step 1: Ingreso (Always Completed) -->
                    <div class="relative flex items-start mb-8 group">
                        <div class="absolute left-0 h-16 w-16 flex items-center justify-center">
                            <div class="h-4 w-4 rounded-full bg-verde-cope ring-4 ring-white dark:ring-gray-800 animate-pulse"></div>
                            <!-- Icon/Circle -->
                            <div class="absolute h-10 w-10 rounded-full bg-verde-cope flex items-center justify-center text-white shadow-lg z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-20">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ingreso de Expediente</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Expediente creado y registrado.</p>
                            <span class="text-xs text-verde-cope font-medium mt-1 block">Completado</span>
                        </div>
                    </div>

                    <!-- Step 2: Secretaría -->
                    <div class="relative flex items-start mb-8 group">
                        <div class="absolute left-0 h-16 w-16 flex items-center justify-center">
                            <div :class="[
                                'h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg z-10 transition-colors duration-300',
                                secretariaState.color
                            ]">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-20">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Secretaría y Revisión</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Revisión por parte de secretaría.</p>
                             
                            <div v-if="secretariaState.status === 'pendiente'" class="mt-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    Pendiente de envío
                                </span>
                            </div>

                            <div v-if="secretariaState.status === 'enviado'" class="mt-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Enviado a revisión
                                </span>
                                <p class="text-xs text-gray-500 mt-1">En espera de validación.</p>
                            </div>

                            <div v-if="secretariaState.status === 'rechazado'" class="mt-2 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                                <span class="font-bold text-red-600 flex items-center gap-1">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Rechazado / Devuelto
                                </span>
                                <p class="text-red-700 dark:text-red-300 mt-1 italic">
                                    "{{ secretariaState.observacion }}"
                                </p>
                            </div>

                            <div v-if="secretariaState.status === 'aceptado'" class="mt-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Aceptado / En Revisión Final
                                </span>
                                <p class="text-xs text-green-600 dark:text-green-400 mt-1">Listo para enviar a archivo.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Archivo (Future) -->
                    <div class="relative flex items-start group">
                        <div class="absolute left-0 h-16 w-16 flex items-center justify-center">
                            <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white shadow z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-20">
                            <h3 class="text-lg font-bold text-gray-500 dark:text-gray-400">Archivo General</h3>
                            <p class="text-sm text-gray-400">Finalización y archivo.</p>
                            <span class="text-xs text-gray-400 font-medium mt-1 block">Pendiente</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button @click="close" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition">
                    Entendido
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}

// Compute state of step 2 based on tracking logic
const secretariaState = computed(() => {
    // Colors
    const GRAY = 'bg-gray-300 dark:bg-gray-600'
    const BLUE = 'bg-blue-500'
    const RED = 'bg-orange-500' // Using orange for 'Returned' feeling, or Red for error

    if (!props.expediente || !props.expediente.seguimientos || props.expediente.seguimientos.length === 0) {
        return { status: 'pendiente', color: GRAY, observacion: null }
    }

    const latest = props.expediente.seguimientos[0] // Assumes desc order

    if (latest.id_estado === 1) {
        return { status: 'enviado', color: BLUE, observacion: null }
    }
    
    if (latest.id_estado === 2) {
        return { 
            status: 'rechazado', 
            color: RED, 
            observacion: latest.observacion_rechazo 
        }
    }

    if (latest.id_estado === 3) {
        return {
            status: 'aceptado',
            color: 'bg-green-500',
            observacion: null
        }
    }

    // Default fallback
    return { status: 'pendiente', color: GRAY, observacion: null }
})
</script>
