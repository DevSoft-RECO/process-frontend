<template>
  <div class="h-full flex flex-col space-y-6 p-1 md:p-2">
    <!-- Header Page -->
    <div class="flex items-center space-x-3">
      <div class="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
        <i class="fas fa-hand-holding-usd text-xl"></i>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Solicitud de Retiro de Garantías</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Gestione y solicite retiros de garantías de expedientes.</p>
      </div>
    </div>

    <!-- Search Section -->
    <BuscarGarantia 
      v-model="searchTerm"
      :loading="loadingSearch"
      @search="searchDocument"
    />

    <!-- Historic Request Form Section -->
    <SolicitudRetiroHistoricoForm
      v-if="showForm && isHistorico"
      :documentData="documentInfo"
      @cancel="resetForm"
      @success="handleSuccess"
    />

    <!-- Request Form Section (Standard) -->
    <FormularioSolicitud
      :show="showForm && !isHistorico"
      :isManual="isManual"
      :documentsList="documentsList"
      :documentInfo="documentInfo"
      :expedienteActive="expedienteActive"
      :formData="formData"
      :isSuperAdmin="isSuperAdmin"
      :loadingSubmit="loadingSubmit"
      @submit="submitRequest"
      @cancel="resetForm"
      @select-document="selectDocument"
      @show-links="showActiveLinks"
      @update-field="updateField"
    />

    <!-- History Table -->
    <HistorialSolicitudes
      :activeTab="activeTab"
      :sentFilter="sentFilter"
      :history="history"
      :incomingRequests="incomingRequests"
      :loadingHistory="loadingHistory"
      :loadingIncoming="loadingIncoming"
      :currentPage="currentPage"
      :lastPage="lastPage"
      :totalHistory="totalHistory"
      :currentPageIncoming="currentPageIncoming"
      :lastPageIncoming="lastPageIncoming"
      :totalIncoming="totalIncoming"
      @update-tab="activeTab = $event"
      @update-sent-filter="sentFilter = $event"
      @load-history="loadHistory"
      @load-incoming="loadIncoming"
      @confirm-receipt="confirmReceipt"
      @return-archive="returnToArchive"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/formatters';

import SolicitudRetiroHistoricoForm from './SolicitudRetiroHistoricoForm.vue';
import BuscarGarantia from './components/BuscarGarantia.vue';
import FormularioSolicitud from './components/FormularioSolicitud.vue';
import HistorialSolicitudes from './components/HistorialSolicitudes.vue';

const authStore = useAuthStore();

// State
const activeTab = ref('sent');
const sentFilter = ref('all');
const searchTerm = ref('');
const loadingSearch = ref(false);
const showForm = ref(false);
const isManual = ref(false);
const isHistorico = ref(false);
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

const documentInfo = ref(null);
const documentsList = ref([]);
const expedienteActive = ref(false);

const isSuperAdmin = computed(() => authStore.hasRole('Super Admin'));

const formData = reactive({
  id_expediente: null,
  id_expediente_historico: null,
  numero_documento: '',
  codigo_cliente: null,
  numero_producto: null,
  id_documento: null,
  fecha_documento: null,
  titulo_nombre: '',
  tipo_retiro: 'Temporal',
  justificacion: '',
  es_manual: false
});

// Methods
const updateField = ({ field, value }) => {
  formData[field] = value;
};

