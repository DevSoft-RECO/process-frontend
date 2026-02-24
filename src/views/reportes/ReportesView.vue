<template>
  <div class="h-full flex flex-col pt-10 px-4 md:px-8 bg-gray-50 overflow-y-auto w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-10 text-center md:text-left">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start">
        <div class="bg-blue-100 p-3 rounded-2xl mr-4 shadow-sm">
            <i class="fas fa-chart-line text-blue-600"></i>
        </div> 
        Reportes Analíticos
      </h1>
      <p class="mt-4 text-gray-500 text-lg md:text-xl max-w-3xl">
        Descargue la información de todos los expedientes y fechas para análisis gerencial. Los reportes grandes se generan asíncronamente en segundo plano.
      </p>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Export Seguimiento General -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
            <i class="fas fa-file-csv text-emerald-600 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Seguimiento Principal</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Consolidado histórico de fechas y estados de expedientes. Úsalo para medir los tiempos de la operación legal. (Puede tardar en procesar).
          </p>
        </div>
        
        <button 
          @click="reportStore.requestSegaCSV()" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-lg"></i>
          <i v-else class="fas fa-cloud-download-alt text-lg group-hover:-translate-y-0.5 transition-transform"></i>
          {{ reportStore.isRequesting ? 'Enviando Solicitud...' : 'Generar Reporte' }}
        </button>
      </div>
      
      <!-- Export General Agencias (NUEVO) -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Consolidado por Agencias</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Obtén un análisis específico seleccionando sucursales, o genera un consolidado total.
          </p>
        </div>
        
        <button 
          @click="isModalOpen = true" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <svg class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filtrar y Exportar
        </button>
      </div>

      <!-- Export General (Asesor Logueado) -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-100">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Rendimiento Personal</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Extraer el consolidado de expedientes asignados a tu usuario ({{ authStore.user?.username || authStore.user?.name || 'Invitado' }}).
          </p>
        </div>
        
        <button 
          @click="dispararReporteAsesor" 
          :disabled="reportStore.isRequesting || (!authStore.user?.username && !authStore.user?.name)"
          class="w-full flex justify-center items-center gap-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-lg"></i>
          <svg v-else class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Generar mi Reporte
        </button>
      </div>

      <!-- Export Documentos Generales (Garantías) -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Garantías Reales</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Descargar todo el registro central de Documentos base (Sin filtro de expedientes).
          </p>
        </div>
        
        <button 
          @click="dispararReporteDocumentos" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-lg"></i>
          <svg v-else class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Matriz
        </button>
      </div>

      <!-- Export Préstamos de Expedientes (Solicitudes Admin) -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Préstamo de Expedientes</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Reporte maestro sobre solicitudes administrativas y movimiento de uso interno de Archivo.
          </p>
        </div>
        
        <button 
          @click="dispararReporteSolicitudesAdmin" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-lg"></i>
          <svg v-else class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Auditoría Física
        </button>
      </div>

    <!-- Export Retiro de Garantías (Solicitudes de Retiro) -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex-grow">
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Retiro de Garantías</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Concentrado de bitácoras sobre salidas definitivas o temporales de créditos e hipotecas asignadas.
          </p>
        </div>
        
        <button 
          @click="dispararReporteSolicitudesRetiro" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-lg"></i>
          <svg v-else class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Retiros
        </button>
      </div>

    </div>
    
    <!-- Modal Selection Agencias -->
    <SelectAgenciasModal 
       :isOpen="isModalOpen" 
       @close="isModalOpen = false"
       @confirm="handleGenerarAgencias"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useReportStore } from '@/stores/report';
import { useAuthStore } from '@/stores/auth';
import SelectAgenciasModal from '@/components/reportes/SelectAgenciasModal.vue';
import Swal from 'sweetalert2';

const reportStore = useReportStore();
const authStore = useAuthStore();
const isModalOpen = ref(false);

const handleGenerarAgencias = async (agenciasSeleccionadas) => {
    await reportStore.requestReporteGeneralAgencias(agenciasSeleccionadas);
};

const dispararReporteAsesor = async () => {
    const identificador = authStore.user?.username || authStore.user?.name;
    if (!identificador) {
        Swal.fire('Error', 'No se detecta un nombre de usuario en tu sesión activa.', 'error');
        return;
    }
    await reportStore.requestReporteGeneralAsesor(identificador);
};

const dispararReporteDocumentos = async () => {
    await reportStore.requestReporteDocumentos();
};

const dispararReporteSolicitudesAdmin = async () => {
    await reportStore.requestReporteSolicitudesAdmin();
};

const dispararReporteSolicitudesRetiro = async () => {
    await reportStore.requestReporteSolicitudesRetiro();
};
</script>
