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

    <!-- Historic Request Form Section -->
    <SolicitudRetiroHistoricoForm
      v-if="showForm && isHistorico"
      :documentData="documentInfo"
      @cancel="resetForm"
      @success="handleSuccess"
    />

    <!-- Request Form Section (Standard) -->
    <div v-if="showForm && !isHistorico" class="bg-white p-6 rounded-lg shadow space-y-4 animate-fade-in-down">
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

      <!-- Lista de Documentos Encontrados -->
      <div v-if="documentsList.length > 0" class="space-y-4">
          <div class="bg-blue-50 p-3 rounded border border-blue-200">
              <h3 class="font-bold text-blue-800">Garantías Asociadas al Expediente</h3>
              <p class="text-sm text-blue-600">Seleccione la garantía que desea retirar.</p>
              <p v-if="expedienteActive" class="text-xs text-red-600 font-bold mt-1">
                  <i class="fas fa-exclamation-circle"></i> Advertencia: El expediente asociado aún se encuentra ACTIVO.
              </p>
          </div>

          <div class="grid grid-cols-1 gap-4">
              <div v-for="doc in documentsList" :key="doc.id" 
                   class="border rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors relative"
                   :class="{'border-blue-500 ring-2 ring-blue-200': formData.numero_documento === doc.numero, 'border-gray-200': formData.numero_documento !== doc.numero}"
              >
                  <div class="flex justify-between items-start">
                      <div class="flex-1">
                          <div class="flex items-center space-x-2">
                              <span class="font-bold text-lg text-gray-800">{{ doc.numero }}</span>
                              <span v-if="doc.tiene_otros_activos" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold cursor-help" title="Amarrado a otros expedientes activos">
                                  <i class="fas fa-link"></i> Vinculado a otros
                              </span>
                          </div>
                          <div class="text-sm text-gray-600 mt-1">
                              <p><span class="font-semibold">Tipo:</span> {{ doc.tipo_documento?.nombre || 'N/A' }}</p>
                              <p><span class="font-semibold">Propietario:</span> {{ doc.propietario }}</p>
                              <p><span class="font-semibold">Monto:</span> {{ doc.monto_poliza }}</p>
                          </div>
                      </div>
                      <div class="flex flex-col space-y-2">
                           <button 
                              @click="selectDocument(doc)"
                              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                              :class="{'bg-green-600 hover:bg-green-700': formData.numero_documento === doc.numero}"
                           >
                              <i class="fas" :class="formData.numero_documento === doc.numero ? 'fa-check' : 'fa-hand-pointer'"></i>
                              {{ formData.numero_documento === doc.numero ? 'Seleccionado' : 'Seleccionar' }}
                           </button>

                           <button 
                              v-if="doc.tiene_otros_activos"
                              @click="showActiveLinks(doc)"
                              class="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 text-xs"
                           >
                              <i class="fas fa-eye"></i> Ver Vinculados
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Detalle Simple (Solo para Manual o sin lista) -->
      <div v-if="isManual || (documentInfo && documentsList.length === 0)" class="bg-gray-50 p-4 rounded border border-gray-200 text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
           <div><span class="font-bold">Propietario:</span> {{ documentInfo?.propietario || 'N/A' }}</div>
      </div>
      


      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
            <option value="Definitivo" :disabled="isSelectionLinked">Definitivo</option>
          </select>
          <p v-if="isSelectionLinked" class="text-xs text-red-600 mt-1">
             * Retiro definitivo no permitido por vinculación activa.
          </p>
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
        <div class="flex space-x-4">
            <button 
                @click="activeTab = 'sent'"
                class="pb-2 text-lg font-semibold border-b-2 transition-colors"
                :class="activeTab === 'sent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
                Mis Solicitudes
            </button>
            <button 
                @click="activeTab = 'received'"
                class="pb-2 text-lg font-semibold border-b-2 transition-colors"
                :class="activeTab === 'received' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
                Solicitudes Recibidas
            </button>
        </div>
        
        <button v-if="activeTab === 'sent'" @click="loadHistory(1)" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
        <button v-else @click="loadIncoming(1)" class="text-blue-600 hover:text-blue-800 text-sm">
          <i class="fas fa-sync"></i> Actualizar
        </button>
      </div>
      
      <!-- SENT TAB CONTENTS -->
      <div v-if="activeTab === 'sent'" class="flex-1 overflow-auto flex flex-col">
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

      <!-- Pagination Controls -->
      <div v-if="lastPage > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                  <p class="text-sm text-gray-700">
                      Mostrando página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{ lastPage }}</span>
                      (<span class="font-medium">{{ totalHistory }}</span> resultados)
                  </p>
              </div>
              <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                          @click="loadHistory(currentPage - 1)"
                          :disabled="currentPage === 1"
                          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span class="sr-only">Anterior</span>
                          <i class="fas fa-chevron-left"></i>
                      </button>
                      <button 
                          @click="loadHistory(currentPage + 1)"
                          :disabled="currentPage === lastPage"
                          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span class="sr-only">Siguiente</span>
                          <i class="fas fa-chevron-right"></i>
                      </button>
                  </nav>
              </div>
          </div>
           <!-- Mobile Pagination -->
           <div class="flex items-center justify-between sm:hidden w-full">
               <button 
                  @click="loadHistory(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                  Anterior
              </button>
              <span class="text-sm text-gray-700">
                  {{ currentPage }} / {{ lastPage }}
              </span>
              <button 
                  @click="loadHistory(currentPage + 1)"
                  :disabled="currentPage === lastPage"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                  Siguiente
              </button>
           </div>
      </div>
      </div>
    
    <!-- INCOMING TAB CONTENTS -->
    <div v-if="activeTab === 'received'" class="bg-white p-4 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Envío</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen (Agencia)</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loadingIncoming">
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">Cargando solicitudes recibidas...</td>
                </tr>
                <tr v-else-if="incomingRequests.length === 0">
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">No ha recibido solicitudes de otras agencias.</td>
                </tr>
                <tr v-for="item in incomingRequests" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.fecha_envio) }}</td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{{ item.agencia?.nombre || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.solicitante?.name || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.numero_documento }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.titulo_nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(item.estado_actual)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      <span v-if="item.estado_actual === 2">Recibido Temporal</span>
                      <span v-else-if="item.estado_actual === 3">Recibido Definitivo</span>
                      <span v-else>{{ getStatusLabel(item.estado_actual) }}</span>
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                        v-if="[2, 3].includes(item.estado_actual)"
                        @click="confirmReceipt(item)"
                        class="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold border border-green-300 transition-colors"
                        title="Confirmar Recepción Física"
                    >
                        <i class="fas fa-check-circle mr-1"></i> Recibir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls (Incoming) -->
          <div v-if="lastPageIncoming > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                      <p class="text-sm text-gray-700">
                          Página <span class="font-medium">{{ currentPageIncoming }}</span> de <span class="font-medium">{{ lastPageIncoming }}</span>
                      </p>
                  </div>
                  <div>
                      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button 
                              @click="loadIncoming(currentPageIncoming - 1)"
                              :disabled="currentPageIncoming === 1"
                              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                              <i class="fas fa-chevron-left"></i>
                          </button>
                          <button 
                              @click="loadIncoming(currentPageIncoming + 1)"
                              :disabled="currentPageIncoming === lastPageIncoming"
                              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                              <i class="fas fa-chevron-right"></i>
                          </button>
                      </nav>
                  </div>
              </div>
          </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth'; // Import auth store

import SolicitudRetiroHistoricoForm from './SolicitudRetiroHistoricoForm.vue';

const authStore = useAuthStore(); // Use auth store

// State
const activeTab = ref('sent');
const searchTerm = ref('');
const loadingSearch = ref(false);
const showForm = ref(false);
const isManual = ref(false);
const isHistorico = ref(false); // Nuevo estado
const loadingSubmit = ref(false);

// Sent History State
const history = ref([]);
const loadingHistory = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const totalHistory = ref(0);

// Incoming Requests State
const incomingRequests = ref([]);
const loadingIncoming = ref(false);
const currentPageIncoming = ref(1);
const lastPageIncoming = ref(1);
const totalIncoming = ref(0);

const documentInfo = ref(null); // Nuevo estado para la info del documento
const documentsList = ref([]);
const expedienteActive = ref(false);

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
  documentInfo.value = null; // Reset info
  documentsList.value = [];
  expedienteActive.value = false;
  resetFormData();

  try {
    const response = await api.post('/solicitudes-retiro/search', {
      termino: searchTerm.value
    });

    if (response.data.error) {
       // Bloqueado (Solo Casos críticos como sin seguimiento)
       Swal.fire({
         icon: 'error',
         title: 'Operación Bloqueada',
         text: response.data.message,
         footer: 'El expediente no tiene garantías asociadas o no existe seguimiento.'
       });
       return;
    }

    if (response.data.found) {
      // START: Historic Handling
      if (response.data.source === 'historico') {
          isHistorico.value = true;
          isManual.value = false;
          // Set document info for the historic component
          documentInfo.value = response.data.data;
          showForm.value = true;
          return;
      }
      // END: Historic Handling

      isManual.value = false;
      isHistorico.value = false;
      // Pre-fill expediente data
      formData.id_expediente = response.data.data.id_expediente;
      formData.titulo_nombre = response.data.data.titulo_nombre; // Keep existing title if any
      formData.es_manual = false;
      
      // Load documents list
      documentsList.value = response.data.data.documentos || [];
      expedienteActive.value = response.data.data.expediente_activo;
      
      showForm.value = true;
    } else {
      // Documento NO encontrado
      showForm.value = false;
      documentInfo.value = null;
      documentsList.value = [];
      resetFormData();
      
      Swal.fire({
        icon: 'warning',
        title: 'No encontrado',
        text: 'El número de producto que busca no se encuentra en el sistema. Verifique y vuelva a intentarlo.',
        confirmButtonText: 'Entendido'
      });
    }

  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Ocurrió un error al buscar el documento', 'error');
  } finally {
    loadingSearch.value = false;
  }
};

