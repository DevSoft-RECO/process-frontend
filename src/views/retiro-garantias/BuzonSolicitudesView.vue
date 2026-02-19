<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800">Buzón de Solicitudes de Garantías</h1>

    <div class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
           <button 
             @click="filterState = 1; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Pendientes
           </button>
           <button 
             @click="filterState = 2; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Enviados Temporales
           </button>
           <button 
             @click="filterState = 3; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Enviados Definitivos
           </button>
        </div>
        <button @click="loadRequests" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agencia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Justificación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-4 text-center text-gray-500">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
              <td colspan="9" class="px-6 py-4 text-center text-gray-500">No hay solicitudes en este estado.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(req.fecha_solicitud) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <!-- Origen Logic -->
                  <span v-if="req.id_expediente" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Sistema
                  </span>
                  <span v-else-if="req.es_manual" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Manual
                  </span>
                  <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Histórico
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.solicitante?.name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ req.numero_documento }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.titulo_nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" 
                  :class="req.tipo_retiro === 'Definitivo' ? 'text-red-600' : 'text-blue-600'">
                {{ req.tipo_retiro }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="req.justificacion">
                {{ req.justificacion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="openDetailModal(req)"
                  class="mr-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <i class="fas fa-eye"></i> Ver
                </button>
                <button 
                  v-if="req.estado_actual === 1"
                  @click="dispatchRequest(req)" 
                  class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Despachar
                </button>
                <span v-else class="text-gray-400">Despachado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Detalles de la Garantía</h3>
          <button @click="closeDetailModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedDocument" class="space-y-4">
           <!-- CASO HISTÓRICO -->
           <div v-if="selectedDocument._isHistoric" class="bg-purple-50 p-4 rounded border border-purple-200">
               <div class="flex items-center space-x-2 mb-2">
                   <span class="px-2 py-0.5 rounded bg-purple-200 text-purple-800 text-xs font-bold">Histórico</span>
                   <h4 class="font-bold text-gray-800">Detalles Recuperados</h4>
               </div>
               
               <div class="mb-3">
                   <p class="text-xs font-bold text-gray-500 uppercase">Datos de Garantía</p>
                   <p class="text-sm text-gray-800 whitespace-pre-line">{{ selectedDocument.datos_garantia || 'Sin datos registrados.' }}</p>
               </div>

               <div>
                   <p class="text-xs font-bold text-gray-500 uppercase">Observaciones Originales</p>
                   <p class="text-sm text-gray-800">{{ selectedDocument.observacion || 'Sin observaciones.' }}</p>
               </div>
           </div>

           <!-- CASO SISTEMA (Nuevo Expediente) -->
           <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 p-3 rounded">
                <span class="block font-bold text-gray-600">Número de Documento</span>
                <span class="text-gray-900">{{ selectedDocument.numero }}</span>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Título / Nombre</span>
                 <span class="text-gray-900">{{ currentRequest?.titulo_nombre }}</span>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Propietario</span>
                 <span class="text-gray-900">{{ selectedDocument.propietario }}</span>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Autorizador</span>
                 <span class="text-gray-900">{{ selectedDocument.autorizador }}</span>
              </div>
               <div class="bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Monto Póliza</span>
                 <span class="text-gray-900">{{ selectedDocument.monto_poliza }}</span>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Tipo Documento</span>
                 <span class="text-gray-900">{{ selectedDocument.tipo_documento?.nombre || 'N/A' }}</span>
              </div>
               <div class="col-span-2 bg-gray-50 p-3 rounded flex space-x-4">
                 <div><span class="font-bold text-gray-600">Finca:</span> {{ selectedDocument.no_finca }}</div>
                 <div><span class="font-bold text-gray-600">Folio:</span> {{ selectedDocument.folio }}</div>
                 <div><span class="font-bold text-gray-600">Libro:</span> {{ selectedDocument.libro }}</div>
              </div>
              <div class="col-span-2 bg-gray-50 p-3 rounded">
                 <span class="block font-bold text-gray-600">Registro de Propiedad</span>
                 <span class="text-gray-900">{{ selectedDocument.registro_propiedad?.nombre || 'N/A' }}</span>
              </div>
           </div>
           
           <div class="text-xs text-gray-500 mt-2">
             * Información recuperada del sistema basada en el número de documento.
           </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
           <i class="fas fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
           <p>No se encontró información detallada para este documento en el sistema.</p>
           <p class="text-xs">Es posible que sea un registro manual o antiguo.</p>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeDetailModal" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// State
const requests = ref([]);
const loading = ref(false);
const filterState = ref(1); // Default: Pendientes
const showDetailModal = ref(false);
const selectedDocument = ref(null);
const currentRequest = ref(null);
const agencies = ref([]);

// Methods
const loadAgencies = async () => {
    try {
        const response = await api.get('/agencias');
        agencies.value = response.data;
    } catch (error) {
        console.error('Error loading agencies', error);
    }
};
const loadRequests = async () => {
  loading.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/archivo', {
      params: { estado: filterState.value }
    });
    requests.value = response.data.data;
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const openDetailModal = async (req) => {
  currentRequest.value = req;
  selectedDocument.value = null; // Limpiar previo
  showDetailModal.value = true; // Mostrar modal

  await nextTick(); // Esperar renderizado del modal

  if (req.id_expediente && req.documento) {
      // SISTEMA: Asignar datos de documento real
      selectedDocument.value = { ...req.documento };
      selectedDocument.value._isHistoric = false;
  } else if (!req.id_expediente && req.expediente_historico) {
      // HISTÓRICO: Asignar datos planos
      selectedDocument.value = { 
          numero: req.numero_documento,
          datos_garantia: req.expediente_historico.datos_garantia,
          observacion: req.expediente_historico.observacion,
          _isHistoric: true
      };
  } else {
      // Fallback
      selectedDocument.value = null;
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedDocument.value = null;
  currentRequest.value = null;
};

const dispatchRequest = async (req) => {
  // Preparar opciones para SweetAlert
  const agencyOptions = {};
  agencies.value.forEach(a => {
      agencyOptions[a.id] = a.nombre;
  });

  const { value: selectedAgencyId } = await Swal.fire({
    title: 'Despachar Documento',
    text: `Se enviará el documento ${req.numero_documento} como ${req.tipo_retiro}. Seleccione la agencia de destino:`,
    input: 'select',
    inputOptions: agencyOptions,
    inputPlaceholder: 'Seleccione una agencia',
    showCancelButton: true,
    confirmButtonText: 'Despachar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe seleccionar una agencia de destino';
      }
    }
  });

  if (selectedAgencyId) {
    try {
      // Determinar estado destino: Temporal -> 2, Definitivo -> 3
      const targetState = req.tipo_retiro === 'Definitivo' ? 3 : 2;

      await api.post(`/solicitudes-retiro/${req.id}/despachar`, {
        estado: targetState,
        id_agencia_entrega: selectedAgencyId
      });

      Swal.fire('Éxito', 'Documento despachado correctamente', 'success');
      loadRequests();
    } catch (error) {
       console.error(error);
       Swal.fire('Error', 'Error al despachar el documento', 'error');
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  loadRequests();
  loadAgencies();
});
</script>
