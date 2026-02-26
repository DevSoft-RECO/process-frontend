<template>
  <div class="h-full flex flex-col pt-8 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-y-auto w-full">
    <!-- Header -->
    <div class="mb-8 w-full">
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

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 w-full items-start animate-fade-in">
      
      <!-- Export Seguimiento General (Emerald) -->
      <div v-if="hasRequiredPermission('REPSeguimiento_Principal')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="reportStore.requestSegaCSV()"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-emerald-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-emerald-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-emerald-900/20">
                 <i class="fas fa-file-alt text-2xl text-emerald-600 dark:text-emerald-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
               Histórico Sistema
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
               Seguimiento Principal
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Consolidado de fechas y estados para medir los tiempos de la operación legal en general.
             </p>
           </div>
           <div class="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Generar Reporte' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-emerald-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-emerald-600 dark:text-emerald-400"></i>
               <i v-else class="fas fa-arrow-right text-emerald-600 dark:text-emerald-400"></i>
             </div>
           </div>
         </div>
      </div>
      
      <!-- Export General Agencias (Blue) -->
      <div v-if="hasRequiredPermission('REPConsolidado_Agencias')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="isModalOpen = true"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-blue-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-blue-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-blue-900/20">
                 <i class="fas fa-building text-2xl text-blue-600 dark:text-blue-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
               Multi-Sucursal
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
               Consolidado Agencias
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Análisis específico seleccionando sucursales o un volumen total consolidado.
             </p>
           </div>
           <div class="flex items-center font-bold text-blue-600 dark:text-blue-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Filtrar y Exportar' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-blue-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-blue-600 dark:text-blue-400"></i>
               <i v-else class="fas fa-arrow-right text-blue-600 dark:text-blue-400"></i>
             </div>
           </div>
         </div>
      </div>

      <!-- Export General (Asesor Logueado) (Purple) -->
      <div v-if="hasRequiredPermission('REPRendimiento_Personal')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting || (!authStore.user?.username && !authStore.user?.name)}"
         @click="dispararReporteAsesor"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-violet-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-violet-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-violet-900/20">
                 <i class="fas fa-user-circle text-2xl text-violet-600 dark:text-violet-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 truncate max-w-[120px]">
               {{ authStore.user?.username || 'Asesor' }}
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
               Rendimiento Personal
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Consolidado exclusivo de los expedientes bajo tu supervisión directa y de manera local.
             </p>
           </div>
           <div class="flex items-center font-bold text-violet-600 dark:text-violet-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Generar Reporte' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-violet-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-violet-600 dark:text-violet-400"></i>
               <i v-else class="fas fa-arrow-right text-violet-600 dark:text-violet-400"></i>
             </div>
           </div>
         </div>
      </div>

      <!-- Export Documentos Generales (Garantías) (Orange) -->
      <div v-if="hasRequiredPermission('REPEstado_Garantías_Reales')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="dispararReporteDocumentos"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-orange-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-orange-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-orange-900/20">
                 <i class="fas fa-folder-open text-2xl text-orange-600 dark:text-orange-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
               Archivo Central
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
              Estado Garantías Reales
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Todo el registro central de Documentos físicos registrados en el inventario de las bóvedas.
             </p>
           </div>
           <div class="flex items-center font-bold text-orange-600 dark:text-orange-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Extraer Excel' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-orange-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-orange-600 dark:text-orange-400"></i>
               <i v-else class="fas fa-arrow-right text-orange-600 dark:text-orange-400"></i>
             </div>
           </div>
         </div>
      </div>

      <!-- Export Préstamos de Expedientes (Solicitudes Admin) (Sky) -->
      <div v-if="hasRequiredPermission('REPArchivos_Administrativos')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="dispararReporteSolicitudesAdmin"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-sky-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-sky-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-sky-900/20">
                 <i class="fas fa-file-export text-2xl text-sky-600 dark:text-sky-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
               Archivos Administrativos
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
               Archivos Administrativos
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Logística de Archivo Interno: rastrear las solicitudes de consulta administrativa y préstamo.
             </p>
           </div>
           <div class="flex items-center font-bold text-sky-600 dark:text-sky-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Extraer Préstamos' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-sky-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-sky-600 dark:text-sky-400"></i>
               <i v-else class="fas fa-arrow-right text-sky-600 dark:text-sky-400"></i>
             </div>
           </div>
         </div>
      </div>

    <!-- Export Retiro de Garantías (Solicitudes de Retiro) (Red) -->
      <div v-if="hasRequiredPermission('REPRetiro_Garantías')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="dispararReporteSolicitudesRetiro"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-rose-400 via-red-500 to-pink-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-red-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-red-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-red-900/20">
                 <i class="fas fa-file-import text-2xl text-red-600 dark:text-red-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-800 dark:bg-red-900/50 dark:text-red-300">
               Salidas a Permanentes/Temp
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
               Retiro Garantías
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Concentrado de transacciones sobre salidas definitivas o temporales de créditos e hipotecas físicas.
             </p>
           </div>
           <div class="flex items-center font-bold text-red-600 dark:text-red-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Extraer Retiros' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-red-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-red-600 dark:text-red-400"></i>
               <i v-else class="fas fa-arrow-right text-red-600 dark:text-red-400"></i>
             </div>
           </div>
         </div>
      </div>

    <!-- Export Confirmacion de Documentos (Teal) -->
      <div v-if="hasRequiredPermission('REPConfirmación_Física')"
           class="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.5)]"
         :class="{'pointer-events-none opacity-80': reportStore.isRequesting}"
         @click="dispararReporteConfirmaciones"
      >
         <div class="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600"></div>
         <div class="relative flex h-full flex-col justify-between rounded-[22px] bg-white p-8 transition-colors duration-300 dark:bg-gray-950">
           <div class="mb-6 flex items-start justify-between">
             <div class="relative">
               <div class="absolute inset-0 scale-150 bg-teal-500/20 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div class="relative rounded-2xl bg-teal-50 p-4 transition-transform duration-500 group-hover:rotate-6 dark:bg-teal-900/20">
                 <i class="fas fa-check-circle text-2xl text-teal-600 dark:text-teal-400"></i>
               </div>
             </div>
             <span class="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
               Garantías Físicas
             </span>
           </div>
           <div class="mb-8">
             <h3 class="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
               Confirmación Física
             </h3>
             <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
               Historial de verificación de existencia física de garantías documentadas al interior de Archivo Central.
             </p>
           </div>
           <div class="flex items-center font-bold text-teal-600 dark:text-teal-400">
             <span class="text-sm transition-all duration-300 group-hover:mr-3">
               {{ reportStore.isRequesting ? 'Procesando...' : 'Extraer Analítica' }}
             </span>
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 opacity-0 transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 dark:bg-teal-900/30">
               <i v-if="reportStore.isRequesting" class="fas fa-spinner fa-spin text-teal-600 dark:text-teal-400"></i>
               <i v-else class="fas fa-arrow-right text-teal-600 dark:text-teal-400"></i>
             </div>
           </div>
         </div>
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

const hasRequiredPermission = (permStr) => {
    return authStore.hasRole('Super Admin') || authStore.hasPermission(permStr);
};

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
