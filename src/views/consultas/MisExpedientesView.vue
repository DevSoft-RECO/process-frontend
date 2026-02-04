<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Mis Expedientes
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de expedientes nuevos y asignación de garantías.
        </p>
      </div>
      <div class="flex gap-2">
         <button @click="resetFetch" class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refrescar
         </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Código</th>
                        <th scope="col" class="px-6 py-3">Nombre Asociado</th>
                        <th scope="col" class="px-6 py-3">CUI</th>
                        <th scope="col" class="px-6 py-3 text-right">Monto</th>
                        <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            No hay expedientes nuevos.
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            {{ exp.codigo_cliente }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ exp.nombre_asociado }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                            {{ exp.cui }}
                        </td>
                        <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto_documento) }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <button 
                                    @click="openGarantiaModal(exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-verde-cope bg-verde-cope/10 hover:bg-verde-cope/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope transition-colors"
                                    title="Agregar Garantía"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Garantía
                                </button>
                                <button 
                                    @click="openDocModal(exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    title="Agregar Documento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documento
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-center">
            <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold hover:underline">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>

    <!-- Modal Agregar Garantía -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Agregar Garantía
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ selectedExpediente?.codigo_cliente }} - {{ selectedExpediente?.nombre_asociado }}</span>
                </p>
            </div>
            
            <form @submit.prevent="submitGarantia" class="p-6 space-y-6">
                <!-- Selección de Garantía -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Garantía *</label>
                    <select v-model="form.garantia_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="" disabled>Seleccione una garantía...</option>
                        <option v-for="g in garantiasList" :key="g.id" :value="g.id">{{ g.nombre }}</option>
                    </select>
                </div>

                <!-- Codeudores -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <h3 class="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Codeudores</h3>
                    <div v-for="i in 4" :key="'co'+i">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Codeudor {{ i }}</label>
                        <input v-model="form[`codeudor${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <!-- Observaciones -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                     <h3 class="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Observaciones</h3>
                    <div v-for="i in 4" :key="'obs'+i">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Observación {{ i }}</label>
                        <input v-model="form[`observacion${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="submitting" class="px-5 py-2.5 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30 transition flex items-center gap-2">
                        <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ submitting ? 'Guardando...' : 'Guardar Garantía' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Agregar Documento -->
    <div v-if="showDocModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Agregar Documento Legal
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ selectedExpediente?.codigo_cliente }} - {{ selectedExpediente?.nombre_asociado }}</span>
                </p>
            </div>
            
            <form @submit.prevent="submitDocumento" class="p-6 space-y-6">
                <!-- Data Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- Columna 1 -->
                     <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento *</label>
                            <select v-model="docForm.tipo_documento_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="" disabled>Seleccione...</option>
                                <option v-for="t in tiposDocumentoList" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Documento</label>
                            <input v-model="docForm.numero" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                            <input v-model="docForm.fecha" type="date" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Póliza</label>
                            <input v-model="docForm.monto_poliza" type="number" step="0.01" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                     </div>

                     <!-- Columna 2 -->
                     <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro de Propiedad *</label>
                            <select v-model="docForm.registro_propiedad_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="" disabled>Seleccione...</option>
                                <option v-for="r in registrosList" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Finca</label>
                            <input v-model="docForm.no_finca" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folio</label>
                            <input v-model="docForm.folio" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libro</label>
                            <input v-model="docForm.libro" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                     </div>

                     <!-- Columna 3 -->
                     <div class="space-y-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario / Titular</label>
                            <input v-model="docForm.propietario" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autorizador / Notario</label>
                            <input v-model="docForm.autorizador" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Dominio</label>
                            <input v-model="docForm.no_dominio" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencia</label>
                            <input v-model="docForm.referencia" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                     </div>
                </div>

                <!-- Observaciones (Full Width) -->
                <div>
                     <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                     <textarea v-model="docForm.observacion" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" @click="closeDocModal" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="submitting" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition flex items-center gap-2">
                        <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ submitting ? 'Guardando...' : 'Guardar Documento' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

