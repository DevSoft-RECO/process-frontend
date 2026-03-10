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
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo / Registro</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expediente</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No hay solicitudes pendientes.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-sm font-medium text-gray-900">{{ req.numero }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(req.fecha) }}</div>
                <div v-if="req.documento_id" class="text-xs text-green-600 font-bold mt-1">
                    <i class="fas fa-check-circle"></i> Existente
                </div>
                <div v-else class="text-xs text-yellow-600 font-bold mt-1">
                    <i class="fas fa-edit"></i> Manual
                </div>
              </td>
              <td class="px-6 py-4 align-top">
                <div class="text-sm text-gray-900">{{ req.tipo_documento || 'No especificado' }}</div>
                <div class="text-sm text-gray-500">{{ req.registro_propiedad || 'No especificado' }}</div>
              </td>
              <!-- Solicitante -->
              <td class="px-6 py-4 align-top">
                <div class="text-sm font-medium text-gray-900">{{ req.nombre_solicitante || req.user?.name || '-' }}</div>
                <div class="text-xs text-gray-400 mt-0.5">
                  <i class="fas fa-building mr-1"></i>Agencia: {{ req.id_agencia || '-' }}
                </div>
              </td>
              <!-- Expediente -->
              <td class="px-6 py-4 align-top">
                <div class="text-xs text-gray-700">
                  <span class="font-semibold text-gray-500">Cód. Cliente:</span>
                  <span class="ml-1 font-mono">{{ req.codigo_cliente || '-' }}</span>
                </div>
                <div class="text-xs text-gray-700 mt-0.5">
                  <span class="font-semibold text-gray-500">No. Producto:</span>
                  <span class="ml-1 font-mono">{{ req.numero_producto || '-' }}</span>
                </div>
              </td>
              <!-- Detalles -->
              <td class="px-6 py-4 text-sm text-gray-500 align-top">
                <div class="max-w-xs truncate" :title="req.observacion">
                    {{ req.observacion || '-' }}
                </div>
                <div class="mt-1 text-xs">
                    Finca: {{ req.no_finca || '-' }} | Folio: {{ req.folio || '-' }} | Libro: {{ req.libro || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                {{ formatDateTime(req.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openValidationModal(req)" 
                    class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                  >
                    <i class="fas fa-clipboard-check mr-1"></i> Validar
                  </button>
                  <button
                    v-if="isSuperAdmin"
                    @click="deleteRequest(req.id)"
                    class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                    title="Eliminar solicitud"
                  >
                    <i class="fas fa-trash mr-1"></i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ pagination.from ?? 0 }}</span> –
          <span class="font-medium">{{ pagination.to ?? 0 }}</span> de
          <span class="font-medium">{{ pagination.total ?? 0 }}</span> solicitudes
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.prev_page_url || loading"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded border text-sm transition',
              page === pagination.current_page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.next_page_url || loading"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Validation Modal -->
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
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import ConfirmationModal from './ConfirmationModal.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isSuperAdmin = computed(() => authStore.hasRole('Super Admin'));

const requests  = ref([]);
const loading   = ref(false);
const showModal = ref(false);
const selectedRequest = ref(null);

const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
  from: 0,
  to: 0,
  total: 0,
});

// Páginas visibles: máximo 5 alrededor de la actual
const visiblePages = computed(() => {
  const total   = pagination.value.last_page;
  const current = pagination.value.current_page;
  const delta   = 2;
  const range   = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i);
  }
  return range;
});

const loadRequests = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.get('/confirmacion-documentos', { params: { page } });
    const res = response.data;
    requests.value  = res.data;
    pagination.value = {
      current_page:   res.current_page,
      last_page:      res.last_page,
      prev_page_url:  res.prev_page_url,
      next_page_url:  res.next_page_url,
      from:           res.from,
      to:             res.to,
      total:          res.total,
    };
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Error al cargar solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return;
  loadRequests(page);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  if (dateString.length === 10) return new Date(dateString + 'T00:00:00').toLocaleDateString();
  const date = new Date(dateString);
  return isNaN(date) ? dateString : date.toLocaleDateString();
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    loadRequests(pagination.value.current_page);
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo guardar la validación', 'error');
  }
};

const handleRegistered = () => {
  loadRequests(pagination.value.current_page);
  Swal.fire({
    title: 'Registrado',
    text: 'El documento ha sido creado. Ahora puede proceder a Validar indicando que SÍ EXISTE.',
    icon: 'success',
    timer: 3000,
  });
};

const deleteRequest = async (id) => {
  const result = await Swal.fire({
    title: '¿Eliminar solicitud?',
    text: 'Esta acción no se puede deshacer. La solicitud será eliminada permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/confirmacion-documentos/${id}`);
    Swal.fire('Eliminada', 'La solicitud fue eliminada correctamente.', 'success');
    loadRequests(pagination.value.current_page);
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
  }
};

onMounted(() => loadRequests());
</script>
