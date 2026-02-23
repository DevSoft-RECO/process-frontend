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

       <!-- Future Feature Placeholder -->
       <div class="bg-gray-50 rounded-3xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center opacity-70">
          <div class="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
             <i class="fas fa-lock text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-600 mb-2">Más Reportes</h3>
          <p class="text-sm text-gray-500">Próximamente más formatos</p>
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
import SelectAgenciasModal from '@/components/reportes/SelectAgenciasModal.vue';

const reportStore = useReportStore();
const isModalOpen = ref(false);

const handleGenerarAgencias = async (agenciasSeleccionadas) => {
    // LLamar al store con el array resultante (vacío/lleno)
    await reportStore.requestReporteGeneralAgencias(agenciasSeleccionadas);
};
</script>
