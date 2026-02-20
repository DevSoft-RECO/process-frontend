<template>
  <div class="bg-white p-6 rounded-lg shadow space-y-4 animate-fade-in-down">
     <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-700">
           Solicitud de Retiro (Histórico)
        </h2>
        <span class="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
           Expediente Histórico
        </span>
     </div>

     <!-- Detalle de Garantía Histórica -->
     <div class="bg-purple-50 p-4 rounded border border-purple-200">
         <h3 class="font-bold text-purple-800 mb-2">Información de Garantías</h3>
         <p class="text-sm text-gray-700 whitespace-pre-line">{{ documentData.datos_garantia || 'Sin detalles registrados.' }}</p>
     </div>

     <div class="alert bg-blue-50 text-blue-800 p-3 rounded text-sm mt-4 space-y-2">
         <p>
           <i class="fas fa-info-circle"></i> 
           Verifique si el documento que busca se encuentra en el campo "Información de Garantías". 
           Indique en la justificación cuál de ellos desea retirar.
         </p>
         <p class="font-semibold text-blue-900">
           Puede insertar manualmente el Número de Documento y la Fecha del Documento para agilizar la búsqueda posterior, aunque estos campos son opcionales pero puede ingresar la información para agilizar el proceso.
         </p>
     </div>

     <!-- Formulario -->
     <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Cambie el #Prdocuto por el #Doc </label>
          <input 
            v-model="formData.numero_documento" 
            type="text" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ej. ESC-12345"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha del Documento (Opcional)</label>
          <input 
            v-model="formData.fecha_documento" 
            type="date" 
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-purple-500 focus:border-purple-500"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Asociado (Título)</label>
          <input 
            v-model="formData.titulo_nombre" 
            type="text" 
            readonly
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
          >
        </div>
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
        <label class="block text-sm font-medium text-gray-700">Justificación / Observaciones</label>
        <textarea 
          v-model="formData.justificacion" 
          rows="3" 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none"
          placeholder="Indique qué garantía retira y el motivo..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <button 
          @click="$emit('cancel')" 
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button 
          @click="submitRequest" 
          :disabled="loadingSubmit"
          class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          <span v-if="loadingSubmit">Enviando...</span>
          <span v-else>Enviar Solicitud</span>
        </button>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    documentData: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['cancel', 'success']);
const authStore = useAuthStore();
const loadingSubmit = ref(false);

const formData = reactive({
  id_expediente: null,
  id_expediente_historico: null,
  numero_documento: '',
  fecha_documento: null,
  titulo_nombre: '',
  tipo_retiro: 'Temporal',
  justificacion: '',
  es_manual: false
});

onMounted(() => {
    formData.numero_documento = props.documentData.numero_documento;
    formData.fecha_documento = props.documentData.fecha_documento || props.documentData.fecha_solicitud || null;
    formData.titulo_nombre = props.documentData.titulo_nombre;
    formData.id_expediente_historico = props.documentData.id_expediente_historico || null;
    // Pre-fill justificacion with observations if useful, or leave empty
    // formData.justificacion = props.documentData.observaciones || ''; 
});

const submitRequest = async () => {
  if (!formData.justificacion) {
    Swal.fire('Atención', 'Debe ingresar una justificación', 'warning');
    return;
  }

  const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;

  if (!agencyId) {
      Swal.fire('Error', 'No se pudo identificar la agencia del usuario.', 'error');
      return;
  }

  const payload = {
      ...formData,
      id_agencia: agencyId
  };

  loadingSubmit.value = true;

  try {
    await api.post('/solicitudes-retiro', payload);
    Swal.fire('Éxito', 'Solicitud histórica enviada correctamente', 'success');
    emit('success');

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Error al enviar la solicitud';
    Swal.fire('Error', msg, 'error');
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