interface NuevoExpediente {
    codigo_cliente: number
    nombre_asociado: string
    cui: string
    monto_documento: number
    id_agencia: string
}

interface CatalogItem {
    id: number
    nombre: string
}

const expedientes = ref<NuevoExpediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)

// --- Garantia Modal State ---
const showModal = ref(false)
const selectedExpediente = ref<NuevoExpediente | null>(null)
const garantiasList = ref<CatalogItem[]>([])
const submitting = ref(false)

const form = reactive({
    garantia_id: '',
    codeudor1: '', codeudor2: '', codeudor3: '', codeudor4: '',
    observacion1: '', observacion2: '', observacion3: '', observacion4: ''
})

// --- Documento Modal State ---
const showDocModal = ref(false)
const tiposDocumentoList = ref<CatalogItem[]>([])
const registrosList = ref<CatalogItem[]>([])

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

// Fetch Expedientes
const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    const endpoint = url || '/nuevos-expedientes'
    try {
        const response = await api.get(endpoint)
        if (response.data.success) {
            const pagination = response.data.data
            if (!url) {
                expedientes.value = pagination.data
            } else {
                expedientes.value = [...expedientes.value, ...pagination.data]
            }
            nextPageUrl.value = pagination.next_page_url
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

const resetFetch = () => fetchExpedientes(null)

// Formatters
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

// --- Garantia Logic ---
const openGarantiaModal = async (exp: NuevoExpediente) => {
    selectedExpediente.value = exp
    resetForm()
    
    // Fetch guarantees list if empty
    if (garantiasList.value.length === 0) {
        try {
            const res = await api.get('/garantias')
            if (res.data.success) {
                garantiasList.value = res.data.data.data || res.data.data 
            }
        } catch (e) { console.error(e) }
    }
    
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedExpediente.value = null
}

const resetForm = () => {
    form.garantia_id = ''
    form.codeudor1 = ''; form.codeudor2 = ''; form.codeudor3 = ''; form.codeudor4 = ''
    form.observacion1 = ''; form.observacion2 = ''; form.observacion3 = ''; form.observacion4 = ''
}

const submitGarantia = async () => {
    if (!selectedExpediente.value) return
    submitting.value = true
    
    try {
        await api.post(`/nuevos-expedientes/${selectedExpediente.value.codigo_cliente}/garantias`, form)
        
        Swal.fire({
            icon: 'success',
            title: 'Garantía Agregada',
            text: 'La garantía se ha vinculado correctamente.',
            timer: 2000,
            showConfirmButton: false
        })
        closeModal()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar.', 'error')
    } finally {
        submitting.value = false
    }
}

// --- Documento Logic ---
const openDocModal = async (exp: NuevoExpediente) => {
    selectedExpediente.value = exp
    resetDocForm()

    // Fetch catalogs lazily
    if (tiposDocumentoList.value.length === 0) {
        try {
            const res = await api.get('/tipo-documentos')
            if (res.data.success) tiposDocumentoList.value = res.data.data.data || res.data.data
        } catch(e){ console.error(e) }
    }
    if (registrosList.value.length === 0) {
        try {
            const res = await api.get('/registros-propiedad')
            if (res.data.success) registrosList.value = res.data.data.data || res.data.data
        } catch(e){ console.error(e) }
    }

    showDocModal.value = true
}

const closeDocModal = () => {
    showDocModal.value = false
    selectedExpediente.value = null
}

const resetDocForm = () => {
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

const submitDocumento = async () => {
    if (!selectedExpediente.value) return
    submitting.value = true

    try {
         await api.post(`/nuevos-expedientes/${selectedExpediente.value.codigo_cliente}/documentos`, docForm)
         
         Swal.fire({
            icon: 'success',
            title: 'Documento Agregado',
            text: 'El documento se ha vinculado correctamente.',
            timer: 2000,
            showConfirmButton: false
        })
        closeDocModal()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el documento.', 'error')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    fetchExpedientes()
})
</script>
