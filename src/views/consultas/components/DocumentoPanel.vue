<template>
    <div class="h-full">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ docSearchStep ? 'Buscar Documento Existente' : (existingDocFound ? 'Vincular Documento Existente' : 'Registrar Nuevo Documento') }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
                Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
            </p>
        </div>
        
        <div class="p-6 space-y-6">
            <!-- Linked Documents List -->


            <form @submit.prevent="submitDocumento">
                <!-- Step 1: Search Inputs -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Documento *</label>
                        <input v-model="docForm.numero" type="text" :readonly="!docSearchStep && existingDocFound" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white readonly:bg-gray-100 dark:readonly:bg-gray-800" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Documento *</label>
                        <input v-model="docForm.fecha" type="date" :readonly="!docSearchStep && existingDocFound" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white readonly:bg-gray-100 dark:readonly:bg-gray-800" required />
                    </div>
                    
                    <!-- Search Button -->
                    <div class="md:col-span-2 flex justify-end gap-3" v-if="docSearchStep">
                        <button type="button" @click="close" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="button" @click="checkDocumento" :disabled="checkingDoc || !docForm.numero || !docForm.fecha" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
                                <svg v-if="checkingDoc" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificar Existencia
                        </button>
                    </div>
                </div>
                
                <!-- Linked Documents List (Moved Here) -->
                    <div v-if="linkedDocs.length > 0" class="mb-6 mt-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Documentos Asociados Actualmente
                    </h3>
                    <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
                        <div v-for="ld in linkedDocs" :key="ld.id" class="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600">
                            <div>
                                <p class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ ld.tipo_documento?.nombre || 'Documento' }}</p>
                                <p class="text-xs text-gray-500">No: {{ ld.numero }} | Fecha: {{ ld.fecha }}</p>
                            </div>
                            <button type="button" @click="detachDocumento(ld.id)" :disabled="!canEdit" class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed" title="Desvincular">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 1.5: Selection List (If matches found) -->
                <div v-if="docSelectionStep" class="animate-fade-in-down mt-6">
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                        <div class="flex items-start gap-3">
                            <div class="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full text-yellow-600 dark:text-yellow-300 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-yellow-800 dark:text-yellow-300">Coincidencias Encontradas</h3>
                                <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                    Se encontraron uno o más documentos con el número <strong>{{ docForm.numero }}</strong> y fecha <strong>{{ docForm.fecha }}</strong>.
                                    <br>Seleccione uno de la lista para vincularlo, o registre uno nuevo si ninguno coincide.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- List of Matches -->
                    <div class="grid gap-4 mb-6 max-h-[400px] overflow-y-auto p-1">
                        <div v-for="doc in foundDocs" :key="doc.id" class="relative group p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-sm hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" :class="doc.already_linked ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center gap-2">
                                            <h4 class="font-bold text-gray-900 dark:text-white">{{ doc.tipo_documento?.nombre || 'Sin Tipo' }}</h4>
                                            <span v-if="doc.already_linked" class="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                            YA VINCULADO
                                            </span>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        <span class="font-semibold">Finca:</span> {{ doc.no_finca }} | 
                                        <span class="font-semibold">Folio:</span> {{ doc.folio }} | 
                                        <span class="font-semibold">Libro:</span> {{ doc.libro }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Propietario: {{ doc.propietario || 'N/A' }} | Registro: {{ doc.registro_propiedad?.nombre || 'N/A' }}
                                    </p>
                                </div>
                                <button type="button" @click="selectExistingDoc(doc)" :disabled="!canEdit" class="px-3 py-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ doc.already_linked ? 'Vincular de nuevo' : 'Seleccionar' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 sticky bottom-0">
                            <button type="button" @click="docSearchStep = true; docSelectionStep = false" class="text-sm text-blue-600 hover:underline">
                            &larr; Volver a búsqueda
                        </button>
                        <div class="flex gap-3 ml-auto">
                            <!-- Option to create NEW despite matches -->
                            <button type="button" @click="proceedToCreate" :disabled="!canEdit" class="px-4 py-2 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Ninguno de estos - Registrar Nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Full Form (If checking passed) -->
                <div v-else-if="!docSearchStep" class="animate-fade-in-down mt-6">
                    
                    <div v-if="existingDocFound" :class="isDuplicate ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'" class="p-4 rounded-lg border mb-6 flex items-start gap-4">
                        <div :class="isDuplicate ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' : 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300'" class="p-2 rounded-full shrink-0">
                            <svg v-if="!isDuplicate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold" :class="isDuplicate ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'">
                                {{ isDuplicate ? 'Documento YA Asociado' : 'Documento Encontrado' }}
                            </h3>
                            <p class="text-sm mt-1" :class="isDuplicate ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">
                                {{ isDuplicate ? 'Este documento ya se encuentra vinculado a este expediente. Volver a vincularlo no creará duplicados, pero es redundante.' : 'Este documento ya existe en el sistema. Se vinculará al expediente actual sin crear duplicados.' }}
                            </p>
                        </div>
                    </div>

                        <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6 flex items-start gap-4">
                        <div class="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full text-yellow-600 dark:text-yellow-300 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-yellow-800 dark:text-yellow-300">Documento Nuevo</h3>
                            <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                No se encontró el documento. Por favor complete los detalles para registrarlo.
                            </p>
                        </div>
                    </div>


                    <!-- Data Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <!-- Columna 1 -->
                            <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento *</label>
                                <select v-model="docForm.tipo_documento_id" :disabled="existingDocFound" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="t in tiposDocumentoList" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                                </select>
                            </div>
                                <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Póliza</label>
                                <input v-model="docForm.monto_poliza" :disabled="existingDocFound" type="number" step="0.01" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            </div>

                            <!-- Columna 2 -->
                            <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro de Propiedad *</label>
                                <select v-model="docForm.registro_propiedad_id" :disabled="existingDocFound" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="r in registrosList" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Finca</label>
                                <input v-model="docForm.no_finca" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folio</label>
                                <input v-model="docForm.folio" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libro</label>
                                <input v-model="docForm.libro" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            </div>

                            <!-- Columna 3 -->
                            <div class="space-y-4">
                                <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario / Titular</label>
                                <input v-model="docForm.propietario" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                                <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autorizador / Notario</label>
                                <input v-model="docForm.autorizador" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Dominio</label>
                                <input v-model="docForm.no_dominio" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencia</label>
                                <input v-model="docForm.referencia" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            </div>
                    </div>

                    <!-- Observaciones (Full Width) -->
                    <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                            <textarea v-model="docForm.observacion" :disabled="existingDocFound" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"></textarea>
                    </div>
                </div>

                <!-- Step 2 Footer (Form Actions) -->
                <div v-if="!docSearchStep && !docSelectionStep" class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" @click="docSearchStep = true" class="text-sm text-blue-600 hover:underline">
                        &larr; Volver a búsqueda
                    </button>
                    <div class="flex gap-3 ml-auto">
                        <button type="button" @click="close" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="submitting || !canEdit" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ existingDocFound ? 'Vincular Documento' : 'Registrar y Vincular' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
    expediente: any
}>()

