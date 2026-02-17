<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Solicitud de Retiro de Garantías</h1>

    <!-- Search Section -->
    <div class="bg-white p-4 rounded-lg shadow space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">Buscar Expediente / Documento</h2>
      <div class="flex space-x-2">
        <input 
          v-model="searchTerm" 
          @keyup.enter="searchDocument"
          type="text" 
          placeholder="Ingrese Número de Producto" 
          class="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
        <button 
          @click="searchDocument" 
          :disabled="loadingSearch"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="loadingSearch">Buscando...</span>
          <span v-else>Buscar</span>
        </button>
      </div>
    </div>

    <!-- Request Form Section -->
    <div v-if="showForm" class="bg-white p-6 rounded-lg shadow space-y-4 animate-fade-in-down">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-700">
          {{ isManual ? 'Nueva Solicitud (Carga Manual)' : 'Datos del Documento' }}
        </h2>
         <span v-if="isManual" class="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
           Documento no encontrado en sistema
         </span>
         <span v-else class="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
           Documento Validado
         </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Número de Documento</label>
          <input 
            v-model="formData.numero_documento" 
            type="text" 
            :readonly="!isManual"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            :class="{'bg-white': isManual}"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Título / Nombre Asociado</label>
          <input 
            v-model="formData.titulo_nombre" 
            type="text" 
            :readonly="!isManual"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
            :class="{'bg-white': isManual}"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Retiro</label>
          <select 
            v-model="formData.tipo_retiro" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
          >
            <option value="Temporal">Temporal</option>
            <option value="Definitivo">Definitivo</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Justificación</label>
        <textarea 
          v-model="formData.justificacion" 
          rows="3" 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none"
          placeholder="Motivo del retiro..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <button 
          @click="resetForm" 
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button 
          @click="submitRequest" 
          :disabled="loadingSubmit"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loadingSubmit">Enviando...</span>
          <span v-else>Enviar Solicitud</span>
        </button>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Historial de Solicitudes</h2>
        <button @click="loadHistory" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>
      
      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Despacho</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loadingHistory">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Cargando historial...</td>
            </tr>
            <tr v-else-if="history.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay solicitudes registradas.</td>
            </tr>
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.fecha_solicitud) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.numero_documento }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="item.tipo_retiro === 'Definitivo' ? 'text-red-600 font-bold' : 'text-blue-600'">
                  {{ item.tipo_retiro }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(item.estado_actual)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(item.estado_actual) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.fecha_envio ? formatDate(item.fecha_envio) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// State
const searchTerm = ref('');
const loadingSearch = ref(false);
const showForm = ref(false);
const isManual = ref(false);
const loadingSubmit = ref(false);
const history = ref([]);
const loadingHistory = ref(false);

const formData = reactive({
  id_expediente: null,
  numero_documento: '',
  titulo_nombre: '',
  tipo_retiro: 'Temporal',
  justificacion: '',
  es_manual: false
});

// Methods
const searchDocument = async () => {
  if (!searchTerm.value.trim()) {
    Swal.fire('Error', 'Ingrese un término de búsqueda', 'warning');
    return;
  }

  loadingSearch.value = true;
  showForm.value = false;
  resetFormData();

  try {
    const response = await api.post('/solicitudes-retiro/search', {
      termino: searchTerm.value
    });

    if (response.data.error) {
       // Bloqueado
       Swal.fire({
         icon: 'error',
         title: 'Operación Bloqueada',
         text: response.data.message,
         footer: 'Siempre verifique que el numero de producto ingresado sea el correcto.'
       });
       return;
    }

    if (response.data.found) {
      isManual.value = false;
      formData.numero_documento = response.data.data.numero_documento;
      formData.titulo_nombre = response.data.data.titulo_nombre;
      formData.id_expediente = response.data.data.id_expediente;
      formData.es_manual = false;
      showForm.value = true;
    } else {
      // Manual
      isManual.value = true;
      formData.numero_documento = response.data.data.numero_documento; // Preserva lo buscado
      formData.es_manual = true;
      showForm.value = true;
      Swal.fire({
        icon: 'info',
        title: 'Documento no encontrado',
        text: 'Se ha habilitado la carga manual de datos.',
        timer: 2000,
        showConfirmButton: false
      });
    }

  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Ocurrió un error al buscar el documento', 'error');
  } finally {
    loadingSearch.value = false;
  }
};

const submitRequest = async () => {
  if (!formData.justificacion) {
    Swal.fire('Atención', 'Debe ingresar una justificación', 'warning');
    return;
  }
  if (isManual.value && !formData.titulo_nombre) {
    Swal.fire('Atención', 'Debe ingresar el Título o Nombre Asociado', 'warning');
    return;
  }

  loadingSubmit.value = true;

  try {
    await api.post('/solicitudes-retiro', formData);
    
    Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
    resetForm();
    loadHistory();

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Error al enviar la solicitud';
    Swal.fire('Error', msg, 'error');
  } finally {
    loadingSubmit.value = false;
  }
};

const loadHistory = async () => {
  loadingHistory.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/agencia');
    history.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loadingHistory.value = false;
  }
};

const resetFormData = () => {
  formData.id_expediente = null;
  formData.numero_documento = '';
  formData.titulo_nombre = '';
  formData.tipo_retiro = 'Temporal';
  formData.justificacion = '';
  formData.es_manual = false;
};

const resetForm = () => {
  showForm.value = false;
  searchTerm.value = '';
  resetFormData();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const getStatusLabel = (status) => {
  switch (status) {
    case 0: return 'Archivado';
    case 1: return 'Solicitado';
    case 2: return 'Enviado Temporal';
    case 3: return 'Enviado Definitivo';
    default: return 'Desconocido';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 1: return 'bg-yellow-100 text-yellow-800';
    case 2: return 'bg-blue-100 text-blue-800';
    case 3: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
