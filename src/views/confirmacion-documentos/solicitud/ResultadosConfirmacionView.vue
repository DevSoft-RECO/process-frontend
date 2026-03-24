<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Resultados de Confirmación</h1>
        <p class="text-sm text-gray-500">Respuestas a sus solicitudes de confirmación</p>
      </div>
      <div>
        <button 
          @click="loadResults" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-auto flex-1 h-[0px]">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de confirmacion</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datos Registrales</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">Cargando resultados...</td>
          </tr>
          <tr v-else-if="results.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No hay documentos validados.</td>
          </tr>
          <tr v-for="res in results" :key="res.id" class="hover:bg-gray-50">
            <!-- Col 0: ID -->
            <td class="px-6 py-4 whitespace-nowrap align-top text-sm font-bold text-gray-700">
              #{{ res.id }}
            </td>

            <!-- Col 1: Documento -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-sm font-bold text-gray-900">No. {{ res.numero }}</div>
              <div class="text-xs text-gray-500">Fecha: {{ formatDate(res.fecha) }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ res.tipo_documento }}</div>
              <div class="text-xs text-gray-400">{{ res.registro_propiedad }}</div>
            </td>

            <!-- Col 2: Identificacion -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-xs text-gray-900"><span class="font-semibold">Prop:</span> {{ res.propietario || '-' }}</div>
              <div class="text-xs text-gray-900"><span class="font-semibold">Aut:</span> {{ res.autorizador || '-' }}</div>
              <div class="text-xs text-gray-500 mt-1">Ref: {{ res.referencia || '-' }}</div>
              <div class="text-xs text-gray-500">Monto: {{ res.monto_poliza ? 'Q ' + res.monto_poliza : '-' }}</div>
            </td>

            <!-- Col 3: Datos Registrales -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="text-xs text-gray-600">
                <span class="font-semibold">F:</span> {{ res.no_finca || '-' }} &nbsp;|&nbsp; 
                <span class="font-semibold">F:</span> {{ res.folio || '-' }}
              </div>
              <div class="text-xs text-gray-600">
                <span class="font-semibold">L:</span> {{ res.libro || '-' }} &nbsp;|&nbsp; 
                <span class="font-semibold">D:</span> {{ res.no_dominio || '-' }}
              </div>
            </td>

            <!-- Col 4: Observaciones & Asociaciones -->
            <td class="px-6 py-4 text-sm text-gray-500 align-top">
                <div class="mb-2">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Observacion Documento:</span>
                    <p class="text-xs text-gray-600 italic whitespace-normal max-w-xs">{{ res.observacion || '(Sin obs)' }}</p>
                </div>
                <div class="mb-2">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Respuesta de Confirmacion:</span>
                    <p class="text-xs text-gray-800 font-medium whitespace-normal max-w-xs">
                        {{ res.observacion_confirmacion || (res.confirmacion ? '-' : 'En proceso...') }}
                    </p>
                </div>
                <!-- Mostrar nuevos expedientes asociados si existen y ya hay confirmación -->
                <div v-if="res.confirmacion && res.documento && res.documento.nuevos_expedientes && res.documento.nuevos_expedientes.length > 0">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-semibold text-blue-500 uppercase">Expedientes Asociados ({{ res.documento.nuevos_expedientes.length }}):</span>
                        <span class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200" title="Información en Tiempo Real">Tiempo Real</span>
                    </div>
                    <ul class="mt-1 space-y-1">
                      <li v-for="exp in res.documento.nuevos_expedientes" :key="exp.id" class="text-xs bg-blue-50 p-1.5 rounded border border-blue-100">
                        <div class="font-medium text-blue-700">Exp: {{ exp.numero_documento }}</div>
                        <div class="text-blue-600">{{ exp.nombre_asociado }}</div>
                      </li>
                    </ul>
                </div>
                <div v-else-if="res.confirmacion && res.documento">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Expedientes Asociados:</span>
                    <p class="text-xs text-gray-500 italic">No hay expedientes asociados.</p>
                </div>
            </td>

            <!-- Col 5: Resultado -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <div class="flex flex-col items-start gap-1">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                        'bg-green-100 text-green-800': res.confirmacion === 'SI',
                        'bg-red-100 text-red-800': res.confirmacion === 'NO',
                        'bg-yellow-100 text-yellow-800': !res.confirmacion
                    }"
                  >
                    {{ res.confirmacion === 'SI' ? 'EXISTE' : (res.confirmacion === 'NO' ? 'NO EXISTE' : 'PENDIENTE') }}
                  </span>
                  <span class="text-xs text-gray-400 mt-1">
                    {{ res.fecha_confirmacion ? formatDateTime(res.fecha_confirmacion) : '-' }}
                  </span>
                  
                  <!-- PDF Button -->
                  <button v-if="res.confirmacion"
                    @click="downloadPDF(res)"
                    class="mt-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded transition font-bold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    DESCARGAR CONSTANCIA
                  </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const results = ref([]);
