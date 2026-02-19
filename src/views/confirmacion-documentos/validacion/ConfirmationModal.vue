<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">
            {{ isRegistered ? 'Validación Física de Documento' : 'Registro de Documento (Migración)' }}
        </h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Request Details Summary -->
      <div class="bg-gray-50 p-3 rounded mb-4 border text-sm">
          <div class="grid grid-cols-2 gap-2">
              <div class="col-span-2 border-b pb-2 mb-2">
                  <div class="flex justify-between items-center">
                     <span><strong>Solicitud:</strong> {{ request.numero }}</span>
                     <span v-if="!isRegistered" class="text-xs bg-yellow-100 text-yellow-800 px-2 rounded-full font-bold">Manual / No Registrado</span>
                     <span v-else class="text-xs bg-green-100 text-green-800 px-2 rounded-full font-bold">Documento Registrado</span>
                  </div>
              </div>
              <div class="col-span-2"><strong>Observación Solicitud:</strong> <br><span class="italic text-gray-600">{{ request.observacion || '(Sin observación)' }}</span></div>
          </div>
      </div>

      <!-- STEP 1: REGISTRATION FORM (Only if NOT registered) -->
      <div v-if="!isRegistered" class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 animate-fade-in-down">
          <h5 class="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
              <i class="fas fa-file-import mr-1"></i> Confirmar Datos para Registro
          </h5>
          <p class="text-sm text-blue-700 mb-4">
              Este documento ingresó manualmente. Por favor, verifique y complete los datos para registrarlo en el sistema antes de validar su existencia física.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <!-- Read Only / Pre-filled -->
              <div>
                  <label class="block font-medium text-gray-700">No. Documento <span class="text-red-500">*</span></label>
                  <input type="text" v-model="form.numero" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100" readonly>
              </div>
              <div>
                  <label class="block font-medium text-gray-700">Fecha Doc <span class="text-red-500">*</span></label>
                  <input type="date" v-model="form.fecha" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <!-- Selects -->
              <div>
                  <label class="block font-medium text-gray-700">Tipo Documento <span class="text-red-500">*</span></label>
                  <select v-model="form.tipo_documento_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">-- Seleccionar --</option>
                      <option v-for="tipo in catalogos.tipos" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
                  </select>
                  <p class="text-xs text-blue-600 mt-1 font-semibold" v-if="request.tipo_documento">
                      <i class="fas fa-info-circle"></i> Manual: {{ request.tipo_documento }}
                  </p>
              </div>
              <div>
                  <label class="block font-medium text-gray-700">Registro Propiedad <span class="text-xs text-gray-400">(Opcional)</span></label>
                  <select v-model="form.registro_propiedad_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                       <option value="">-- Seleccionar --</option>
                       <option v-for="reg in catalogos.registros" :key="reg.id" :value="reg.id">{{ reg.nombre }}</option>
                  </select>
                   <p class="text-xs text-blue-600 mt-1 font-semibold" v-if="request.registro_propiedad">
                       <i class="fas fa-info-circle"></i> Manual: {{ request.registro_propiedad }}
                   </p>
              </div>

              <!-- Optional Fields -->
               <div>
                  <label class="block font-medium text-gray-700">Monto Póliza</label>
                  <input type="text" v-model="form.monto_poliza" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
               <div>
                  <label class="block font-medium text-gray-700">Referencia</label>
                  <input type="text" v-model="form.referencia" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
               <div class="col-span-2">
                  <label class="block font-medium text-gray-700">Propietario</label>
                  <input type="text" v-model="form.propietario" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
               <div class="col-span-2">
                  <label class="block font-medium text-gray-700">Autorizador</label>
                  <input type="text" v-model="form.autorizador" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <!-- Registry Details -->
               <div class="col-span-2 grid grid-cols-4 gap-2">
                    <div>
                        <label class="block font-medium text-gray-700 text-xs">Finca</label>
                        <input type="text" v-model="form.no_finca" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700 text-xs">Folio</label>
                        <input type="text" v-model="form.folio" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700 text-xs">Libro</label>
                        <input type="text" v-model="form.libro" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block font-medium text-gray-700 text-xs">Dominio</label>
                        <input type="text" v-model="form.no_dominio" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                    </div>
               </div>

               <div class="col-span-2">
                  <label class="block font-medium text-gray-700">Observación del Documento</label>
                  <textarea v-model="form.observacion" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="2"></textarea>
              </div>
          </div>

          <div class="mt-4 flex justify-end">
              <button 
                @click="registerDocument" 
                :disabled="registering"
                class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
              >
               <i v-if="registering" class="fas fa-spinner fa-spin mr-1"></i>
               Registrar Documento
              </button>
          </div>
      </div>

       <!-- STEP 2: PHYSICAL VALIDATION (Only if Registered) -->
      <div v-else class="mb-6 animate-fade-in-down">
          <h4 class="font-bold text-gray-800 mb-2 text-center text-lg">¿Existe el documento físico en archivo?</h4>
          
          <div class="flex justify-center gap-4 mb-4">
              <label class="cursor-pointer border p-3 rounded-lg hover:bg-green-50 has-[:checked]:bg-green-100 has-[:checked]:border-green-500 transition-all w-32 text-center shadow-sm">
                  <input type="radio" v-model="exists" :value="true" class="hidden">
                  <div class="text-2xl mb-1 text-green-600"><i class="fas fa-check-circle"></i></div>
                  <span class="font-bold text-green-700 block">SÍ EXISTE</span>
              </label>
              
              <label class="cursor-pointer border p-3 rounded-lg hover:bg-red-50 has-[:checked]:bg-red-100 has-[:checked]:border-red-500 transition-all w-32 text-center shadow-sm">
                  <input type="radio" v-model="exists" :value="false" class="hidden">
                  <div class="text-2xl mb-1 text-red-600"><i class="fas fa-times-circle"></i></div>
                  <span class="font-bold text-red-700 block">NO EXISTE</span>
                  <span class="text-xs text-red-500 block">(Físicamente)</span>
              </label>
          </div>
          
           <!-- Validation Comments -->
          <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Observación de Confirmación</label>
              <textarea v-model="validationObservation" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="2" placeholder="Detalles de la validación física..."></textarea>
          </div>

           <!-- Action Buttons -->
          <div class="flex justify-end gap-3 border-t pt-4">
            <button @click="close" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Cancelar
            </button>
            <button 
              @click="confirmValidation" 
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
            >
              <i class="fas fa-save mr-1"></i> Guardar Validación
            </button>
          </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const props = defineProps({
  show: Boolean,
  request: Object
});

