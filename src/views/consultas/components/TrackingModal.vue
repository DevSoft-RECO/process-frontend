<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8 flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Historial de Seguimiento
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ expediente?.codigo_cliente }} - <span class="font-medium text-gray-700 dark:text-gray-300">{{ expediente?.nombre_asociado }}</span>
                    </p>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Body (Scrollable) -->
            <div class="p-6 overflow-y-auto custom-scrollbar">
                
                <div class="relative pl-4">
                    <!-- Vertical Line (Connects all steps) -->
                    <div class="absolute left-[27px] top-7 bottom-7 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    <!-- Dynamic Tracking Steps (Reverse Chronological) -->
                    <div 
                        v-for="(seg, index) in expediente.seguimientos" 
                        :key="seg.id_seguimiento"
                        class="relative flex items-start mb-8 group animate-slide-in"
                        :style="{ animationDelay: `${index * 100}ms` }"
                    >
                        <!-- Icon Circle -->
                         <div class="absolute left-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full z-10">
                             <!-- Wrapper to hide line behind icon -->
                            <div :class="[
                                'h-14 w-14 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-110',
                                getStateColorInfo(seg.id_estado).bg
                            ]">
                                <component :is="getStateIcon(seg.id_estado)" class="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <!-- Content Card -->
                        <div class="ml-20 w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative">
                            <!-- Arrow pointing to icon -->
                            <div class="absolute top-5 -left-2 w-4 h-4 bg-gray-50 dark:bg-gray-700/50 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>

                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-gray-900 dark:text-gray-100">
                                    {{ seg.estado?.nombre || 'Estado Desconocido' }}
                                </h3>
                                <span class="text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                    {{ formatDate(seg.created_at) }}
                                </span>
                            </div>

                             <div v-if="seg.usuario" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {{ seg.usuario }}
                            </div>

                            <div v-if="[4, 6].includes(seg.id_estado)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200 mb-2">
                                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                PROCESO FINALIZADO
                            </div>

                             <div v-if="seg.observacion || seg.observacion_rechazo" class="mt-2 text-sm p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                                <span class="block text-xs font-semibold text-gray-500 uppercase mb-1">Observación:</span>
                                <p class="text-gray-700 dark:text-gray-300 italic">
                                    "{{ seg.observacion || seg.observacion_rechazo }}"
                                </p>
                            </div>

                        </div>
                    </div>

                    <!-- Initial Step: Created -->
                    <div class="relative flex items-start group animate-slide-in" :style="{ animationDelay: `${(expediente.seguimientos?.length || 0) * 100}ms` }">
                         <div class="absolute left-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full z-10">
                            <div class="h-14 w-14 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-md bg-gray-400 transition-transform group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                         <div class="ml-20 w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative">
                              <div class="absolute top-5 -left-2 w-4 h-4 bg-gray-50 dark:bg-gray-700/50 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-gray-900 dark:text-gray-100">Expediente Creado</h3>
                                <span class="text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                    {{ formatDate(expediente?.created_at) }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                El expediente fue ingresado al sistema.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end shrink-0">
                <button @click="close" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Removed import { defineProps, defineEmits } from 'vue' as they are compiler macros

// Icons (Simple SVGs as components for cleaner template)
// You can also import these from a library like heroicons-vue if available
const IconCheckCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>` }
const IconClockCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }
const IconXCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>` }
const IconArchiveCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>` }
const IconSendCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>` }

defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    // Using toLocaleString for date and time support
    return date.toLocaleString('es-GT', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStateColorInfo = (idEstado: number) => {
    // 1: Enviado a Secretaria (Pendiente de revision)
    // 2: Rechazado
    // 3: Aceptado
    // 4: Archivo
    // 6: Archivo Administrativo
    // Others? 
    switch(idEstado) {
        case 1: return { bg: 'bg-blue-500' }     // Enviado
        case 2: return { bg: 'bg-red-500' }      // Rechazado / Devuelto
        case 3: return { bg: 'bg-green-500' }    // Aceptado
        case 4: return { bg: 'bg-gray-600' }     // Archivo
        case 6: return { bg: 'bg-gray-800' }     // Archivo Admin
        case 10: return { bg: 'bg-orange-500' }  // Devuelto Abogado? Check previous logs
        default: return { bg: 'bg-indigo-500' }
    }
}

const getStateIcon = (idEstado: number) => {
    switch(idEstado) {
        case 1: return IconSendCallback
        case 2: return IconXCallback
        case 3: return IconCheckCallback
        case 4: return IconArchiveCallback
        case 6: return IconArchiveCallback
        default: return IconClockCallback
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in {
    opacity: 0;
    animation: slideIn 0.4s ease-out forwards;
}
</style>
