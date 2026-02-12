<template>
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
             <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
               <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Documento
                </h3>
                <button @click="close" class="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div class="grid grid-cols-2 gap-4">
                     <!-- Tipo Documento -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento</label>
                        <select v-model="form.tipo_documento_id" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                            <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
                                {{ tipo.nombre }}
                            </option>
                        </select>
                    </div>

                    <!-- Registro Propiedad -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro de Propiedad</label>
                        <select v-model="form.registro_propiedad_id" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                            <option v-for="reg in registrosPropiedad" :key="reg.id" :value="reg.id">
                                {{ reg.nombre }}
                            </option>
                        </select>
                    </div>
                    
                    <!-- Numero -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
                         <input v-model="form.numero" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                    </div>

                    <!-- Fecha -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                         <input v-model="form.fecha" type="date" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                    </div>

                     <!-- Propietario -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario / Titular</label>
                         <input v-model="form.propietario" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                    </div>
                    
                    <!-- Autorizador -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autorizador / Notario</label>
                         <input v-model="form.autorizador" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                    </div>

                    <!-- Monto Poliza -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Póliza</label>
                         <input v-model="form.monto_poliza" type="number" step="0.01" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                    </div>

                    <!-- Datos Registrales -->
                    <div class="col-span-2 grid grid-cols-3 gap-2">
                        <div>
                             <label class="block text-xs font-medium text-gray-500 mb-1">No. Finca</label>
                             <input v-model="form.no_finca" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-xs">
                        </div>
                        <div>
                             <label class="block text-xs font-medium text-gray-500 mb-1">Folio</label>
                             <input v-model="form.folio" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-xs">
                        </div>
                         <div>
                             <label class="block text-xs font-medium text-gray-500 mb-1">Libro</label>
                             <input v-model="form.libro" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-xs">
                        </div>
                        <div>
                             <label class="block text-xs font-medium text-gray-500 mb-1">No Dominio</label>
                             <input v-model="form.no_dominio" type="text" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm text-xs">
                        </div>
                    </div>

                    <!-- Observaciones -->
                     <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                        <textarea v-model="form.observacion" rows="3" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm"></textarea>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
                <button @click="close" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                    Cancelar
                </button>
                <button @click="save" :disabled="saving" class="px-4 py-2 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2">
                    <svg v-if="saving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    documento: any
}>()

const emit = defineEmits(['close', 'refresh'])

const saving = ref(false)
const tiposDocumento = ref<any[]>([])
const registrosPropiedad = ref<any[]>([])

const form = reactive<any>({
    tipo_documento_id: '',
    registro_propiedad_id: '',
    numero: '',
    fecha: '',
    monto_poliza: '',
    no_finca: '',
    folio: '',
    libro: '',
    no_dominio: '',
    propietario: '',
    autorizador: '',
    observacion: '',
    referencia: ''
})

const fetchCatalogs = async () => {
    try {
        const [tiposRes, registrosRes] = await Promise.all([
            api.get('/tipo-documentos?all=true'),
            api.get('/registros-propiedad')
        ])
        
        if (tiposRes.data.success) {
            tiposDocumento.value = tiposRes.data.data
        }
        
        if (registrosRes.data.success) {
            registrosPropiedad.value = registrosRes.data.data
        }
    } catch (e) {
        console.error('Error loading catalogs', e)
    }
}

onMounted(() => {
    fetchCatalogs()
})

watch(() => props.documento, (newVal) => {
    if (newVal) {
        Object.keys(form).forEach(key => {
            if (key === 'fecha' && newVal[key]) {
                 // Return only YYYY-MM-DD
                 form[key] = newVal[key].split(' ')[0]
            } else {
                form[key] = newVal[key] || ''
            }
        })
    }
}, { immediate: true })

const close = () => {
    emit('close')
}

const save = async () => {
    saving.value = true
    try {
        const res = await api.put(`/documentos/${props.documento.id}`, form)
        
        if (res.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'El documento se ha actualizado correctamente.',
                timer: 1500,
                showConfirmButton: false
            })
            emit('refresh')
            emit('close')
        }
    } catch (error: any) {
        console.error(error)
        // Check for specific security error (403)
        if (error.response?.status === 403) {
             Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: error.response?.data?.message || 'No tienes permiso para editar este documento.',
            })
        } else {
            Swal.fire('Error', error.response?.data?.message || 'Error al actualizar documento.', 'error')
        }
    } finally {
        saving.value = false
    }
}
</script>
