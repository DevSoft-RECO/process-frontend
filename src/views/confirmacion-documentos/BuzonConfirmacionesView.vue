<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Buzón de Confirmaciones</h1>
        <p class="text-sm text-gray-500">Administre las solicitudes de validación física de documentos</p>
      </div>
      <div>
        <button 
          @click="loadRequests" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo / Registro</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No hay solicitudes pendientes.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ req.numero }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(req.fecha) }}</div>
                <div v-if="req.documento_id" class="text-xs text-green-600 font-bold mt-1">
                    <i class="fas fa-check-circle"></i> Existente
                </div>
                <div v-else class="text-xs text-yellow-600 font-bold mt-1">
                    <i class="fas fa-edit"></i> Manual
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ req.tipo_documento || 'No especificado' }}</div>
                <div class="text-sm text-gray-500">{{ req.registro_propiedad || 'No especificado' }}</div>
              </td>
               <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate" :title="req.observacion">
                    {{ req.observacion || '-' }}
                </div>
                 <div class="mt-1 text-xs">
                    Finca: {{ req.no_finca || '-' }} | Folio: {{ req.folio || '-' }} | Libro: {{ req.libro || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(req.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openValidationModal(req)" 
                  class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                >
                  <i class="fas fa-clipboard-check mr-1"></i> Validar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Validation Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              Validar Documento: {{ selectedRequest?.numero }}
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Resultado de la Validación</label>
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input type="radio" v-model="validationForm.confirmacion" value="SI" class="form-radio text-green-600 h-5 w-5">
                            <span class="ml-2 font-medium text-gray-700">Confirmado (Existe)</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input type="radio" v-model="validationForm.confirmacion" value="NO" class="form-radio text-red-600 h-5 w-5">
                            <span class="ml-2 font-medium text-gray-700">Rechazado (No Existe/Erróneo)</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Observación</label>
                    <textarea 
                        v-model="validationForm.observacion_confirmacion" 
                        rows="3" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Detalles del hallazgo físico..."
                    ></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Respuesta Administrativa</label>
                    <textarea 
                        v-model="validationForm.respuesta" 
                        rows="2" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Instrucciones o respuesta..."
                    ></textarea>
                </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
                type="button" 
                @click="submitValidation"
                :disabled="modalLoading || !validationForm.confirmacion"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <i v-if="modalLoading" class="fas fa-spinner fa-spin mr-2"></i>
              Guardar Validación
            </button>
            <button 
                type="button" 
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const requests = ref([]);
const loading = ref(false);
const showModal = ref(false);
const modalLoading = ref(false);
const selectedRequest = ref(null);
const validationForm = ref({
    confirmacion: null,
    observacion_confirmacion: '',
    respuesta: ''
});

const loadRequests = async () => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos');
        requests.value = response.data.data;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar solicitudes', 'error');
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Handle YYYY-MM-DD which might have timezone issues if parsed as UTC
    // Manual split is safer for date-only strings to display as-is
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const openValidationModal = (req) => {
    selectedRequest.value = req;
    validationForm.value = {
        confirmacion: null,
        observacion_confirmacion: '',
        respuesta: ''
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedRequest.value = null;
};

const submitValidation = async () => {
    if (!selectedRequest.value) return;

    modalLoading.value = true;
    try {
        await api.put(`/confirmacion-documentos/${selectedRequest.value.id}`, validationForm.value);
        
        await Swal.fire('Éxito', 'Documento validado correctamente', 'success');
        closeModal();
        loadRequests();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar la validación', 'error');
    } finally {
        modalLoading.value = false;
    }
};

onMounted(() => {
    loadRequests();
});
</script>
