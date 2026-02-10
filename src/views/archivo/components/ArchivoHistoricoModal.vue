<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div class="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full">
                
                <!-- Header -->
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="sm:flex sm:items-start justify-between">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                Detalles de Expediente Histórico
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Información completa del expediente. Los campos habilitados pueden ser editados.
                                </p>
                            </div>
                        </div>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span class="sr-only">Cerrar</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Body -->
                <div class="px-4 py-5 sm:p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Read Only Fields -->
                        <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Código Cliente</label>
                            <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">{{ form.codigo_cliente }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Agencia</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ form.agencia }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Asociado</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ form.asociado }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">No. Documento / CIF</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ form.numero_documento }} / {{ form.cif || '-' }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Fecha Inicio</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ formatDate(form.fecha_inicio) }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Monto</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ formatCurrency(form.monto) }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Tipo Garantía</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ form.tipo_garantia }}</p>
                        </div>
                         <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Contrato</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ form.contrato }}</p>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Fecha Ingreso</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-200">{{ formatDate(form.ingreso) }}</p>
                        </div>
                        <div class="col-span-full">
                            <label class="block text-xs font-medium text-gray-400 uppercase">Datos Garantía</label>
                            <p class="mt-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded max-h-32 overflow-y-auto">
                                {{ form.datos_garantia || 'N/A' }}
                            </p>
                        </div>

                        <!-- Editable Fields Separator -->
                        <div class="col-span-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                            <h4 class="text-sm font-semibold text-azul-cope uppercase">Información Editable</h4>
                        </div>

                        <!-- Inscripcion Otros -->
                         <div class="col-span-1 md:col-span-2">
                             <label for="inscripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Inscripción Otros Contratos</label>
                             <input type="text" id="inscripcion" v-model="form.inscripcion_otros_contratos" 
                             class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-azul-cope focus:ring-azul-cope sm:text-sm">
                         </div>

                         <!-- Estado (Dropdown) -->
                         <div class="col-span-1">
                             <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                             <select id="estado" v-model="form.estado"
                                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-azul-cope focus:ring-azul-cope sm:text-sm"
                             >
                                 <option value="archivado">Archivado</option>
                                 <option value="garantia retirada">Garantía Retirada</option>
                                 <option value="garantia solicitada">Garantía Solicitada</option>
                                 <!-- Fallback option if current state is not in list -->
                                 <option v-if="!['archivado', 'garantia retirada', 'garantia solicitada'].includes(form.estado?.toLowerCase())" :value="form.estado">
                                    {{ form.estado }}
                                 </option>
                             </select>
                         </div>

                         <!-- Salida (Date) -->
                         <div class="col-span-1">
                             <label for="salida" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Salida</label>
                             <input type="date" id="salida" v-model="form.salida"
                                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-azul-cope focus:ring-azul-cope sm:text-sm"
                             >
                         </div>
                         
                         <!-- Inventario -->
                         <div class="col-span-1">
                             <label for="inventario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Inventario</label>
                             <input type="text" id="inventario" v-model="form.inventario"
                                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-azul-cope focus:ring-azul-cope sm:text-sm"
                             >
                         </div>

                         <!-- Observacion -->
                         <div class="col-span-full">
                             <label for="observacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Observación</label>
                             <textarea id="observacion" v-model="form.observacion" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-azul-cope focus:ring-azul-cope sm:text-sm"
                             ></textarea>
                         </div>

                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-600">
                    <button @click="saveChanges" type="button" 
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-azul-cope text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-cope sm:ml-3 sm:w-auto sm:text-sm"
                        :disabled="loading"
                    >
                        <span v-if="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                    <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-cope sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    isOpen: boolean
    expediente: any
}>()

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const form = ref<any>({})

watch(() => props.expediente, (newVal) => {
    if (newVal) {
        // Clone object to avoid mutating prop directly
        form.value = { ...newVal }
        // Format dates for input type="date"
        if (form.value.ingreso) form.value.ingreso = form.value.ingreso.split('T')[0]
        if (form.value.salida) form.value.salida = form.value.salida.split('T')[0]
    }
}, { immediate: true })

const closeModal = () => {
    emit('close')
}

const saveChanges = async () => {
    if (!form.value.codigo_cliente) return

    loading.value = true
    try {
        const payload = {
            inscripcion_otros_contratos: form.value.inscripcion_otros_contratos,
            estado: form.value.estado,
            ingreso: form.value.ingreso,
            salida: form.value.salida,
            inventario: form.value.inventario,
            observacion: form.value.observacion
        }

        const response = await api.put(`/expedientes/${form.value.codigo_cliente}`, payload)

        if (response.data.success) {
            Swal.fire('Éxito', 'Información actualizada correctamente.', 'success')
            emit('save')
            closeModal()
        }
    } catch (error: any) {
        console.error("Error updating expediente:", error)
        Swal.fire('Error', 'No se pudo actualizar el expediente.', 'error')
    } finally {
        loading.value = false
    }
}

const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ' 
    }).format(amount)
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    // For display text
    return new Date(dateStr).toLocaleDateString('es-GT')
}
</script>
