<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Histórico General de Garantías</h1>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
       
       <!-- Tabs -->
       <div class="flex space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
           <button 
             @click="filterState = 5; loadHistory(1)" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm transition-colors border-b-2"
             :class="filterState === 5 ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
           >
             <i class="fas fa-history mr-2"></i> Histórico Temporal
           </button>
           <button 
             @click="filterState = 6; loadHistory(1)" 
             class="px-4 py-2 rounded-t-lg font-medium text-sm transition-colors border-b-2"
             :class="filterState === 6 ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
           >
             <i class="fas fa-archive mr-2"></i> Histórico Definitivo
           </button>
       </div>

       <!-- Search -->
       <div class="mb-4 flex justify-between items-center">
           <div class="relative rounded-md shadow-sm max-w-sm flex-1">
                <input 
                    v-model="searchTerm" 
                    @keyup.enter="loadHistory(1)"
                    type="text" 
                    class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 dark:bg-gray-700 dark:text-white" 
                    placeholder="Buscar por Expediente, Documento, Cód. Cliente o Producto"
                >
                <button 
                  @click="loadHistory(1)"
                  class="absolute inset-y-0 right-0 px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-sm"
                >
                  Buscar
                </button>
           </div>
           
           <button @click="loadHistory(1)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm ml-4">
               <i class="fas fa-sync"></i> Actualizar
           </button>
       </div>

      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Salida</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo Retiro</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Agencia Solicitante/Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código Cliente/Producto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evidencia de entrega</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado Final</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Estado Final</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Cargando histórico...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No se encontraron registros históricos.</td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div class="font-medium">{{ item.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(item.fecha_solicitud) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div class="font-medium">{{ item.numero_documento }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="item.fecha_documento">
                      <i class="far fa-calendar-alt"></i> {{ new Date(item.fecha_documento).toLocaleDateString() }}
                  </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" 
                  :class="item.tipo_retiro === 'Definitivo' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'">
                {{ item.tipo_retiro }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="text-gray-900 dark:text-gray-100 font-bold" title="Agencia Solicitante"><i class="fas fa-building text-gray-400 dark:text-gray-500 mr-1"></i> {{ item.agencia?.nombre || 'N/A' }}</div>
                  <div class="text-gray-500 dark:text-gray-400" title="Usuario Solicitante"><i class="fas fa-user-circle text-gray-400 dark:text-gray-500 mr-1"></i> {{ item.solicitante?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="text-gray-900 dark:text-gray-100 font-bold" title="Código Cliente"><i class="text-gray-400 dark:text-gray-500 mr-1"></i> {{ item.codigo_cliente || 'N/A' }}</div>
                  <div class="text-gray-500 dark:text-gray-400" title="Usuario Solicitante"><i class="text-gray-400 dark:text-gray-500 mr-1"></i> {{ item.numero_producto || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button 
                  v-if="item.evidencia_entrega_path"
                  @click="verEvidencia(item.id)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-bold flex items-center"
                >
                  <i class="fas fa-file-pdf mr-1"></i> Ver Evidencia
                </button>
                <span v-else class="text-gray-400 dark:text-gray-500 italic">Sin evidencia</span>
              </td>
              <!-- ESTADO FINAL -->
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                 <span v-if="item.estado_actual === 0" class="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                     <i class="fas fa-archive mr-1"></i> Reingresado Archivo
                 </span>
                 <span v-else-if="item.estado_actual === 5" class="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                     <i class="fas fa-check mr-1"></i> Entregado Asociado
                 </span>
                 <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                     <i class="fas fa-clock mr-1"></i> {{ getStatusLabel(item.estado_actual) }}
                 </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                   <div v-if="item.estado_actual === 0">
                       {{ formatDate(item.fecha_confirmacion_retorno) }}
                   </div>
                   <div v-else-if="item.estado_actual === 5">
                        {{ formatDate(item.updated_at) }}
                   </div>
                   <div v-else>
                       -
                   </div>
               </td>
            </tr>
          </tbody>
        </table>
      </div>

       <!-- Pagination -->
       <div v-if="lastPage > 1" class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                      Página <span class="font-medium dark:text-white">{{ currentPage }}</span> de <span class="font-medium dark:text-white">{{ lastPage }}</span>
                  </p>
              </div>
              <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button 
                          @click="loadHistory(currentPage - 1)"
                          :disabled="currentPage === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                          <i class="fas fa-chevron-left"></i>
                      </button>
                      <button 
                          @click="loadHistory(currentPage + 1)"
                          :disabled="currentPage === lastPage"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
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
import { ref, onMounted, watch } from 'vue';
import api from '@/api/axios';

const items = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const searchTerm = ref('');
const filterState = ref(5); // Default: 5=Histórico Temporal, 6=Histórico Definitivo

const loadHistory = async (page = 1) => {
  loading.value = true;
  try {
    const params = { 
        page,
        estado: filterState.value,
        search: searchTerm.value || null
    };
    
    // NOTA: Usamos el endpoint /solicitudes-retiro/archivo que ahora soporta estados 5 y 6
    const response = await api.get('/solicitudes-retiro/archivo', { params });
    items.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const verEvidencia = async (id) => {
    try {
        const response = await api.get(`/solicitudes-retiro/${id}/ver-evidencia`);
        if (response.data.success && response.data.url) {
            window.open(response.data.url, '_blank');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo generar la URL de la evidencia.', 'error');
    }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const getStatusLabel = (status) => {
  switch (Number(status)) {
    case 0: return 'Archivado';
    case 1: return 'Solicitado';
    case 2: return 'Enviado (Temporal)';
    case 3: return 'Enviado (Definitivo)';
    case 4: return 'Recibido en Agencia';
    case 5: return 'Entregado a Asociado';
    case 6: return 'En Retorno a Archivo';
    default: return `Desconocido (${status})`;
  }
};

onMounted(() => {
  loadHistory();
});
</script>
