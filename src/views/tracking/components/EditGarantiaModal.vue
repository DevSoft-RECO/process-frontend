<template>
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Detalles de Garantía
                </h3>
                <button @click="close" class="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p class="text-sm text-blue-800 dark:text-blue-300">
                        Editando garantía: <span class="font-bold">{{ garantia?.nombre }}</span> <br>
                        Expediente: <span class="font-bold">{{ expedienteId }}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Codeudores -->
                    <div class="space-y-3">
                         <h4 class="font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Codeudores</h4>
                         <div v-for="i in 4" :key="`cod-${i}`">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Codeudor {{ i }}</label>
                            <input v-model="form[`codeudor${i}`]" type="text" 
                                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                         </div>
                    </div>

                    <!-- Observaciones -->
                    <div class="space-y-3">
                         <h4 class="font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Observaciones</h4>
                         <div v-for="i in 4" :key="`obs-${i}`">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Observación {{ i }}</label>
                            <input v-model="form[`observacion${i}`]" type="text"
                                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                         </div>
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
import { ref, watch, reactive } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    expedienteId: any
    garantia: any
}>()

const emit = defineEmits(['close', 'refresh'])

const saving = ref(false)
const form = reactive<any>({
    codeudor1: '', codeudor2: '', codeudor3: '', codeudor4: '',
    observacion1: '', observacion2: '', observacion3: '', observacion4: ''
})

watch(() => props.garantia, (newVal) => {
    if (newVal && newVal.pivot) {
        Object.keys(form).forEach(key => {
            form[key] = newVal.pivot[key] || ''
        })
    }
}, { immediate: true })

const close = () => {
    emit('close')
}

const save = async () => {
    saving.value = true
    try {
        const res = await api.put(`/nuevos-expedientes/${props.expedienteId}/garantias/${props.garantia.id}`, form)
        
        if (res.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'La garantía se ha actualizado correctamente.',
                timer: 1500,
                showConfirmButton: false
            })
            emit('refresh')
            emit('close')
        }
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'Error al actualizar garantía.', 'error')
    } finally {
        saving.value = false
    }
}
</script>
