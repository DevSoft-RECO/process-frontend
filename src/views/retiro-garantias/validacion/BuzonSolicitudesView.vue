<template>
  <div class="h-full flex flex-col space-y-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Buzón de Solicitudes de Garantías</h1>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
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
           <button 
             @click="filterState = 4; loadRequests()" 
             class="px-3 py-1 rounded"
             :class="filterState === 4 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'"
           >
             Por Reingresar
           </button>
          <!-- Filtro de agencias -->
          <div class="ml-4">
             <select 
               v-model="selectedAgencyFilter" 
               @change="filterState = 1; loadRequests(1)" 
               class="border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-200"
             >
               <option value="">Todas las Agencias</option>
               <option v-for="ag in agencies" :key="ag.id" :value="ag.id">
                 {{ ag.nombre }}
               </option>
             </select>
          </div>
        </div>
        <button @click="loadRequests(currentPage)" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>

      <div class="flex-1 overflow-auto mb-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Origen</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen / Destino</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Cliente / Producto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles Retiro</th>
              <th v-if="filterState === 4" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obs. Retorno</th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No hay solicitudes en este estado.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-gray-900 dark:text-gray-100 font-medium">{{ req.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="text-gray-900 dark:text-gray-100 font-medium">{{ formatDateTime(req.fecha_solicitud) }}</div>
                  <div class="mt-1">
                      <span v-if="req.id_expediente" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          Sistema
                      </span>
                      <span v-else-if="req.es_manual" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                          Manual
                      </span>
                      <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          Histórico
                      </span>
                  </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="text-gray-900 dark:text-gray-100 font-bold" title="Agencia Solicitante"><i class="fas fa-building text-gray-400 dark:text-gray-500 mr-1"></i> {{ req.agencia?.nombre || 'N/A' }}</div>
                  <div class="text-gray-500 dark:text-gray-400" title="Usuario Solicitante"><i class="fas fa-user-circle text-gray-400 dark:text-gray-500 mr-1"></i> {{ req.solicitante?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="text-gray-900 dark:text-gray-100 font-bold" title="Código Cliente"><i class="text-gray-400 dark:text-gray-500 mr-1"></i> {{ req.codigo_cliente || 'N/A' }}</div>
                  <div class="text-gray-500 dark:text-gray-400" title="Usuario Solicitante"><i class="text-gray-400 dark:text-gray-500 mr-1"></i> {{ req.numero_producto || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 text-sm">
                <!-- Priorizar datos del documento registrado físicamente -->
                <div class="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[200px]" :title="req.documento?.numero || req.numero_documento">
                    {{ req.documento?.numero || req.numero_documento }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="req.documento?.fecha || req.fecha_documento">
                    <i class="far fa-calendar-alt"></i> {{ formatDate(req.documento?.fecha || req.fecha_documento) }}
                </div>
                <div class="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[200px]" :title="req.documento?.propietario || req.titulo_nombre">
                    {{ req.documento?.propietario || req.titulo_nombre }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm max-w-xs">
                 <div class="flex justify-between items-start">
                    <div>
                        <div class="font-bold mb-1" :class="req.tipo_retiro === 'Definitivo' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'">
                           {{ req.tipo_retiro }}
                        </div>
                        <div class="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[150px]" :title="req.justificacion">
                           {{ req.justificacion }}
                        </div>
                    </div>
                    <button 
                      @click="showWithdrawalDetails(req)"
                      class="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Ver todos los detalles"
                    >
                      <i class="fas fa-info-circle text-lg"></i>
                    </button>
                 </div>
              </td>
              <td v-if="filterState === 4" class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" :title="req.observacion_retorno">
                {{ req.observacion_retorno || '-' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="openDetailModal(req)"
                  class="mr-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  <i class="fas fa-eye"></i> Ver
                </button>
                <template v-if="req.estado_actual === 1">
                    <button 
                      v-if="!isHistoricoSinDocumento(req)"
                      @click="dispatchRequest(req)" 
                      class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Despachar
                    </button>
                    <button 
                      v-else
                      @click="openRegistrationModal(req)" 
                      class="px-3 py-1 mb-1 rounded shadow-sm block text-xs"
                      :class="req.documento ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'"
                      :title="req.documento ? 'La fecha del documento asociado no coincide. Haga clic para corregir.' : 'Debe registrar el documento físico antes de despachar'"
                    >
                      <i class="fas" :class="req.documento ? 'fa-edit' : 'fa-file-signature'"></i> 
                      {{ req.documento ? 'Corregir Doc.' : 'Registrar Doc.' }}
                    </button>
                </template>
                <button 
                  v-if="req.estado_actual === 1 && authStore.hasRole('Super Admin')"
                  @click="deleteRequest(req)" 
                  class="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                  title="Eliminar Solicitud"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <div v-else class="flex flex-col space-y-1">
                     <span class="text-xs font-bold text-gray-500 dark:text-gray-400">
                         {{ getStatusLabel(req.estado_actual) }}
                     </span>
                    
                    <button 
                      v-if="req.estado_actual === 6"
                      @click="confirmReturn(req)" 
                      class="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs shadow-sm"
                      title="Confirmar recepción física en archivo"
                    >
                      <i class="fas fa-check-double"></i> Confirmar Reingreso
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="lastPage > 1 && !loading" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 mt-auto">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="loadRequests(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Anterior</button>
            <button @click="loadRequests(currentPage + 1)" :disabled="currentPage === lastPage" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Siguiente</button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando página <span class="font-medium dark:text-white">{{ currentPage }}</span> de <span class="font-medium dark:text-white">{{ lastPage }}</span> 
                (<span class="font-medium dark:text-white">{{ totalRecords }}</span> registros totales)
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button @click="loadRequests(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 bg-white dark:bg-gray-700">
                  <span class="sr-only">Anterior</span>
                  <i class="fas fa-chevron-left h-5 w-5 text-center leading-5"></i>
                </button>
                <div class="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800">{{ currentPage }}</div>
                <button @click="loadRequests(currentPage + 1)" :disabled="currentPage === lastPage" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 disabled:opacity-50 bg-white dark:bg-gray-700">
                  <span class="sr-only">Siguiente</span>
                  <i class="fas fa-chevron-right h-5 w-5 text-center leading-5"></i>
                </button>
              </nav>
            </div>
          </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl transform transition-all relative">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Detalles de la Garantía</h3>
          <button @click="closeDetailModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedDocument" class="space-y-4">
           <!-- CASO HISTÓRICO -->
           <div v-if="selectedDocument._isHistoric" class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded border border-purple-200 dark:border-purple-800/50">
               <div class="flex items-center space-x-2 mb-2">
                   <span class="px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs font-bold">Histórico</span>
                   <h4 class="font-bold text-gray-800 dark:text-gray-100">Detalles Recuperados</h4>
               </div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span class="block text-xs font-bold text-gray-500 uppercase">Nombre asociado Producto</span>
                    <span class="text-gray-900">{{ currentRequest?.titulo_nombre || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-gray-500 uppercase">Fecha del Documento</span>
                    <span class="text-gray-900">{{ formatDate(currentRequest.fecha_documento) }}</span>
                  </div>
               </div>
               
               <div class="mb-3">
                   <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Datos de Garantía</p>
                   <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{{ selectedDocument.datos_garantia || 'Sin datos registrados.' }}</p>
               </div>

               <div>
                   <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Observaciones Originales</p>
                   <p class="text-sm text-gray-800 dark:text-gray-200">{{ selectedDocument.observacion || 'Sin observaciones.' }}</p>
               </div>
           </div>

           <!-- CASO SISTEMA (Nuevo Expediente) -->
           <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <span class="block font-bold text-gray-600 dark:text-gray-400">Número de Documento</span>
                <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.numero }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Nombre asociado Producto</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ currentRequest?.titulo_nombre }}</span>
              </div>
               <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Fecha del Documento</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ currentRequest?.fecha_documento ? new Date(currentRequest.fecha_documento).toLocaleDateString() : 'N/A' }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Propietario</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.propietario }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Autorizador</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.autorizador }}</span>
              </div>
               <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Monto</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.monto_poliza }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Tipo Documento</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.tipo_documento?.nombre || 'N/A' }}</span>
              </div>
               <div class="col-span-2 bg-gray-50 dark:bg-gray-700 p-3 rounded flex flex-wrap gap-4">
                 <div class="flex-1 min-w-[120px]"><span class="block font-bold text-gray-600 dark:text-gray-400 text-xs uppercase mb-1">Finca</span> <span class="dark:text-gray-100">{{ selectedDocument.no_finca || '-' }}</span></div>
                 <div class="flex-1 min-w-[120px]"><span class="block font-bold text-gray-600 dark:text-gray-400 text-xs uppercase mb-1">Folio</span> <span class="dark:text-gray-100">{{ selectedDocument.folio || '-' }}</span></div>
                 <div class="flex-1 min-w-[120px]"><span class="block font-bold text-gray-600 dark:text-gray-400 text-xs uppercase mb-1">Libro</span> <span class="dark:text-gray-100">{{ selectedDocument.libro || '-' }}</span></div>
                 <div class="flex-1 min-w-[120px]"><span class="block font-bold text-gray-600 dark:text-gray-400 text-xs uppercase mb-1">No. Dominio</span> <span class="dark:text-gray-100">{{ selectedDocument.no_dominio || '-' }}</span></div>
              </div>
              <div class="col-span-2 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <span class="block font-bold text-gray-600 dark:text-gray-400">Registro de Propiedad</span>
                 <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.registro_propiedad?.nombre || 'N/A' }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span class="block font-bold text-gray-600 dark:text-gray-400">Referencia</span>
                  <span class="text-gray-900 dark:text-gray-100">{{ selectedDocument.referencia || '-' }}</span>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <span class="block font-bold text-gray-600 dark:text-gray-400">Observación Doc.</span>
                  <span class="text-gray-900 dark:text-gray-100 text-xs">{{ selectedDocument.observacion || '-' }}</span>
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

    <!-- Registration Modal for Historical Documents -->
    <RegistroDocumentoModal 
      :show="showRegistrationModal" 
      :request="selectedRequestForRegistration" 
      @close="showRegistrationModal = false"
      @registered="handleDocumentRegistered"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';
