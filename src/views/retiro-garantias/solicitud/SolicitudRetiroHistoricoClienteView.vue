<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Histórico de Solicitudes Realizadas</h1>
        <p class="text-gray-600 mt-1">Garantías que ya finalizaron su ciclo de préstamo (devueltas al archivo o entregadas definitivamente).</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Listado Histórico</h2>
        <button @click="loadHistory(1)" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>
      
      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título / Asociado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Retiro</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Final</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Finalización</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i> Cargando historial...
              </td>
            </tr>
            <tr v-else-if="history.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center py-6">
                  <i class="fas fa-archive text-gray-300 text-4xl mb-3"></i>
                  <p>No se encontraron solicitudes finalizadas o devueltas en el historial de esta categoría.</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.fecha_solicitud) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-bold">{{ item.numero_documento }}</div>
                <div class="text-xs text-gray-500 mt-1" v-if="item.fecha_documento">
                    <i class="far fa-calendar-alt"></i> {{ new Date(item.fecha_documento).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate" :title="item.titulo_nombre">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="item.tipo_retiro === 'Definitivo' ? 'text-red-600 font-bold bg-red-50 px-2 py-1 rounded' : 'text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded'">
                  {{ item.tipo_retiro }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  <i class="fas fa-check-circle mr-1 mt-0.5"></i> Archivado / Finalizado
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.updated_at ? formatDate(item.updated_at) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="lastPage > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 mt-auto">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                  <p class="text-sm text-gray-700">
                      Mostrando página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{ lastPage }}</span>
                      (<span class="font-medium">{{ totalItems }}</span> resultados totales)
                  </p>
              </div>
              <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                          @click="loadHistory(currentPage - 1)"
                          :disabled="currentPage === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span class="sr-only">Anterior</span>
                          <i class="fas fa-chevron-left"></i>
                      </button>
                      <button 
                          @click="loadHistory(currentPage + 1)"
                          :disabled="currentPage === lastPage"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span class="sr-only">Siguiente</span>
                          <i class="fas fa-chevron-right"></i>
                      </button>
                  </nav>
              </div>
          </div>
          <!-- Mobile Pagination -->
          <div class="flex items-center justify-between sm:hidden w-full">
              <button 
                 @click="loadHistory(currentPage - 1)"
                 :disabled="currentPage === 1"
                 class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
             >
                 Anterior
             </button>
             <span class="text-sm text-gray-700">
                 {{ currentPage }} / {{ lastPage }}
             </span>
             <button 
                 @click="loadHistory(currentPage + 1)"
                 :disabled="currentPage === lastPage"
                 class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
             >
                 Siguiente
             </button>
          </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// State
const history = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);

const loadHistory = async (page = 1) => {
  loading.value = true;
  try {
    const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;
    const response = await api.get('/solicitudes-retiro/agencia/historico', {
      params: { 
          id_agencia: agencyId,
          page: page 
      }
    });

    history.value = response.data.data || response.data;
    if (response.data.current_page) {
        currentPage.value = response.data.current_page;
        lastPage.value = response.data.last_page;
        totalItems.value = response.data.total;
    }
  } catch (error) {
    console.error('Error loading historical requests:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistory(1);
});

// Utilities
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};
</script>
