<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Resultados de Confirmación</h1>
        <p class="text-sm text-gray-500">Respuestas a sus solicitudes de confirmación</p>
      </div>
      <div>
        <button 
          @click="loadResults" 
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de confirmacion</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datos Registrales</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">Cargando resultados...</td>
          </tr>
          <tr v-else-if="results.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No hay documentos validados.</td>
          </tr>
          <tr v-for="res in results" :key="res.id" class="hover:bg-gray-50">
            <!-- Col 0: ID -->
            <td class="px-6 py-4 whitespace-nowrap align-top text-sm font-bold text-gray-700">
              #{{ res.id }}
            </td>

            <!-- Col 1: Documento -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-sm font-bold text-gray-900">No. {{ res.numero }}</div>
              <div class="text-xs text-gray-500">Fecha: {{ formatDate(res.fecha) }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ res.tipo_documento }}</div>
              <div class="text-xs text-gray-400">{{ res.registro_propiedad }}</div>
            </td>

            <!-- Col 2: Identificacion -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-xs text-gray-900"><span class="font-semibold">Prop:</span> {{ res.propietario || '-' }}</div>
              <div class="text-xs text-gray-900"><span class="font-semibold">Aut:</span> {{ res.autorizador || '-' }}</div>
              <div class="text-xs text-gray-500 mt-1">Ref: {{ res.referencia || '-' }}</div>
              <div class="text-xs text-gray-500">Monto: {{ res.monto_poliza ? 'Q ' + res.monto_poliza : '-' }}</div>
            </td>

            <!-- Col 3: Datos Registrales -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-xs text-gray-600">
                <span class="font-semibold">F:</span> {{ res.no_finca || '-' }} &nbsp;|&nbsp; 
                <span class="font-semibold">F:</span> {{ res.folio || '-' }}
              </div>
              <div class="text-xs text-gray-600">
                <span class="font-semibold">L:</span> {{ res.libro || '-' }} &nbsp;|&nbsp; 
                <span class="font-semibold">D:</span> {{ res.no_dominio || '-' }}
              </div>
            </td>

            <!-- Col 4: Observaciones -->
            <td class="px-6 py-4 text-sm text-gray-500 align-top">
                <div class="mb-2">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Observacion Documento:</span>
                    <p class="text-xs text-gray-600 italic whitespace-normal max-w-xs">{{ res.observacion || '(Sin obs)' }}</p>
                </div>
                <div>
                    <span class="text-xs font-semibold text-gray-400 uppercase">Respuesta de Confirmacion:</span>
                    <p class="text-xs text-gray-800 font-medium whitespace-normal max-w-xs">
                        {{ res.observacion_confirmacion || (res.confirmacion ? '-' : 'En proceso...') }}
                    </p>
                </div>
            </td>

            <!-- Col 5: Resultado -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="flex flex-col items-start gap-1">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-green-100 text-green-800': res.confirmacion === 'SI',
                        'bg-red-100 text-red-800': res.confirmacion === 'NO',
                        'bg-yellow-100 text-yellow-800': !res.confirmacion
                    }"
                  >
                    {{ res.confirmacion === 'SI' ? 'EXISTE' : (res.confirmacion === 'NO' ? 'NO EXISTE' : 'PENDIENTE') }}
                  </span>
                  <span class="text-xs text-gray-400 mt-1">
                    {{ res.fecha_confirmacion ? formatDateTime(res.fecha_confirmacion) : '-' }}
                  </span>
              </div>
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

const results = ref([]);
const loading = ref(false);

const loadResults = async () => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos/resultados');
        results.value = response.data.data;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar resultados', 'error');
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
    loadResults();
});
</script>
