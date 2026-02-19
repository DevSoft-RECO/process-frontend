<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Buzón de Garantías Entregadas</h1>

    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Entrega</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregado Por</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar Entrega</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidencia</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">Cargando historial de entregas...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay garantías entregadas registradas.</td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.updated_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.solicitante?.name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.numero_documento }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ item.entregador?.name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.agencia_entrega?.nombre || item.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a 
                  v-if="item.evidencia_entrega_path"
                  :href="getFileUrl(item.evidencia_entrega_path)"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900 font-bold flex items-center"
                >
                  <i class="fas fa-file-pdf mr-1"></i> Ver Evidencia
                </a>
                <span v-else class="text-gray-400 italic">Sin evidencia</span>
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

const authStore = useAuthStore();
const items = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);

const currentAgencyId = computed(() => {
    return authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;
});

const loadItems = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/delivered', {
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

const getFileUrl = (path) => {
    if (!path) return '#';
    // Ajustar URL base si es necesario, asumiendo que backend sirve public/
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', ''); 
    return `${baseUrl}/${path}`;
};


onMounted(() => {
  if (currentAgencyId.value) {
      loadItems();
  }
});
</script>
