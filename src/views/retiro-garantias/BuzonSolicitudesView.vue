<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Buzón de Solicitudes de Garantías</h1>

    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
           <button 
             @click="filterState = 1; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Pendientes
           </button>
           <button 
             @click="filterState = 2; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Enviados Temporales
           </button>
           <button 
             @click="filterState = 3; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Enviados Definitivos
           </button>
        </div>
        <button @click="loadRequests" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agencia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Justificación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500">No hay solicitudes en este estado.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(req.fecha_solicitud) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.solicitante?.name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ req.numero_documento }}
                <span v-if="req.es_manual" class="ml-1 text-xs text-yellow-600 bg-yellow-100 px-1 rounded">Manual</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" 
                  :class="req.tipo_retiro === 'Definitivo' ? 'text-red-600' : 'text-blue-600'">
                {{ req.tipo_retiro }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="req.justificacion">
                {{ req.justificacion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  v-if="req.estado_actual === 1"
                  @click="dispatchRequest(req)" 
                  class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Despachar
                </button>
                <span v-else class="text-gray-400">Despachado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// State
const requests = ref([]);
const loading = ref(false);
const filterState = ref(1); // Default: Pendientes

// Methods
const loadRequests = async () => {
  loading.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/archivo', {
      params: { estado: filterState.value }
    });
    requests.value = response.data.data;
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const dispatchRequest = async (req) => {
  const result = await Swal.fire({
    title: '¿Despachar Documento?',
    text: `Se enviará el documento ${req.numero_documento} a la agencia ${req.agencia?.nombre || ''} como ${req.tipo_retiro}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, Despachar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      // Determinar estado destino: Temporal -> 2, Definitivo -> 3
      const targetState = req.tipo_retiro === 'Definitivo' ? 3 : 2;

      await api.post(`/solicitudes-retiro/${req.id}/despachar`, {
        estado: targetState
      });

      Swal.fire('Éxito', 'Documento despachado correctamente', 'success');
      loadRequests();
    } catch (error) {
       console.error(error);
       Swal.fire('Error', 'Error al despachar el documento', 'error');
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  loadRequests();
});
</script>
