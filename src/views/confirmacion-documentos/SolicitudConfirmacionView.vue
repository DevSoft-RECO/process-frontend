<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Confirmación de Documentos</h1>

    <!-- Search Section -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-bold text-gray-700 mb-4">Buscar Documento</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700">Número de Documento</label>
          <input 
            v-model="searchForm.numero" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ingrese número"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha del Documento</label>
          <input 
            v-model="searchForm.fecha" 
            type="date" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>
        <div>
          <button 
            @click="searchDocument" 
            :disabled="loading || !searchForm.numero || !searchForm.fecha"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <span v-else><i class="fas fa-search mr-2"></i> Buscar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Form Section (Only visible after search attempts) -->
    <div v-if="hasSearched" class="bg-white p-6 rounded-lg shadow flex-1 overflow-auto">
      
      <div v-if="found" class="mb-4 bg-green-50 p-4 rounded border-l-4 border-green-500">
        <div class="flex items-center">
          <i class="fas fa-check-circle text-green-600 text-xl mr-3"></i>
          <div>
            <h3 class="font-bold text-green-800">Documento Encontrado</h3>
            <p class="text-sm text-green-700">El documento existe en el sistema. Por favor valide la información física contra estos datos.</p>
          </div>
        </div>
      </div>

      <div v-else class="mb-4 bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mr-3"></i>
          <div>
            <h3 class="font-bold text-yellow-800">Documento No Encontrado</h3>
            <p class="text-sm text-yellow-700">El documento no se encuentra registrado. Por favor ingrese los datos manualmente para su validación.</p>
          </div>
        </div>
      </div>

      <h2 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Datos del Documento</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <!-- Read Only if Found, Editable if Not -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Número</label>
          <input v-model="form.numero" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha</label>
          <input v-model="form.fecha" type="date" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50">
        </div>
         <div>
          <label class="block text-sm font-medium text-gray-700">Monto Póliza</label>
          <input v-model="form.monto_poliza" type="number" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Propietario</label>
          <input v-model="form.propietario" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Autorizador</label>
          <input v-model="form.autorizador" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
         
         <!-- Location Data -->
        <div>
          <label class="block text-sm font-medium text-gray-700">No. Finca</label>
          <input v-model="form.no_finca" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Folio</label>
          <input v-model="form.folio" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Libro</label>
          <input v-model="form.libro" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">No. Dominio</label>
          <input v-model="form.no_dominio" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Referencia</label>
          <input v-model="form.referencia" type="text" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'">
        </div>
       
        <div>
            <label class="block text-sm font-medium text-gray-700">Tipo Documento</label>
            <input v-if="found" :value="form.tipo_documento" disabled type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50">
            <input v-else v-model="form.tipo_documento" type="text" placeholder="Ingrese tipo" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Registro Propiedad</label>
             <input v-if="found" :value="form.registro_propiedad" disabled type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50">
             <input v-else v-model="form.registro_propiedad" type="text" placeholder="Ingrese registro" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white">
        </div>
         <div class="col-span-full">
          <label class="block text-sm font-medium text-gray-700">Observación del Documento</label>
          <textarea v-model="form.observacion" rows="2" :disabled="found" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :class="found ? 'bg-gray-50' : 'bg-white'"></textarea>
        </div>
      </div>

      <!-- Validation Request Section -->
      <h2 class="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Solicitar Validación</h2>
      <div class="mb-4 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
        <div class="flex items-center">
          <i class="fas fa-info-circle text-blue-600 text-xl mr-3"></i>
          <div>
            <h3 class="font-bold text-blue-800">Instrucciones</h3>
            <p class="text-sm text-blue-700">Valide que la información mostrada arriba coincide con el documento físico. Si todo es correcto, o si ingresó los datos manualmente, haga clic en "Solicitar Confirmación" para que el área encargada proceda con la validación física final.</p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
          <button 
            @click="submitRequest" 
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-lg font-medium shadow-md"
          >
            <i class="fas fa-paper-plane mr-2"></i> Solicitar Confirmación
          </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const searchForm = ref({
    numero: '',
    fecha: ''
});

const form = ref({});
const found = ref(false);
const hasSearched = ref(false);
const loading = ref(false);

const searchDocument = async () => {
    loading.value = true;
    hasSearched.value = false;
    form.value = {}; // Reset form

    try {
        const response = await api.post('/confirmacion-documentos/search', searchForm.value);
        
        found.value = response.data.found;
        
        if (found.value) {
            // Populate form with found data (Read-only logic handled in template)
            form.value = { 
                ...response.data.data,
                // confirmacion, observacion_confirmacion, respuesta are removed for user request
            };
            // Map ID to documento_id for relationship
            form.value.documento_id = response.data.data.id;
        } else {
             // Populate form with search criteria to save manual entry
            form.value = {
                numero: searchForm.value.numero,
                fecha: searchForm.value.fecha,
                // confirmacion etc removed
            };
        }

        hasSearched.value = true;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al buscar documento', 'error');
    } finally {
        loading.value = false;
    }
};

const submitRequest = async () => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Solicitar Confirmación?',
        text: 'Se enviará una solicitud para validar este documento.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Enviar',
        cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
        loading.value = true;
        try {
            await api.post('/confirmacion-documentos', form.value);
            
            await Swal.fire('Éxito', 'Solicitud enviada correctamente.', 'success');
            
            // Reset Flow
            hasSearched.value = false;
            searchForm.value = { numero: '', fecha: '' };
            form.value = {};

        } catch (error) {
             console.error(error);
             Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
        } finally {
            loading.value = false;
        }
    }
};
</script>
