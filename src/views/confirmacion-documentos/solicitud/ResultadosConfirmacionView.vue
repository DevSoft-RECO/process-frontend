<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Resultados de Confirmación</h1>
        <p class="text-sm text-gray-500">Respuestas a sus solicitudes de confirmación</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:flex-initial">
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            placeholder="Buscar ID de confirmación..." 
            class="pl-9 pr-8 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <div class="absolute left-3 top-2.5 text-gray-400 text-sm">
            <i class="fas fa-search"></i>
          </div>
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Limpiar búsqueda"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <button 
          @click="loadResults(pagination.current_page)" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-sm whitespace-nowrap"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
      <div class="overflow-x-auto flex-1">
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
              <div class="text-xs text-gray-500">Fecha: {{ formatDate(res.documento?.fecha || res.fecha) }}</div>
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

      <!-- Paginación -->
      <div class="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ pagination.from ?? 0 }}</span> –
          <span class="font-medium">{{ pagination.to ?? 0 }}</span> de
          <span class="font-medium">{{ pagination.total ?? 0 }}</span> resultados
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.prev_page_url || loading"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded border text-sm transition',
              page === pagination.current_page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.next_page_url || loading"
            class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoYK from '@/assets/logoyk.svg';
import { formatDate, formatDateTime, formatCurrency } from '@/utils/formatters';

const results = ref([]);
const loading = ref(false);
const searchQuery = ref('');

const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
  from: 0,
  to: 0,
  total: 0,
});

// Páginas visibles: máximo 5 alrededor de la actual
const visiblePages = computed(() => {
  const total   = pagination.value.last_page;
  const current = pagination.value.current_page;
  const delta   = 2;
  const range   = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i);
  }
  return range;
});

const loadResults = async (page = 1) => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos/resultados', { 
            params: { 
                page, 
                search: searchQuery.value 
            } 
        });
        const res = response.data;
        results.value = res.data;
        pagination.value = {
          current_page:   res.current_page,
          last_page:      res.last_page,
          prev_page_url:  res.prev_page_url,
          next_page_url:  res.next_page_url,
          from:           res.from,
          to:             res.to,
          total:          res.total,
        };
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar resultados', 'error');
    } finally {
        loading.value = false;
    }
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return;
  loadResults(page);
};

const handleSearch = () => {
    loadResults(1);
};

const clearSearch = () => {
    searchQuery.value = '';
    loadResults(1);
};

// Helper function to load image and return as canvas/dataURL for better compatibility
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size respecting aspect ratio (High Resolution)
            const scaleFactor = 4; // To keep quality high
            canvas.width = (img.width || 300) * scaleFactor;
            canvas.height = (img.height || 100) * scaleFactor;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve({
                data: canvas.toDataURL('image/png'),
                ratio: canvas.width / canvas.height
            });
        };
        img.onerror = (e) => reject(e);
    });
};

const downloadPDF = async (res) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    try {
        // --- Branding Top ---
        let textStartX = 20; // Default if logo fails
        try {
            const logoObj = await loadImage(logoYK);
            const logoH = 15;
            const logoW = logoH * logoObj.ratio;
            doc.addImage(logoObj.data, 'PNG', 20, 14, logoW, logoH);
            textStartX = 20 + logoW + 8; // Start text 8mm after logo
        } catch (e) {
            console.error("Error loading logo for PDF:", e);
        }

        doc.setTextColor(0, 48, 96); // Navy blue
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('COOPERATIVA YAMAN KUTX', textStartX, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Departamento de Archivo', textStartX, 26);
        doc.text('Sistema SADEC - Constancia Oficial', textStartX, 31);

        // --- Header Banner ---
        const primaryColor = [0, 48, 96]; // Azul Marino (Navy Blue)
        const accentColor = res.confirmacion === 'SI' ? [16, 185, 129] : [239, 68, 68]; // Green or Red
        
        // Top Banner
        doc.setFillColor(...primaryColor);
        doc.rect(0, 40, pageWidth, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`CONSTANCIA DE CONFIRMACIÓN #${res.id}`, centerX, 50, { align: 'center' });

        // --- Details Section ---
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLES DE LA VERIFICACIÓN', 20, 68);
        doc.line(20, 70, pageWidth - 20, 70);

        const confirmationDate = res.fecha_confirmacion ? formatDateTime(res.fecha_confirmacion) : '-';
        
        autoTable(doc, {
            startY: 75,
            margin: { left: 20, right: 20 },
            theme: 'plain',
            body: [
                ['Fecha Emisión:', formatDate(res.documento?.fecha || res.fecha), 'Fecha Validación:', confirmationDate],
                ['Documento No.:', res.numero, 'Tipo Documento:', res.tipo_documento || '-'],
                ['Registro:', res.registro_propiedad || '-', 'Referencia:', res.referencia || '-'],
                ['Propietario / Titular:', res.propietario || '-', '', ''],
                ['Autorizador / Notario:', res.autorizador || '-', '', ''],
            ],
            bodyStyles: { fontSize: 9, cellPadding: 2.5 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { fontStyle: 'bold', cellWidth: 35 },
                3: { cellWidth: 50 }
            }
        });

        // --- Result Box ---
        const finalY = doc.lastAutoTable.finalY + 12;
        
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(1);
        doc.roundedRect(40, finalY, 130, 35, 3, 3, 'D');
        
        const bgColor = res.confirmacion === 'SI' ? [240, 253, 244] : [254, 242, 242];
        doc.setFillColor(...bgColor);
        doc.roundedRect(40.5, finalY + 0.5, 129, 34, 3, 3, 'F');

        doc.setTextColor(...accentColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('RESULTADO FINAL:', centerX, finalY + 10, { align: 'center' });

        doc.setFontSize(28);
        const resultText = res.confirmacion === 'SI' ? 'EXISTE' : 'NO EXISTE';
        doc.text(resultText, centerX, finalY + 25, { align: 'center' });

        // --- Observations ---
        let currentY = finalY + 45;

        // Document Observation
        const docObs = res.documento?.observacion || res.observacion;
        if (docObs) {
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('OBSERVACIÓN DE LA GARANTÍA:', 20, currentY);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            const splitTextDoc = doc.splitTextToSize(docObs, pageWidth - 40);
            doc.text(splitTextDoc, 20, currentY + 7);
            
            // Advance currentY based on text lines (approx 4mm per line + spacing)
            currentY += 7 + (splitTextDoc.length * 4) + 6;
        }

        // Additional Confirmation Observation
        if (res.observacion_confirmacion) {
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('OBSERVACIONES ADICIONALES DE CONFIRMACIÓN:', 20, currentY);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            const splitText = doc.splitTextToSize(res.observacion_confirmacion, pageWidth - 40);
            doc.text(splitText, 20, currentY + 7);
        }

        // --- Footer ---
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        const footerText = 'Esta constancia es para uso interno de la Cooperativa Yaman Kutx. La información contenida refleja el estado de la verificación al momento de su emisión.';
        const splitFooter = doc.splitTextToSize(footerText, pageWidth - 50);
        doc.text(splitFooter, centerX, pageHeight - 25, { align: 'center' });
        doc.text('SADEC - Generado el: ' + new Date().toLocaleString(), centerX, pageHeight - 15, { align: 'center' });

        // Download
        doc.save(`Constancia_Confirmacion_${res.id}.pdf`);
    } catch (e) {
        console.error("PDF Error:", e);
        Swal.fire('Error', 'No se pudo generar el PDF. Intente de nuevo.', 'error');
    }
};

onMounted(() => {
    loadResults();
});
</script>