import RegistroDocumentoModal from './RegistroDocumentoModal.vue';

const authStore = useAuthStore();

// State
const requests = ref([]);
const loading = ref(false);
const filterState = ref(1); // Default: Pendientes
const selectedAgencyFilter = ref(''); // Default: Todas (Vacío)
const currentPage = ref(1);
const lastPage = ref(1);
const totalRecords = ref(0);

const showDetailModal = ref(false);
const selectedDocument = ref(null);
const currentRequest = ref(null);
const agencies = ref([]);

// Modals state for registration
const showRegistrationModal = ref(false);
const selectedRequestForRegistration = ref(null);

// Computeds/Helpers
const isHistoricoSinDocumento = (req) => {
    // Es histórico si no tiene id_expediente (expediente del sistema).
    if (req.id_expediente) return false;

    // Si no trae documento asociado, requiere registro.
    if (!req.documento) return true;

    // MEJORA: Si tiene documento pero la FECHA no coincide con la solicitada (fecha_documento),
    // permitimos que se registre manualmente el documento correcto para subsanar errores de asociación previa.
    if (req.fecha_documento && req.documento.fecha) {
        const reqDate = new Date(req.fecha_documento).toISOString().split('T')[0];
        const docDate = new Date(req.documento.fecha).toISOString().split('T')[0];
        return reqDate !== docDate;
    }

    return false;
};

