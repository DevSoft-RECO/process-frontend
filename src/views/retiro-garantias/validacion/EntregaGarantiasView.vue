<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Entrega de Garantías a Asociados</h1>

    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Recepción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino (Entrega)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">Cargando garantías pendientes de entrega...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay garantías pendientes de entrega.</td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.updated_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{{ item.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.agencia_entrega?.nombre || item.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.solicitante?.name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.numero_documento }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <template v-if="canDeliver(item)">
                    <button 
                      @click="deliverToAssociate(item)"
                      class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded text-xs font-bold border border-blue-300 transition-colors"
                      title="Entregar a Asociado"
                    >
                      <i class="fas fa-hand-holding-usd mr-1"></i> Entregar a Asociado
                    </button>
                </template>
                <template v-else>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        En {{ item.agencia_entrega?.nombre }}
                    </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

       <!-- Pagination Controls -->
       <div v-if="lastPage > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                  <p class="text-sm text-gray-700">
                      Página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{ lastPage }}</span>
                  </p>
              </div>
              <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                          @click="loadItems(currentPage - 1)"
                          :disabled="currentPage === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                          <i class="fas fa-chevron-left"></i>
                      </button>
                      <button 
                          @click="loadItems(currentPage + 1)"
                          :disabled="currentPage === lastPage"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                          <i class="fas fa-chevron-right"></i>
                      </button>
                  </nav>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const items = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);

const currentAgencyId = computed(() => {
    return authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;
});

const canDeliver = (item) => {
    // Solo puede entregar si la agencia de entrega es la misma que la del usuario actual
    // Y el estado es 4 (Recibido/Aceptado) - implícito por la API
    return item.id_agencia_entrega == currentAgencyId.value;
};

const loadItems = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/pending-delivery', {
      params: { 
          id_agencia: currentAgencyId.value,
          page: page 
      }
    });

    items.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
    
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};


const deliverToAssociate = async (item) => {
    const { value: file } = await Swal.fire({
        title: 'Entregar a Asociado',
        text: `Suba la evidencia de entrega (PDF/Imagen) para el documento ${item.numero_documento}.`,
        input: 'file',
        inputAttributes: {
            'accept': 'application/pdf,image/*',
            'aria-label': 'Subir evidencia de entrega'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar Entrega',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        showLoaderOnConfirm: true,
        preConfirm: (file) => {
            if (!file) {
                Swal.showValidationMessage('Debe seleccionar un archivo de evidencia')
            }
            return file
        }
    });

    if (file) {
        const formData = new FormData();
        formData.append('evidencia', file);

        try {
            await api.post(`/solicitudes-retiro/${item.id}/deliver`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            Swal.fire('¡Entrega Exitosa!', 'La garantía ha sido marcada como entregada.', 'success');
            loadItems(currentPage.value); // Recargar lista
            
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'No se pudo registrar la entrega.', 'error');
        }
    }
};

onMounted(() => {
  if (currentAgencyId.value) {
      loadItems();
  }
});
</script>
