<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Histórico de Confirmaciones</h1>
        <p class="text-sm text-gray-500">Bitácora de documentos validados por usted</p>
      </div>
      <div>
        <button 
          @click="loadHistory" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observación</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Validación</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Cargando histórico...</td>
          </tr>
          <tr v-else-if="history.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No hay documentos en el histórico.</td>
          </tr>
          <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ item.numero }}</div>
              <div class="text-xs text-gray-500">{{ item.tipo_documento }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="item.confirmacion === 'SI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ item.confirmacion === 'SI' ? 'CONFIRMADO' : 'RECHAZADO' }}
              </span>
            </td>
             <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate" :title="item.observacion_confirmacion">
                    {{ item.observacion_confirmacion || '-' }}
                </div>
              </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(item.fecha_confirmacion) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const history = ref([]);
const loading = ref(false);

const loadHistory = async () => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos/historico');
        history.value = response.data.data;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar histórico', 'error');
    } finally {
        loading.value = false;
    }
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
    loadHistory();
});
</script>