// Methods
const loadAgencies = async () => {
    try {
        const response = await api.get('/agencias');
        agencies.value = response.data;
    } catch (error) {
        console.error('Error loading agencies', error);
    }
};

const loadRequests = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.get('/solicitudes-retiro/archivo', {
      params: { 
          estado: filterState.value,
          id_agencia: selectedAgencyFilter.value || null,
          page: page
      }
    });
    
    // Asignación de Paginación Laravel
    requests.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
    totalRecords.value = response.data.total;

  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const deleteRequest = async (req) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará la solicitud permanentemente. No se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/solicitudes-retiro/${req.id}`);
      Swal.fire('Eliminado!', 'La solicitud ha sido eliminada.', 'success');
      loadRequests(currentPage.value);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
    }
  }
};

const openDetailModal = async (req) => {
  currentRequest.value = req;
  selectedDocument.value = null; // Limpiar previo
  showDetailModal.value = true; // Mostrar modal

  await nextTick(); // Esperar renderizado del modal

  // IMPORTANTE: Si YA existe documento registrado (req.documento) mostramos la vista con el detalle físico,
  // independientemente de si el origen fue Sistema, Manual o Histórico.
  const hist = req.expediente_historico || req.expedienteHistorico;

  if (req.documento) {
      // SISTEMA O REGISTRADO: Asignar datos de documento real
      selectedDocument.value = { ...req.documento };
      selectedDocument.value._isHistoric = false;
  } else if (!req.id_expediente && hist) {
      // HISTÓRICO SIN REGISTRAR: Asignar datos planos
      selectedDocument.value = { 
          numero: req.numero_documento,
          datos_garantia: hist.datos_garantia || hist.asociado || 'Sin datos detallados.',
          observacion: hist.observacion || req.justificacion,
          _isHistoric: true
      };
  } else if (!req.id_expediente) {
      // HISTÓRICO MANUAL O SIN EXPEDIENTE_HISTORICO
      selectedDocument.value = { 
          numero: req.numero_documento,
          datos_garantia: 'Información insertada manualmente. No hay datos históricos en la base de datos.',
          observacion: req.justificacion,
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

const showWithdrawalDetails = (req) => {
    let htmlContent = `
        <div class="text-left space-y-4 pt-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Justificación de la Solicitud</h4>
                <p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">${req.justificacion || 'Sin justificación.'}</p>
            </div>
    `;

    if (req.observacion_despacho) {
        htmlContent += `
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                <h4 class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Observación de Despacho</h4>
                <p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">${req.observacion_despacho}</p>
            </div>
        `;
    }

    if (req.observacion_retorno) {
        htmlContent += `
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                <h4 class="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Observación de Retorno</h4>
                <p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">${req.observacion_retorno}</p>
            </div>
        `;
    }

    htmlContent += `</div>`;

    Swal.fire({
        title: `<div class="flex items-center space-x-2 text-xl font-bold">
                    <i class="fas fa-file-alt text-blue-500"></i>
                    <span>Detalles del Retiro #${req.id}</span>
                </div>`,
        html: htmlContent,
        width: '600px',
        showCloseButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3B82F6',
        customClass: {
            popup: 'rounded-xl shadow-2xl', // Background handled by global CSS
            title: 'text-left pb-2 border-b dark:border-gray-700',
            confirmButton: 'rounded-lg px-6 py-2'
        }
    });
};

// --- Registration Logic ---
const openRegistrationModal = (req) => {
    selectedRequestForRegistration.value = req;
    showRegistrationModal.value = true;
};

const handleDocumentRegistered = () => {
    showRegistrationModal.value = false;
    selectedRequestForRegistration.value = null;
    loadRequests(currentPage.value); // Recargar para obtener el documento asociado
};
// -------------------------

const dispatchRequest = async (req) => {
  const requestingAgencyName = req.agencia?.nombre || 'la agencia solicitante';
  const requestingAgencyId = req.id_agencia;

  let observacionInput = '';

  // 1. Mostrar confirmación inicial (Camino rápido vs manual)
  const result = await Swal.fire({
    title: 'Despachar Documento',
    html: `
      <div class="mb-2">¿Generar envío para <strong>${requestingAgencyName}</strong>?</div>
      <div class="text-sm text-gray-500 mb-4">Documento: ${req.numero_documento} (${req.tipo_retiro})</div>
      <div class="text-left">
        <label for="swal-obs-1" class="block text-sm font-medium text-gray-700">Observación de Despacho (Opcional):</label>
        <textarea id="swal-obs-1" class="border border-gray-300 rounded-md shadow-sm p-2 w-full mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" style="resize: none;" rows="2" placeholder="Agregue un detalle..."></textarea>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Sí, Despachar',
    denyButtonText: 'Enviar a OTRA agencia',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#059669', // Green-600
    denyButtonColor: '#3B82F6',    // Blue-500
    cancelButtonColor: '#6B7280',
    didOpen: () => {
        const input = document.getElementById('swal-obs-1');
        if (input) {
            input.addEventListener('input', (e) => {
                observacionInput = e.target.value;
            });
        }
    }
  });

  let selectedAgencyId = null;

  if (result.isConfirmed) {
    // Caso estándar: Agencia solicitante
    selectedAgencyId = requestingAgencyId;
  } else if (result.isDenied) {
    // Caso manual: Selector de agencias
    const agencyOptions = agencies.value.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');

    const manualResult = await Swal.fire({
      title: 'Seleccionar Agencia de Destino',
      html: `
        <select id="swal-agency-select" class="swal2-select w-full" style="display:flex; margin: 1rem 0;">
            <option value="" disabled selected>Seleccione una agencia...</option>
            ${agencyOptions}
        </select>
        <div class="text-left mt-4">
            <label for="swal-obs-2" class="block text-sm font-medium text-gray-700">Observación de Despacho (Opcional):</label>
            <textarea id="swal-obs-2" class="border border-gray-300 rounded-md shadow-sm p-2 w-full mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" style="resize: none;" rows="2" placeholder="Agregue un detalle...">${observacionInput}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Envío',
      cancelButtonText: 'Volver',
      preConfirm: () => {
          const agency = document.getElementById('swal-agency-select').value;
          const obs = document.getElementById('swal-obs-2').value;
          if (!agency) {
              Swal.showValidationMessage('Debe seleccionar una agencia de destino');
              return false;
          }
          return { agency, obs };
      }
    });
    
    if (manualResult.isConfirmed) {
        selectedAgencyId = manualResult.value.agency;
        observacionInput = manualResult.value.obs;
    }
  }

  // 2. Ejecutar despacho si hay una agencia seleccionada o confirmada
  if (selectedAgencyId) {
    try {
      // Determinar estado destino: Temporal -> 2, Definitivo -> 3
      const targetState = req.tipo_retiro === 'Definitivo' ? 3 : 2;

      await api.post(`/solicitudes-retiro/${req.id}/despachar`, {
        estado: targetState,
        id_agencia_entrega: selectedAgencyId,
        observacion_despacho: observacionInput
      });

      Swal.fire('Éxito', 'Documento despachado correctamente', 'success');
      loadRequests(currentPage.value);
    } catch (error) {
       console.error(error);
       Swal.fire('Error', 'No se pudo completar el despacho del documento', 'error');
    }
  }
};

const returnToArchive = async (req) => {
    // Intentar obtener la fecha del documento si está disponible, sino usar la de la solicitud, o 'N/A'
    const docDate = formatDate(req.documento?.fecha || req.fecha_solicitud);

    const result = await Swal.fire({
        title: '¿Reingresar al Archivo?',
        html: `Está a punto de marcar el documento <strong>${req.numero_documento}</strong> de fecha <strong>${docDate}</strong> como reingresado al archivo.<br><br>Esto confirma que ha regresado físicamente.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, Reingresar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
        try {
            await api.post(`/solicitudes-retiro/${req.id}/return-archive`);
            Swal.fire('Éxito', 'Documento reingresado al archivo.', 'success');
            loadRequests(currentPage.value);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Error al reingresar.', 'error');
        }
    }
};

const confirmReturn = async (req) => {
    // Intentar obtener la fecha del documento si está disponible, sino usar la de la solicitud, o 'N/A'
    const docDate = formatDate(req.documento?.fecha || req.fecha_solicitud);

    const result = await Swal.fire({
        title: '¿Confirmar Reingreso?',
        html: `¿Confirma que ha recibido físicamente la garantía <strong>${req.numero_documento}</strong> de fecha <strong>${docDate}</strong> de vuelta en el archivo?<br><br>Esto finalizará el ciclo de préstamo.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#7C3AED',
        cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
        try {
            await api.post(`/solicitudes-retiro/${req.id}/confirm-return`);
            Swal.fire('Éxito', 'Garantía reingresada al archivo correctamente.', 'success');
            loadRequests(currentPage.value);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'No se pudo confirmar el reingreso.', 'error');
        }
    }
};

const getStatusLabel = (status) => {
    switch(Number(status)) {
        case 0: return 'Archivado / Finalizado';
        case 1: return 'Solicitado';
        case 2: return 'Enviado (Temporal)';
        case 3: return 'Enviado (Definitivo)';
        case 4: return 'Recibido en Agencia';
        case 5: return 'Entregado a Asociado';
        case 6: return 'En Retorno a Archivo';
        default: return `Desconocido (${status})`;
    }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  if (dateString.length === 10) {
      return new Date(dateString + 'T00:00:00').toLocaleDateString();
  }
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  loadRequests(1);
  loadAgencies();
});
</script>
