<template>
  <div class="h-full flex flex-col pt-10 px-4 md:px-8 bg-gray-50 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">
        <i class="fas fa-chart-line text-blue-600 mr-2"></i> Reportes Analíticos
      </h1>
      <p class="mt-2 text-gray-500 text-lg">
        Descargue la información histórica y actual del sistema para análisis gerencial.
      </p>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Export Seguimiento General -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
          <i class="fas fa-file-csv text-green-600 text-xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Seguimiento de Expedientes</h3>
        <p class="text-sm text-gray-500 mb-6 min-h-[60px]">
          Exportación de datos crudos (CSV). Incluye todos los campos generales del expediente, fechas, estados actuales e hitos del proceso.
        </p>
        
        <button 
          @click="downloadSegaCSV" 
          :disabled="loadingSega"
          class="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          <i v-if="loadingSega" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-download"></i>
          {{ loadingSega ? 'Generando...' : 'Descargar CSV' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const loadingSega = ref(false);

const downloadSegaCSV = async () => {
    loadingSega.value = true;
    try {
        // We use blob responseType to handle file downloads via axios
        const response = await api.get('/exportar/seguimiento-csv', {
            responseType: 'blob'
        });

        // Extract filename from Content-Disposition header if possible, else use default
        let filename = 'seguimiento_expedientes.csv';
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading CSV', error);
        Swal.fire('Error', 'No se pudo generar el reporte. Intente nuevamente.', 'error');
    } finally {
        loadingSega.value = false;
    }
};
</script>