const emit = defineEmits(['close', 'saved', 'document-registered']);

const exists = ref(null); // null, true, false
const isRegistered = ref(false);
const validationObservation = ref('');
const registering = ref(false);

const catalogos = ref({
    tipos: [],
    registros: []
});

const form = ref({
    numero: '',
    fecha: '',
    tipo_documento_id: '',
    registro_propiedad_id: '',
    monto_poliza: '',
    referencia: '',
    propietario: '',
    autorizador: '',
    no_finca: '',
    folio: '',
    libro: '',
    no_dominio: '',
    observacion: ''
});

// Load catalogs
const loadCatalogs = async () => {
    try {
        const [tiposRes, registrosRes] = await Promise.all([
            api.get('/tipo-documentos'),
            api.get('/registros-propiedad')
        ]);
        catalogos.value.tipos = tiposRes.data;
        catalogos.value.registros = registrosRes.data;
    } catch (e) {
        console.error("Error loading catalogs", e);
    }
};

// Initialize form when request changes
watch(() => props.request, (newVal) => {
    if (newVal) {
        // If it has a document_id, it is already registered (Existing or Migrated)
        isRegistered.value = !!newVal.documento_id;

        exists.value = null;
        validationObservation.value = '';
        form.value = {
            numero: newVal.numero,
            fecha: newVal.fecha, // Assuming YYYY-MM-DD
            tipo_documento_id: '', // User needs to select correct one
            registro_propiedad_id: '', // User needs to select correct one
            monto_poliza: newVal.monto_poliza || '',
            referencia: newVal.referencia || '',
            propietario: newVal.propietario || '',
            autorizador: newVal.autorizador || '',
            no_finca: newVal.no_finca || '',
            folio: newVal.folio || '',
            libro: newVal.libro || '',
            no_dominio: newVal.no_dominio || '',
            observacion: ''
        };
    }
}, { immediate: true });

onMounted(() => {
    loadCatalogs();
});

const close = () => {
    emit('close');
};

const registerDocument = async () => {
    if (!form.value.numero || !form.value.fecha || !form.value.tipo_documento_id) {
        Swal.fire('Atención', 'Complete los campos obligatorios (*) para registrar el documento.', 'warning');
        return;
    }

    registering.value = true;
    try {
        await api.post(`/confirmacion-documentos/${props.request.id}/register-document`, form.value);
        Swal.fire('Éxito', 'Documento registrado y vinculado correctamente.', 'success');
        
        // After registration, we consider it exists.
        exists.value = true; 
        emit('document-registered'); 
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.response?.data?.message || 'Error al registrar documento.', 'error');
    } finally {
        registering.value = false;
    }
};

const confirmValidation = () => {
    if (exists.value !== true) {
         Swal.fire('Atención', 'Debe indicar que el documento SÍ EXISTE para validar.', 'warning');
         return;
    }

    const data = {
        confirmacion: 'SI',
        observacion_confirmacion: validationObservation.value
    };

    emit('saved', { id: props.request.id, data });
};
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