const emit = defineEmits(['close', 'saved'])
const authStore = useAuthStore()

// State
const docSearchStep = ref(true)
const docSelectionStep = ref(false)
const checkingDoc = ref(false)
const submitting = ref(false)
const foundDocs = ref<any[]>([]) 
const linkedDocs = ref<any[]>([])

const existingDocFound = ref(false)
const existingDocId = ref<number | null>(null)
const isDuplicate = ref(false)

const tiposDocumentoList = ref<any[]>([])
const registrosList = ref<any[]>([])

const docForm = reactive({
    tipo_documento_id: '',
    registro_propiedad_id: '',
    numero: '',
    fecha: '',
    propietario: '',
    autorizador: '',
    no_finca: '',
    folio: '',
    libro: '',
    no_dominio: '',
    referencia: '',
    monto_poliza: '',
    observacion: ''
})

const canEdit = computed(() => {
    // 1. Super Admin always can edit
    if (authStore.hasRole('Super Admin')) return true;

    // 2. Check tracking status
    // If no tracking info (new), can edit
    if (!props.expediente?.seguimientos || props.expediente.seguimientos.length === 0) return true;

    // 3. User said: "once entered tracking, cannot modify except Super Admin". 
    // So even if rejected, regular users cannot edit.
    return false;
})

// Initialize logic


const initModal = () => {
    resetForm()
    linkedDocs.value = props.expediente?.documentos || []
    
    // Fetch catalogs non-blocking
    if (tiposDocumentoList.value.length === 0) fetchTiposDocumento()
    if (registrosList.value.length === 0) fetchRegistros()
}

const fetchTiposDocumento = async () => {
    try {
        const res = await api.get('/tipo-documentos')
        if (res.data.success) tiposDocumentoList.value = res.data.data.data || res.data.data
    } catch (e) { console.error(e) }
}

