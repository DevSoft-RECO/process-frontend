<template>
  <Transition name="slide-up">
    <div v-if="reportStore.myReports.length > 0 && reportStore.isWidgetVisible" 
         class="fixed bottom-4 right-4 z-40 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300"
         :class="{ 'h-14': reportStore.isWidgetMinimized }">
      
      <!-- Header Estilo Minimized/Google Drive -->
      <div class="h-14 px-4 flex items-center justify-between bg-gray-900 text-white cursor-pointer select-none" 
           @click="reportStore.toggleMinimize()">
        <div class="flex items-center gap-3">
             <div v-if="reportStore.hasActiveReports" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
             <div v-else class="text-green-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
            
            <span class="font-medium text-sm truncate">
                {{ reportStore.hasActiveReports ? 'Generando Reporte(s)...' : 'Descargas Listas' }}
            </span>
        </div>
        
        <div class="flex items-center gap-2">
            <!-- Minimize btn -->
            <button class="p-1.5 hover:bg-gray-700 rounded transition-colors" @click.stop="reportStore.toggleMinimize()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="reportStore.isWidgetMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"></path>
                </svg>
            </button>
            <!-- Close btn -->
            <button class="p-1.5 hover:bg-gray-700 rounded transition-colors" @click.stop="reportStore.closeWidget()" title="Ocultar Ventana">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
      </div>

      <!-- Body Lista de Descargas -->
      <div v-show="!reportStore.isWidgetMinimized" class="max-h-80 overflow-y-auto custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-900">
         
         <!-- Placeholder empty -->
         <div v-if="reportStore.myReports.length === 0" class="p-4 text-center text-sm text-gray-500">
            No hay elementos recientes
         </div>

         <!-- Item de Reporte -->
         <div v-for="report in reportStore.myReports" :key="report.id" 
              class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700 p-4 transition-colors relative group">
           
           <div class="flex items-start justify-between">
             <div class="flex items-center gap-3 w-full pr-20">
                <!-- Icono Descriptivo (Miniatura) -->
               <div :class="[
                  'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm',
                  report.estado === 'completado' ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/50 dark:border-green-800 dark:text-green-400' : '',
                  report.estado === 'fallido' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/50 dark:border-red-800 dark:text-red-400' : '',
                  (report.estado === 'procesando' || report.estado === 'pendiente') ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-400' : ''
               ]">
                  <svg v-if="report.estado === 'completado'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <svg v-else-if="report.estado === 'fallido'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <svg v-else class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
               </div>

               <!-- Información textual -->
               <div class="flex-grow min-w-0">
                 <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" :title="`Reporte ID: ${report.id}`">
                   {{ getReportName(report.tipo_reporte) }} #{{ report.id }}
                 </h4>
                 
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    <span v-if="report.estado === 'pendiente' || report.estado === 'procesando'">{{ report.progreso_porcentaje }}% completado</span>
                    <span v-else-if="report.estado === 'completado'">Generado exitosamente</span>
                    <span v-else-if="report.estado === 'fallido'" class="text-red-500" :title="report.error_msg || ''">Error interno del servidor</span>
                  </p>
               </div>
             </div>
           </div>

           <!-- Acciones Flotantes Siempre Visibles (Eliminar o Descargar) -->
           <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white dark:bg-slate-800 z-10 pl-2">
                <button v-if="report.estado === 'completado'" 
                        @click="reportStore.downloadReportFile(report.id)"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 p-2 rounded-lg transition-colors" 
                        title="Descargar CSV">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
                <button @click="reportStore.deleteReport(report.id)"
                        class="text-gray-400 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" 
                        title="Eliminar Reporte">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
           </div>

           <!-- Barra de Progreso Inferior Lineal -->
           <div class="absolute bottom-0 left-0 w-full bg-gray-100 dark:bg-slate-700 h-1" v-if="report.estado === 'procesando' || report.estado === 'pendiente'">
              <div class="bg-blue-500 h-1 transition-all duration-500" 
                   :style="`width: ${report.progreso_porcentaje}%`">
              </div>
           </div>

         </div>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReportStore } from '@/stores/report';

const reportStore = useReportStore();

const getReportName = (code: string) => {
    switch (code) {
        case 'seguimiento_csv': return 'Seguimiento Crudo';
        case 'general_agencias': return 'General por Agencias';
        case 'gerencial_tiempos': return 'Analítica de Tiempos';
        default: return 'Reporte Exportado';
    }
};

onMounted(() => {
  reportStore.fetchMyReports();
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Soporte light/dark scroller dentro del widget */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