const loading = ref(false);

const loadResults = async () => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos/resultados');
        results.value = response.data.data;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar resultados', 'error');
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Si la fecha viene como YYYY-MM-DD (10 caracteres), forzar hora local
    if (dateString.length === 10) {
        return new Date(dateString + 'T00:00:00').toLocaleDateString();
    }
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString();
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const downloadPDF = (res) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    // --- Header / Branding ---
    const primaryColor = [31, 41, 55]; // Dark Gray
    const accentColor = res.confirmacion === 'SI' ? [16, 185, 129] : [239, 68, 68]; // Green or Red
    
    // Top Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CONSTANCIA DE CONFIRMACIÓN', 105, 22, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const systemName = 'SISTEMA SADEC - DEPARTAMENTO DE ARCHIVO';
    doc.text(systemName, 105, 30, { align: 'center' });

    // --- Details Section ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE LA SOLICITUD', 20, 55);
    doc.line(20, 57, 190, 57);

    const confirmationDate = res.fecha_confirmacion ? formatDateTime(res.fecha_confirmacion) : '-';
    
    autoTable(doc, {
        startY: 62,
        margin: { left: 20, right: 20 },
        theme: 'plain',
        body: [
            ['ID de Confirmación:', `#${res.id}`, 'Fecha Proceso:', confirmationDate],
            ['Documento No.:', res.numero, 'Tipo Documento:', res.tipo_documento || '-'],
            ['Registro:', res.registro_propiedad || '-', 'Referencia:', res.referencia || '-'],
            ['Propietario / Titular:', res.propietario || '-', '', ''],
            ['Autorizador / Notario:', res.autorizador || '-', '', ''],
        ],
        bodyStyles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 50 },
            2: { fontStyle: 'bold', cellWidth: 35 },
            3: { cellWidth: 50 }
        }
    });

    // --- Result Box (The most important part) ---
    const finalY = doc.lastAutoTable.finalY + 15;
    
    // Outer Border
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1);
    doc.roundedRect(40, finalY, 130, 35, 3, 3, 'D');
    
    // Background light shade
    const bgColor = res.confirmacion === 'SI' ? [240, 253, 244] : [254, 242, 242];
    doc.setFillColor(...bgColor);
    doc.roundedRect(40.5, finalY + 0.5, 129, 34, 3, 3, 'F');

    // Title inside box
    doc.setTextColor(...accentColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADO DE LA VERIFICACIÓN:', 105, finalY + 10, { align: 'center' });

    // Result Value
    doc.setFontSize(28);
    const resultText = res.confirmacion === 'SI' ? 'EXISTE' : 'NO EXISTE';
    doc.text(resultText, 105, finalY + 25, { align: 'center' });

    // --- Observations ---
    if (res.observacion_confirmacion) {
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES DE CONFIRMACIÓN:', 20, finalY + 55);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const splitText = doc.splitTextToSize(res.observacion_confirmacion, 170);
        doc.text(splitText, 20, finalY + 62);
    }

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Esta es una constancia generada automáticamente por el sistema.', 105, pageHeight - 20, { align: 'center' });
    doc.text('SADEC - ' + new Date().toLocaleString(), 105, pageHeight - 15, { align: 'center' });

    // Download
    doc.save(`Constancia_Confirmacion_${res.id}.pdf`);
};

onMounted(() => {
    loadResults();
});
</script>
