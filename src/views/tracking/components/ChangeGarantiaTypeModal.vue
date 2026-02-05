<template>
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
             <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
               <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Cambiar Tipo de Garantía
                </h3>
                <button @click="close" class="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 space-y-4">
                <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                    <p class="font-bold flex items-center gap-2">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Atención
                    </p>
                    <p class="mt-1">
                        Esta acción reemplazará la garantía actual <strong>"{{ garantia?.nombre }}"</strong> con la nueva selección. 
                        Los datos de codeudores y observaciones se conservarán.
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccionar Nueva Garantía</label>
                    <select v-model="nuevaGarantiaId" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-verde-cope focus:ring-verde-cope sm:text-sm">
                        <option value="" disabled>Seleccione una opción</option>
                        <option v-for="g in garantiasDisponibles" :key="g.id" :value="g.id">
                            {{ g.nombre }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
                <button @click="close" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                    Cancelar
                </button>
                <button @click="save" :disabled="saving || !nuevaGarantiaId" class="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md transition flex items-center gap-2">
                    <svg v-if="saving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ saving ? 'Procesando...' : 'Cambiar Garantía' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    show: boolean
    expedienteId: any
    garantia: any
}>()

const emit = defineEmits(['close', 'refresh'])

const saving = ref(false)
const nuevaGarantiaId = ref('')
const garantiasDisponibles = ref<any[]>([])

const fetchGarantias = async () => {
    try {
        // Assuming we have an endpoint for this, or using a generic one.
        // If not, we might need to fetch from a generic 'garantias' list endpoint.
        // Let's assume '/garantias' exists and returns list.
        const res = await api.get('/garantias?all=true')
        // res.data is { success, data }
        if (res.data.success) {
            garantiasDisponibles.value = res.data.data.filter((g: any) => g.id !== props.garantia.id)
        }
    } catch (e) {
        console.error('Error fetching garantias', e)
    }
}

onMounted(() => {
    fetchGarantias()
})

const close = () => {
    emit('close')
}

const save = async () => {
    saving.value = true
    try {
        const res = await api.post(`/nuevos-expedientes/${props.expedienteId}/garantias/${props.garantia.id}/cambiar-tipo`, {
            nueva_garantia_id: nuevaGarantiaId.value
        })
        
        if (res.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Cambio Realizado',
                text: 'El tipo de garantía se ha cambiado correctamente.',
                timer: 1500,
                showConfirmButton: false
            })
            emit('refresh')
            emit('close')
        }
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'Error al cambiar garantía.', 'error')
    } finally {
        saving.value = false
    }
}
</script>