const isSelectionLinked = computed(() => {
    if (!formData.numero_documento) return false;
    const doc = documentsList.value.find(d => d.numero === formData.numero_documento);
    return doc ? doc.tiene_otros_activos : false;
});

const selectDocument = (doc) => {
    formData.numero_documento = doc.numero;
    if (doc.tiene_otros_activos) {
        formData.tipo_retiro = 'Temporal';
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Esta garantía está vinculada a otros expedientes activos. Solo se permite retiro TEMPORAL.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
    }
};

const showActiveLinks = (doc) => {
    if (!doc.otros_activos_lista || doc.otros_activos_lista.length === 0) return;

    const listaHtml = doc.otros_activos_lista.map(exp => 
        `<li class="text-left mb-1">
            <span class="font-bold text-red-600">${exp.numero}</span> - ${exp.nombre}
         </li>`
    ).join('');

    Swal.fire({
        title: 'Expedientes Activos Vinculados',
        html: `
            <p class="mb-4 text-sm text-gray-600">El documento No. <strong>${doc.numero}</strong> está vinculado a los siguientes expedientes:</p>
            <ul class="list-disc list-inside bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                ${listaHtml}
            </ul>
        `,
        confirmButtonText: 'Entendido'
    });
};

const submitRequest = async () => {
  if (!formData.justificacion) {
    Swal.fire('Atención', 'Debe ingresar una justificación', 'warning');
    return;
  }
  if (!formData.numero_documento) {
      Swal.fire('Atención', 'Debe seleccionar una garantía o ingresar un número de documento', 'warning');
      return;
  }
  if (isManual.value && !formData.titulo_nombre) {
    Swal.fire('Atención', 'Debe ingresar el Título o Nombre Asociado', 'warning');
    return;
  }

  // Get agency ID from auth store
  const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;

  if (!agencyId) {
      Swal.fire('Error', 'No se pudo identificar la agencia del usuario. Verifique su sesión.', 'error');
      return;
  }

  // Add agency ID to payload
  const payload = {
      ...formData,
      id_agencia: agencyId
  };

  loadingSubmit.value = true;

  try {
    await api.post('/solicitudes-retiro', payload);
    
    Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
    resetForm();
    Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
    resetForm();
    loadHistory(1);

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Error al enviar la solicitud';
    Swal.fire('Error', msg, 'error');
  } finally {
    loadingSubmit.value = false;
  }
};

