<template>
  <div v-if="show" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4 border-b pb-3">
        <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-file-signature text-blue-600 mr-2"></i> Registrar Garantía Histórica
        </h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700 transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-5 rounded shadow-sm">
          <p class="text-sm text-blue-800">
              Esta solicitud proviene del <strong>Histórico</strong> y no tiene un documento físico registrado en el sistema. 
              Por favor, registre los datos del documento físico que será despachado.
          </p>
      </div>

      <!-- Información Histórica de la Garantía -->
      <div v-if="histInfo" class="bg-yellow-50 border border-yellow-200 p-4 mb-5 rounded shadow-sm text-sm">
          <h4 class="font-bold text-yellow-800 mb-2">
              <i class="fas fa-info-circle mr-1"></i> Información Histórica de la Garantía solicitada
          </h4>
          <ul class="text-yellow-700 space-y-1 ml-5 list-disc">
              <li v-if="histInfo.datos_garantia">
                  <strong>Datos:</strong> {{ histInfo.datos_garantia }}
              </li>
              <li v-if="histInfo.observacion">
                  <strong>Observación original:</strong> {{ histInfo.observacion }}
              </li>
              <li v-if="!histInfo.datos_garantia && !histInfo.observacion">
                  Sin información histórica detallada.
              </li>
          </ul>
      </div>

      <form @submit.prevent="submitRegistration">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-5">
              <!-- Datos Principales -->
              <div>
                  <label class="block font-medium text-gray-700 mb-1">No. Documento<span class="text-red-500">*</span></label>
                  <input type="text" v-model="form.numero" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold" required placeholder="Ingrese el número del documento real">
                  <span class="text-xs text-gray-500 mt-1 block">Producto No. originalmente: <strong>{{ request?.numero_documento }}</strong></span>
              </div>
              
              <div>
                  <label class="block font-medium text-gray-700 mb-1">Fecha Docto. <span class="text-red-500">*</span></label>
                  <input type="date" v-model="form.fecha" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                  <label class="block font-medium text-gray-700 mb-1">Tipo Documento <span class="text-red-500">*</span></label>
                  <select v-model="form.tipo_documento_id" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="" disabled>-- Seleccione Tipo --</option>
                      <option v-for="tipo in catalogos.tipos" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
                  </select>
              </div>

              <div>
                  <label class="block font-medium text-gray-700 mb-1">Registro Propiedad</label>
                  <select v-model="form.registro_propiedad_id" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                       <option value="">-- Opcional --</option>
                       <option v-for="reg in catalogos.registros" :key="reg.id" :value="reg.id">{{ reg.nombre }}</option>
                  </select>
              </div>

              <!-- Detalles Adicionales -->
              <div class="col-span-2 md:col-span-1">
                  <label class="block font-medium text-gray-700 mb-1">Propietario / Cliente</label>
                  <input type="text" v-model="form.propietario" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div class="col-span-2 md:col-span-1">
                  <label class="block font-medium text-gray-700 mb-1">Autorizador</label>
                  <input type="text" v-model="form.autorizador" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <div>
                  <label class="block font-medium text-gray-700 mb-1">Monto Póliza</label>
                  <input type="number" step="0.01" v-model="form.monto_poliza" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="0.00">
              </div>
              
               <div>
                  <label class="block font-medium text-gray-700 mb-1">Referencia Libre</label>
                  <input type="text" v-model="form.referencia" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <!-- Ubicación Registral -->
              <div class="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h6 class="text-xs font-bold text-gray-700 uppercase mb-2">Datos Registrales (Finca, Folio, Libro)</h6>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                          <label class="block text-xs text-gray-600 mb-1">Finca</label>
                          <input type="text" v-model="form.no_finca" class="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1">
                      </div>
                      <div>
                          <label class="block text-xs text-gray-600 mb-1">Folio</label>
                          <input type="text" v-model="form.folio" class="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1">
                      </div>
                      <div>
                          <label class="block text-xs text-gray-600 mb-1">Libro</label>
                          <input type="text" v-model="form.libro" class="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1">
                      </div>
                      <div>
                          <label class="block text-xs text-gray-600 mb-1">Dominio</label>
                          <input type="text" v-model="form.no_dominio" class="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1">
                      </div>
                  </div>
              </div>

               <div class="col-span-2">
                  <label class="block font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea v-model="form.observacion" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="3" placeholder="Información adicional relevante..."></textarea>
              </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="button" @click="close" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
                Cancelar
              </button>
              <button type="submit" :disabled="loading" class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center">
                <i v-if="loading" class="fas fa-circle-notch fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                Registrar Documento
              </button>
          </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const props = defineProps({
  show: Boolean,
  request: Object
});

const histInfo = computed(() => {
    if (!props.request) return null;
    return props.request.expediente_historico || props.request.expedienteHistorico || null;
});

const emit = defineEmits(['close', 'registered']);

const loading = ref(false);
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
            api.get('/tipo-documentos?all=true'),
            api.get('/registros-propiedad')
        ]);
        
        catalogos.value.tipos = tiposRes.data.data || tiposRes.data;
        catalogos.value.registros = registrosRes.data.data || registrosRes.data;
    } catch (e) {
        console.error("Error loading catalogs", e);
    }
};

// Initialize form when request changes or modal opens
watch(() => props.show, (isVisible) => {
    if (isVisible && props.request) {
        // Reset form and leave number empty for manual input if not present
        form.value = {
            numero: props.request?.numero_documento || '',
            fecha: props.request?.fecha_documento 
                   ? new Date(props.request.fecha_documento).toISOString().split('T')[0] 
                   : '',
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
        };
    }
});

onMounted(() => {
    loadCatalogs();
});

const close = () => {
    emit('close');
};

const submitRegistration = async () => {
    if (!form.value.numero || !form.value.fecha || !form.value.tipo_documento_id) {
        Swal.fire('Atención', 'Por favor complete todos los campos obligatorios (*).', 'warning');
        return;
    }

    loading.value = true;
    try {
        const response = await api.post(`/solicitudes-retiro/${props.request.id}/register-document`, form.value);
        
        Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
            text: 'El documento físico ha sido registrado en el sistema. Ahora puede despacharlo.',
            timer: 2500,
            showConfirmButton: false
        });
        
        emit('registered', response.data.data);
    } catch (error) {
        console.error('Error registering document:', error);
        Swal.fire('Error', error.response?.data?.message || 'Hubo un problema al registrar el documento.', 'error');
    } finally {
        loading.value = false;
    }
};
</script>