const fetchRegistros = async () => {
    try {
        const res = await api.get('/registros-propiedad')
        if (res.data.success) registrosList.value = res.data.data.data || res.data.data
    } catch (e) { console.error(e) }
}

const resetForm = () => {
    docSearchStep.value = true
    docSelectionStep.value = false
    existingDocFound.value = false
    existingDocId.value = null
    foundDocs.value = []
    isDuplicate.value = false
    
    docForm.tipo_documento_id = ''
    docForm.registro_propiedad_id = ''
    docForm.numero = ''
    docForm.fecha = ''
    docForm.propietario = ''
    docForm.autorizador = ''
    docForm.no_finca = ''
    docForm.folio = ''
    docForm.libro = ''
    docForm.no_dominio = ''
    docForm.referencia = ''
    docForm.monto_poliza = ''
    docForm.observacion = ''
}

const checkDocumento = async () => {
    if (!docForm.numero || !docForm.fecha) return
    checkingDoc.value = true
    isDuplicate.value = false 
    foundDocs.value = []
    
    try {
        const res = await api.post('/documentos/check', {
            numero: docForm.numero,
            fecha: docForm.fecha,
            nuevo_expediente_id: props.expediente?.codigo_cliente
        })
        
        if (res.data.found && Array.isArray(res.data.data) && res.data.data.length > 0) {
            foundDocs.value = res.data.data
            docSearchStep.value = false
            docSelectionStep.value = true // Go to selection list
        } else {
            proceedToCreate()
        }
    } catch (e: any) {
        console.error(e)
        Swal.fire('Error', 'No se pudo verificar el documento', 'error')
    } finally {
        checkingDoc.value = false
    }
}

const selectExistingDoc = (doc: any) => {
    existingDocFound.value = true
    existingDocId.value = doc.id
    isDuplicate.value = doc.already_linked

    docForm.tipo_documento_id = doc.tipo_documento_id
    docForm.registro_propiedad_id = doc.registro_propiedad_id
    docForm.propietario = doc.propietario
    docForm.autorizador = doc.autorizador
    docForm.no_finca = doc.no_finca
    docForm.folio = doc.folio
    docForm.libro = doc.libro
    docForm.no_dominio = doc.no_dominio
    docForm.referencia = doc.referencia
    docForm.monto_poliza = doc.monto_poliza
    docForm.observacion = doc.observacion

    docSelectionStep.value = false 
}

const proceedToCreate = () => {
    existingDocFound.value = false
    existingDocId.value = null
    isDuplicate.value = false
    docSearchStep.value = false
    docSelectionStep.value = false
}

const detachDocumento = async (docId: number) => {
    if (!props.expediente) return
    if (!canEdit.value) {
        Swal.fire('Acceso Denegado', 'No tiene permisos para modificar este expediente en su estado actual.', 'warning');
        return;
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Desvincularás este documento del expediente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, desvincular',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.delete(`/nuevos-expedientes/${props.expediente.codigo_cliente}/documentos/${docId}`)
            if (res.data.success) {
                linkedDocs.value = linkedDocs.value.filter(d => d.id !== docId)
                emit('saved') // Trigger refresh on parent
                Swal.fire('Desvinculado', 'El documento ha sido quitado.', 'success')
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'No se pudo desvincular el documento.', 'error')
        }
    }
}

const submitDocumento = async () => {
    if (!props.expediente) return
    if (!canEdit.value) {
        Swal.fire('Acceso Denegado', 'No tiene permisos para modificar este expediente en su estado actual.', 'warning');
        return;
    }
    
    submitting.value = true

    const payload: any = { ...docForm }
    if (existingDocFound.value && existingDocId.value) {
        payload.documento_id = existingDocId.value
    }

    try {
            await api.post(`/nuevos-expedientes/${props.expediente.codigo_cliente}/documentos`, payload)
            
            Swal.fire({
            icon: 'success',
            title: existingDocFound.value ? 'Documento Vinculado' : 'Documento Registrado',
            text: 'El documento se ha asociado correctamente al expediente.',
            timer: 2000,
            showConfirmButton: false
        })
        emit('saved')
        // close() -- Removed to keep open
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el documento.', 'error')
    } finally {
        submitting.value = false
    }
}

// Initialize logic moved to end to ensures access to initModal
watch(() => props.expediente, (newVal) => {
    if (newVal) {
        initModal()
    }
}, { immediate: true })

const close = () => {
    emit('close')
}
</script>