const loadHistory = async (page = 1) => {
  loadingHistory.value = true;
  try {
    const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;
    const response = await api.get('/solicitudes-retiro/agencia', {
      params: { 
          id_agencia: agencyId,
          page: page 
      }
    });

    history.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
    totalHistory.value = response.data.total;
    
  } catch (error) {
    console.error(error);
  } finally {
    loadingHistory.value = false;
  }
};

const loadIncoming = async (page = 1) => {
  loadingIncoming.value = true;
  try {
    const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;
    const response = await api.get('/solicitudes-retiro/incoming', {
      params: { 
          id_agencia: agencyId,
          page: page 
      }
    });

    incomingRequests.value = response.data.data;
    currentPageIncoming.value = response.data.current_page;
    lastPageIncoming.value = response.data.last_page;
    totalIncoming.value = response.data.total;
    
  } catch (error) {
    console.error(error);
  } finally {
    loadingIncoming.value = false;
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

const handleSuccess = () => {
    resetForm();
    resetForm();
    loadHistory(1);
};

const resetForm = () => {
  showForm.value = false;
  searchTerm.value = '';
  resetFormData();
  documentsList.value = [];
  isHistorico.value = false; // Reset historic flag
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
    case 4: return 'Recibido en Agencia';
    case 5: return 'Entregado a Asociado';
    default: return 'Desconocido';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 1: return 'bg-yellow-100 text-yellow-800';
    case 2: return 'bg-blue-100 text-blue-800';
    case 3: return 'bg-red-100 text-red-800';
    case 4: return 'bg-indigo-100 text-indigo-800'; // Received
    case 5: return 'bg-green-100 text-green-800'; // Delivered
    default: return 'bg-gray-100 text-gray-800';
  }
};

const confirmReceipt = async (item) => {
    const result = await Swal.fire({
        title: '¿Confirmar Recepción?',
        html: `¿Confirma que ha recibido físicamente la garantía <strong>${item.numero_documento}</strong>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Confirmar Recepción',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
        try {
            await api.post(`/solicitudes-retiro/${item.id}/confirm-receipt`);
            Swal.fire('Éxito', 'Recepción confirmada. El estado ha cambiado a Aceptado.', 'success');
            loadIncoming(currentPageIncoming.value);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'No se pudo confirmar la recepción.', 'error');
        }
    }
};

onMounted(() => {
  loadHistory();
  loadIncoming();
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
