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

    <!-- Validation Modal replaced by SweetAlert -->
    <ConfirmationModal 
      :show="showModal" 
      :request="selectedRequest"
      @close="showModal = false"
      @saved="handleSaved"
      @document-registered="handleRegistered"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from './ConfirmationModal.vue';

const requests = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedRequest = ref(null);

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
    // Handle both YYYY-MM-DD and ISO string
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString(); 
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const openValidationModal = (req) => {
    selectedRequest.value = req;
    showModal.value = true;
};

const handleSaved = async ({ id, data }) => {
    try {
        await api.put(`/confirmacion-documentos/${id}`, data);
        Swal.fire('Éxito', 'Documento validado correctamente', 'success');
        showModal.value = false;
        loadRequests();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar la validación', 'error');
    }
};

const handleRegistered = () => {
    // Document registered successfully, now it exists.
    // Refresh list to update status icons
    loadRequests();
    // Modal stays open so user can confirm validation now (as EXISTING)
    Swal.fire({
        title: 'Registrado',
        text: 'El documento ha sido creado. Ahora puede proceder a Validar indicando que SÍ EXISTE.',
        icon: 'success',
        timer: 3000
    });
};

onMounted(() => {
    loadRequests();
});
</script>
