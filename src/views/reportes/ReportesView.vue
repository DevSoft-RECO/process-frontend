<template>
  <div class="h-full flex flex-col pt-8 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-y-auto w-full mx-auto">
    <!-- Header -->
    <div class="mb-8 max-w-7xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
        <div class="bg-blue-600 dark:bg-blue-500 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <i class="fas fa-chart-pie text-xl"></i>
        </div> 
        Reportes Analíticos
      </h1>
      <p class="mt-3 text-gray-600 dark:text-gray-400 text-lg max-w-4xl leading-relaxed">
        Centro de inteligencia y exportación gerencial. Descargue consolidados de expedientes y garantías procesadas asíncronamente en segundo plano.
      </p>
    </div>

    <!-- Reports Grid (Horizontal-Header Cards, 2/3 columns max) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 pb-12 w-full max-w-7xl mx-auto items-start">
      
      <!-- Export Seguimiento General -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/60 transition-colors">
            <i class="fas fa-file-csv text-emerald-600 dark:text-emerald-400 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">Seguimiento Principal</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Histórico general</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Consolidado de fechas y estados para medir los tiempos de la operación legal en general.
        </p>
        <button 
          @click="reportStore.requestSegaCSV()" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-emerald-500 dark:bg-gray-700/50 dark:hover:bg-emerald-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-cloud-download-alt"></i>
          {{ reportStore.isRequesting ? 'Procesando...' : 'Generar Reporte' }}
        </button>
      </div>
      
      <!-- Export General Agencias -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/60 transition-colors">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">Consolidado Agencias</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Multi-Sucursal</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Análisis específico seleccionando sucursales o un volumen total consolidado.
        </p>
        <button 
          @click="isModalOpen = true" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-blue-600 dark:bg-gray-700/50 dark:hover:bg-blue-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filtrar y Exportar
        </button>
      </div>

      <!-- Export General (Asesor Logueado) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center border border-purple-100 dark:border-purple-800/50 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/60 transition-colors">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">Rendimiento Personal</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Usuario: {{ authStore.user?.username || 'Invitado' }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Consolidado exclusivo de los expedientes bajo tu supervisión directa y de manera local.
        </p>
        <button 
          @click="dispararReporteAsesor" 
          :disabled="reportStore.isRequesting || (!authStore.user?.username && !authStore.user?.name)"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-purple-600 dark:bg-gray-700/50 dark:hover:bg-purple-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Generar Reporte
        </button>
      </div>

      <!-- Export Documentos Generales (Garantías) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center border border-orange-100 dark:border-orange-800/50 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/60 transition-colors">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">Garantías Reales</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Archivología Global</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Todo el registro central de Documentos físicos registrados en el inventario de las bóvedas.
        </p>
        <button 
          @click="dispararReporteDocumentos" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-orange-500 dark:bg-gray-700/50 dark:hover:bg-orange-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Excel
        </button>
      </div>

      <!-- Export Préstamos de Expedientes (Solicitudes Admin) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center border border-sky-100 dark:border-sky-800/50 group-hover:bg-sky-100 dark:group-hover:bg-sky-800/60 transition-colors">
            <svg class="w-6 h-6 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight">Préstamo Interno</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Soluciones Administrativas</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Logística de Archivo Interno: rastrear las solicitudes de consulta administrativa y préstamo.
        </p>
        <button 
          @click="dispararReporteSolicitudesAdmin" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-sky-500 dark:bg-gray-700/50 dark:hover:bg-sky-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Préstamos
        </button>
      </div>

    <!-- Export Retiro de Garantías (Solicitudes de Retiro) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center border border-red-100 dark:border-red-800/50 group-hover:bg-red-100 dark:group-hover:bg-red-800/60 transition-colors">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">Retiro Garantías</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Salidas a Asesorías/Asociados</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Concentrado de transacciones sobre salidas definitivas o temporales de créditos e hipotecas físicas.
        </p>
        <button 
          @click="dispararReporteSolicitudesRetiro" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-red-500 dark:bg-gray-700/50 dark:hover:bg-red-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Retiros
        </button>
      </div>

    <!-- Export Confirmacion de Documentos -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-100 dark:border-teal-800/50 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/60 transition-colors">
            <svg class="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">Confirmación Física</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Garantías Físicas</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
          Historial de verificación de existencia física de garantías documentadas al interior de Archivo Central.
        </p>
        <button 
          @click="dispararReporteConfirmaciones" 
          :disabled="reportStore.isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-teal-500 dark:bg-gray-700/50 dark:hover:bg-teal-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-transparent dark:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin"></i>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Extraer Analítica
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

const dispararReporteConfirmaciones = async () => {
    await reportStore.requestReporteConfirmaciones();
};
</script>
