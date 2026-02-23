<template>
  <div class="h-full flex flex-col pt-10 px-4 md:px-8 bg-gray-50 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">
        <i class="fas fa-chart-line text-blue-600 mr-2"></i> Reportes Analíticos
      </h1>
      <p class="mt-2 text-gray-500 text-lg">
        Descargue la información histórica y actual del sistema para análisis gerencial. Los reportes grandes se generan en segundo plano.
      </p>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <!-- Export Seguimiento General -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <i class="fas fa-file-csv text-green-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Seguimiento de Expedientes</h3>
          <p class="text-sm text-gray-500 mb-6 min-h-[60px]">
            Exportación de datos crudos (CSV). Incluye todos los campos generales del expediente, fechas, estados actuales e hitos del proceso.
          </p>
        </div>
        
        <button 
          @click="requestSegaCSV" 
          :disabled="isRequesting"
          class="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 mt-auto"
        >
          <i v-if="isRequesting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-cogs"></i>
          {{ isRequesting ? 'Solicitando...' : 'Generar Reporte' }}
        </button>
      </div>
    </div>

    <!-- Bandeja de Reportes en Progreso / Finalizados -->
    <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-auto">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        <i class="fas fa-inbox text-blue-500 mr-2"></i> Mis Descargas y Reportes
      </h2>
      
      <div v-if="loadingReports" class="text-center py-6">
        <i class="fas fa-circle-notch fa-spin text-gray-400 text-3xl"></i>
      </div>
      
      <div v-else-if="myReports.length === 0" class="text-center py-6 text-gray-400">
        No tienes reportes recientes generados.
      </div>
      
      <div v-else class="space-y-4">
        <!-- Report Item Card -->
        <div v-for="report in myReports" :key="report.id" 
             class="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white transition-colors">
          
          <div class="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
            <div class="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hidden sm:block">
              <i class="fas fa-file-alt text-gray-400 text-xl"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-700">Reporte Gerencial (ID: {{ report.id }})</h4>
              <p class="text-xs text-gray-500">Solicitado: {{ formatDate(report.created_at) }}</p>
            </div>
          </div>

          <!-- Progress Bar Section -->
          <div class="flex-grow max-w-md mx-6 w-full" v-if="report.estado === 'pendiente' || report.estado === 'procesando'">
            <div class="flex justify-between text-xs mb-1 font-semibold">
              <span class="text-blue-600">{{ report.estado === 'pendiente' ? 'En cola...' : 'Generando...' }}</span>
              <span class="text-blue-600">{{ report.progreso_porcentaje }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="`width: ${report.progreso_porcentaje}%`"></div>
            </div>
          </div>

          <!-- Failed Section -->
          <div class="flex-grow text-center text-red-500 text-sm font-semibold mx-6" v-else-if="report.estado === 'fallido'">
            <i class="fas fa-exclamation-triangle"></i> Falló: {{ report.error_msg || 'Error desconocido' }}
          </div>

          <!-- Completed Section / Action Buttons -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
            <span v-if="report.estado === 'completado'" class="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm mr-2 hidden sm:inline-block">
              <i class="fas fa-check-circle mr-1"></i> ¡Listo!
            </span>
            
            <button 
              v-if="report.estado === 'completado'"
              @click="downloadReportFile(report.id)"
              class="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm"
            >
              <i class="fas fa-download mr-1"></i> Descargar
            </button>

            <button 
              v-else
              disabled
              class="bg-gray-200 text-gray-400 text-sm font-bold py-2 px-4 rounded-lg cursor-not-allowed"
            >
              <i class="fas fa-hourglass-half mr-1"></i> Procesando
            </button>
          </div>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const isRequesting = ref(false);
const loadingReports = ref(true);
const myReports = ref([]);
let pollingInterval = null;

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
};

// Solicita al backend crear un Job de exportación
const requestSegaCSV = async () => {
  isRequesting.value = true;
  try {
    const response = await api.post('/exportar/seguimiento-csv');
    Swal.fire({
      title: '¡Reporte en Cola!',
      text: 'Tu reporte se ha enviado a procesar. Podrás ver el progreso en tu bandeja inferior. Puedes seguir navegando si lo deseas.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
    // Forzamos actualización inmediata de la bandeja
    fetchMyReports();
  } catch (error) {
    console.error('Error enviando a cola', error);
    Swal.fire('Error', 'No se pudo generar la solicitud del reporte.', 'error');
  } finally {
    isRequesting.value = false;
  }
};

// Consulta a la Base de datos el estado de la cola
const fetchMyReports = async () => {
  try {
    const response = await api.get('/exportar/mis-reportes');
    if (response.data && response.data.success) {
      myReports.value = response.data.data;
    }
  } catch (error) {
    console.error('Error leyendo reportes', error);
  } finally {
    loadingReports.value = false;
  }
};

// Descarga un archivo ya completado
const downloadReportFile = async (id) => {
  try {
    Swal.fire({
      title: 'Descargando...',
      text: 'Preparando archivo local...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const response = await api.get(`/exportar/descargar/${id}`, {
      responseType: 'blob'
    });

    let filename = `Reporte_Expedientes_${id}.csv`;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    Swal.close();
  } catch (error) {
    console.error('Error bajando reporte completado', error);
    Swal.fire('Error', 'El archivo no existe o ya caducó. Genera uno nuevo.', 'error');
  }
};

// Ciclo de vida
onMounted(() => {
  fetchMyReports();
  // Hacer auto-refresh cada 5 segundos para actualizar barras de progreso
  pollingInterval = setInterval(() => {
    // Solo recarga datos silentesamente si hay reportes que no estén listos
    const hasPending = myReports.value.some(r => r.estado === 'pendiente' || r.estado === 'procesando');
    if (hasPending) {
      fetchMyReports();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
