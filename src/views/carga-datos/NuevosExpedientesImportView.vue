<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    
    <!-- Premium Upload Card -->
    <div class="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Left Side: Visual & Instructions -->
        <div class="w-full md:w-2/5 bg-slate-50 dark:bg-gray-900/50 p-8 flex flex-col justify-between border-r border-gray-100 dark:border-gray-700">
            <div>
                <div class="flex items-center justify-center w-12 h-12 bg-verde-cope/10 text-verde-cope rounded-xl mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Carga de Nuevos Expedientes</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                    Módulo para cargar expedientes recientes con filtro de fecha.
                </p>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-verde-cope"></div>
                    <h3 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Guía Paso a Paso</h3>
                    <ol class="relative border-l border-gray-200 dark:border-gray-700 ml-2 space-y-6">                  
                        <li class="mb-2 ml-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">1. Prepara tu Archivo</h4>
                            <p class="text-xs text-gray-500 mt-1">Asegúrate que sea <strong>CSV</strong>, separado por punto y coma (<code>;</code>).</p>
                        </li>
                        <li class="mb-2 ml-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">2. Selecciona Fecha</h4>
                            <p class="text-xs text-gray-500 mt-1">Ingresa la fecha inicial (requerida) y final (opcional).</p>
                        </li>
                        <li class="ml-4">
                            <div class="absolute w-3 h-3 bg-verde-cope rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
                            <h4 class="text-sm font-semibold text-verde-cope">3. Inicia el Proceso</h4>
                            <p class="text-xs text-gray-500 mt-1">Haz clic en el botón verde. Los datos se actualizarán.</p>
                        </li>
                    </ol>
                </div>
            </div>
            
            <p class="text-xs text-gray-400 mt-6">
                v1.2.0 &bull; Sistema Importación YK
            </p>
        </div>

        <!-- Right Side: Interaction Form -->
        <div class="w-full md:w-3/5 p-8 bg-white dark:bg-gray-800">
            <div class="max-w-md mx-auto h-full flex flex-col justify-center">
                
                <!-- Dropzone -->
                <div 
                    @click="triggerFileInput"
                    @drop.prevent="handleDrop"
                    @dragover.prevent
                    class="group relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-verde-cope dark:hover:border-verde-cope hover:bg-verde-cope/5 dark:hover:bg-verde-cope/10 rounded-2xl p-10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-4"
                >
                    <div class="w-16 h-16 bg-verde-cope/10 dark:bg-verde-cope/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-verde-cope" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.085 2.583H7.75a2.583 2.583 0 0 0-2.583 2.584v20.666a2.583 2.583 0 0 0 2.583 2.584h15.5a2.583 2.583 0 0 0 2.584-2.584v-15.5m-7.75-7.75 7.75 7.75m-7.75-7.75v7.75h7.75M15.5 23.25V15.5m-3.875 3.875h7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    
                    <div class="space-y-1">
                        <p class="text-gray-700 dark:text-gray-200 font-medium text-lg">
                            <span v-if="selectedFile">{{ selectedFile.name }}</span>
                            <span v-else>Arrastra tu archivo aquí</span>
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            o <span class="text-verde-cope underline font-medium">haz clic para explorar</span>
                        </p>
                    </div>
                    <input ref="fileInput" type="file" class="hidden" accept=".csv,.txt" @change="handleFileSelect" />
                </div>

                <!-- Controls Area -->
                <div class="mt-8 space-y-6">
                    
                    <!-- Date Inputs -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="group">
                            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Fecha Inicial <span class="text-red-500">*</span></label>
                            <input v-model="form.desde" type="date"
                                class="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-verde-cope focus:border-transparent transition-all dark:text-white">
                        </div>
                        <div class="group">
                            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Fecha Final</label>
                            <input v-model="form.hasta" type="date"
                                class="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-verde-cope focus:border-transparent transition-all dark:text-white">
                        </div>
                    </div>

                    <!-- Progress Bar (Visible when uploading) -->
                    <div v-if="importStore.progress > 0 || importStore.isUploading" class="mb-4">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-gray-500">Estado</span>
                            <span class="text-verde-cope font-bold">{{ importStore.statusMessage || 'Procesando...' }}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-verde-cope h-2.5 rounded-full transition-all duration-500" :style="{ width: '100%' }"></div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3 pt-2">
                        <button 
                            @click="selectedFile = null" 
                            v-if="selectedFile"
                            class="px-5 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        
                        <button 
                            @click="handleSubmit" 
                            :disabled="!selectedFile || importStore.isUploading"
                            class="flex-1 px-6 py-2.5 bg-verde-cope hover:bg-[#4a9c02] active:scale-95 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 transition-all flex justify-center items-center gap-2"
                        >
                            <svg v-if="importStore.isUploading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{{ importStore.isUploading ? 'Subiendo...' : 'Iniciar Carga' }}</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useImportNuevosStore } from '@/stores/importNuevosStore'
import Swal from 'sweetalert2'

const importStore = useImportNuevosStore()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive({
    desde: '',
    hasta: ''
})

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0] as File
    }
}

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        selectedFile.value = event.dataTransfer.files[0] as File
    }
}

const handleSubmit = async () => {
    if (!selectedFile.value) return

    // Require 'desde'
    if (!form.desde) {
        Swal.fire('Atención', 'Debes especificar la fecha inicial para filtrar la carga.', 'warning')
        return
    }

    importStore.startImport(selectedFile.value, {
        desde: form.desde.replace(/-/g, ''), // YYYYMMDD
        hasta: form.hasta ? form.hasta.replace(/-/g, '') : null,
        full: false
    })
    
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
}
</script>
