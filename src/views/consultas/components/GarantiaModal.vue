<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Agregar Garantía
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
                </p>
            </div>
            
            <form @submit.prevent="submit" class="p-6 space-y-6">
                <!-- Selección de Garantía -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Garantía *
                        <span v-if="expediente?.tipo_garantia" class="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-normal">
                             Ref: {{ expediente.tipo_garantia }}
                        </span>
                    </label>
                    <select v-model="form.garantia_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="" disabled>Seleccione una garantía...</option>
                        <option v-for="g in garantiasList" :key="g.id" :value="g.id">{{ g.nombre }}</option>
                    </select>
                </div>

                <!-- Codeudores y Observaciones (Paired) -->
                <div class="space-y-4">
                     <div v-for="i in 4" :key="i" class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Codeudor Input -->
                        <div>
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Codeudor {{ i }}</label>
                            <input v-model="form[`codeudor${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" :placeholder="`Nombre del Codeudor ${i}`" />
                        </div>
                        <!-- Observacion Input -->
                        <div>
                            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Observación {{ i }}</label>
                            <input v-model="form[`observacion${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" :placeholder="`Observación para Codeudor ${i}`" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" @click="close" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close', 'saved'])

const submitting = ref(false)
const garantiasList = ref<any[]>([])

const form = reactive({
    garantia_id: '',
    codeudor1: '', codeudor2: '', codeudor3: '', codeudor4: '',
    observacion1: '', observacion2: '', observacion3: '', observacion4: ''
})

const fetchGarantias = async () => {
    if (garantiasList.value.length > 0) return
    try {
        const res = await api.get('/garantias')
        if (res.data.success) {
            garantiasList.value = res.data.data.data || res.data.data 
        }
    } catch (e) {
        console.error(e)
    }
}

const resetForm = () => {
    form.garantia_id = ''
    form.codeudor1 = ''; form.codeudor2 = ''; form.codeudor3 = ''; form.codeudor4 = ''
    form.observacion1 = ''; form.observacion2 = ''; form.observacion3 = ''; form.observacion4 = ''
}

const populateForm = (exp: any) => {
    resetForm()
    if (exp?.garantias && exp.garantias.length > 0) {
        const existing = exp.garantias[0]
        form.garantia_id = existing.id
        if (existing.pivot) {
             form.codeudor1 = existing.pivot.codeudor1 || ''
             form.codeudor2 = existing.pivot.codeudor2 || ''
             form.codeudor3 = existing.pivot.codeudor3 || ''
             form.codeudor4 = existing.pivot.codeudor4 || ''
             form.observacion1 = existing.pivot.observacion1 || ''
             form.observacion2 = existing.pivot.observacion2 || ''
             form.observacion3 = existing.pivot.observacion3 || ''
             form.observacion4 = existing.pivot.observacion4 || ''
        }
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        fetchGarantias()
        populateForm(props.expediente)
    }
})

const close = () => {
    emit('close')
}

const submit = async () => {
    if (!props.expediente) return
    submitting.value = true
    
    try {
        await api.post(`/nuevos-expedientes/${props.expediente.codigo_cliente}/garantias`, form)
        
        Swal.fire({
            icon: 'success',
            title: 'Garantía Guardada',
            text: 'La garantía se ha actualizado correctamente.',
            timer: 2000,
            showConfirmButton: false
        })
        emit('saved')
        close()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar.', 'error')
    } finally {
        submitting.value = false
    }
}
</script>