const searchDocument = async () => {
  if (!searchTerm.value.trim()) {
    Swal.fire('Error', 'Ingrese un término de búsqueda', 'warning');
    return;
  }

  loadingSearch.value = true;
  showForm.value = false;
  documentInfo.value = null;
  documentsList.value = [];
  expedienteActive.value = false;
  resetFormData();

  try {
    const response = await api.post('/solicitudes-retiro/search', {
      termino: searchTerm.value
    });

    if (response.data.error) {
       Swal.fire({
         icon: 'error',
         title: 'Operación Bloqueada',
         text: response.data.message
       });
       return;
    }

    if (response.data.found) {
      if (response.data.source === 'historico') {
          isHistorico.value = true;
          isManual.value = false;
          documentInfo.value = response.data.data;
          showForm.value = true;
          return;
      }

      isManual.value = false;
      isHistorico.value = false;
      formData.id_expediente = response.data.data.id_expediente;
      formData.id_expediente_historico = response.data.data.id_expediente_historico || null;
      formData.codigo_cliente = response.data.data.codigo_cliente || null;
      formData.numero_producto = response.data.data.numero_producto || null;
      formData.titulo_nombre = response.data.data.titulo_nombre;
      formData.es_manual = false;
      
      documentsList.value = response.data.data.documentos || [];
      expedienteActive.value = response.data.data.expediente_activo;
      
      showForm.value = true;
    } else {
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

const selectedDoc = computed(() => {
    return documentsList.value.find(d => d.id === formData.id_documento);
});

const selectDocument = (doc) => {
    if (doc.estado_fisico !== 'activo') {
        Swal.fire('No Disponible', `El documento actualmente se encuentra prestando estado '${doc.estado_fisico}' y no puede ser solicitado.`, 'warning');
        return;
    }

    formData.id_documento = doc.id;
    formData.numero_documento = doc.numero;
    formData.fecha_documento = doc.fecha ? new Date(doc.fecha).toISOString().split('T')[0] : null;
    
    if (doc.permite_temporal && !doc.permite_definitivo) {
        formData.tipo_retiro = 'Temporal';
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'El expediente asociado aún se encuentra ACTIVO. Solo se permite retiro TEMPORAL.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
    } else if (doc.permite_definitivo && !doc.permite_temporal) {
        formData.tipo_retiro = 'Definitivo';
    } else {
        formData.tipo_retiro = 'Temporal';
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

  const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id;

  if (!agencyId) {
      Swal.fire('Error', 'No se pudo identificar la agencia del usuario. Verifique su sesión.', 'error');
      return;
  }

  const payload = {
      ...formData,
      id_agencia: agencyId
  };

  loadingSubmit.value = true;

  try {
    await api.post('/solicitudes-retiro', payload);
    
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
    const agencyId = isSuperAdmin.value ? null : (authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id);
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
    const agencyId = isSuperAdmin.value ? null : (authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id);
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
  formData.id_expediente_historico = null;
  formData.numero_documento = '';
  formData.codigo_cliente = null;
  formData.numero_producto = null;
  formData.id_documento = null;
  formData.fecha_documento = null;
  formData.titulo_nombre = '';
  formData.tipo_retiro = 'Temporal';
  formData.justificacion = '';
  formData.es_manual = false;
};

const handleSuccess = () => {
    resetForm();
    loadHistory(1);
};

const resetForm = () => {
  showForm.value = false;
  searchTerm.value = '';
  resetFormData();
  documentsList.value = [];
  isHistorico.value = false;
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

const returnToArchive = async (item) => {
    const { value: observacion } = await Swal.fire({
        title: '¿Devolver a Archivo?',
        html: `Está solicitando la devolución de la garantía <strong>${item.numero_documento}</strong> al archivo central.<br><br>Ingrese una observación (opcional):`,
        input: 'textarea',
        inputPlaceholder: 'Motivo de devolución...',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, Solicitar Devolución',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280'
    });

    if (observacion !== undefined) {
        try {
            await api.post(`/solicitudes-retiro/${item.id}/return-archive`, {
                observacion: observacion
            });
            Swal.fire('Éxito', 'Solicitud de devolución enviada. El archivo deberá confirmar la recepción.', 'success');
            loadHistory(currentPage.value);
            loadIncoming(currentPageIncoming.value);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Error al solicitar devolución.', 'error');
        }
    }
};

onMounted(() => {
  loadHistory(1);
  loadIncoming(1);
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
