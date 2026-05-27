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
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col border border-slate-200">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-slate-200 table-auto">
        <thead class="bg-slate-50/70 border-b border-slate-200">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Confirmación</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Documento</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Identificación</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Datos Registrales</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Observaciones</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Resultado</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-100">
          <!-- Loader row -->
          <tr v-if="loading">
              <td colspan="6" class="px-6 py-16 text-center text-slate-500">
                  <div class="flex flex-col items-center justify-center space-y-3">
                      <div class="text-3xl text-blue-600 animate-spin">
                          <i class="fas fa-spinner"></i>
                      </div>
                      <p class="text-xs text-slate-500 font-medium">Sincronizando información con SADEC...</p>
                  </div>
              </td>
          </tr>
          <!-- Empty State row -->
          <tr v-else-if="results.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  <div class="flex flex-col items-center justify-center space-y-4">
                      <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl border border-slate-200/60 shadow-inner">
                          <i class="fas fa-folder-open"></i>
                      </div>
                      <div>
                          <p class="font-bold text-slate-700 text-sm">No se encontraron registros</p>
                          <p class="text-xs text-slate-400 mt-1">No hay solicitudes validadas o que coincidan con la búsqueda.</p>
                      </div>
                      <button 
                        @click="clearSearch" 
                        v-if="searchQuery"
                        class="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all duration-150"
                      >
                        Limpiar Filtro
                      </button>
                  </div>
              </td>
          </tr>
          <!-- Table Row Loop -->
          <tr v-for="res in results" :key="res.id" class="hover:bg-slate-50/50 transition-colors duration-150">
            <!-- Col 0: ID -->
            <td class="px-6 py-4 whitespace-nowrap align-top">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                ID: {{ res.id }}
              </span>
            </td>

            <!-- Col 1: Documento -->
            <td class="px-6 py-4 align-top">
              <div class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <i class="far fa-file-alt text-slate-400"></i> No. {{ res.numero }}
              </div>
              <div class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <i class="far fa-calendar text-[10px]"></i> Fecha: {{ formatDate(res.documento?.fecha || res.fecha) }}
              </div>
              <div class="mt-2.5">
                <div class="text-[10px] font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100/60 inline-block uppercase tracking-wide">
                  {{ res.tipo_documento || 'No especificado' }}
                </div>
              </div>
              <div class="text-[11px] text-slate-400 mt-1.5 truncate max-w-[190px]" :title="res.registro_propiedad">
                <i class="fas fa-landmark text-[9px] mr-1 text-slate-300"></i>{{ res.registro_propiedad || '-' }}
              </div>
            </td>

            <!-- Col 2: Identificacion -->
            <td class="px-6 py-4 align-top">
              <div class="text-xs text-slate-700 flex items-center gap-1.5 mb-1" :title="res.propietario">
                <i class="far fa-user text-slate-400 w-3.5 text-center"></i>
                <span class="font-medium truncate max-w-[155px]">{{ res.propietario || '-' }}</span>
              </div>
              <div class="text-xs text-slate-700 flex items-center gap-1.5 mb-1.5" :title="res.autorizador">
                <i class="fas fa-pen-nib text-slate-400 w-3.5 text-[10px] text-center"></i>
                <span class="truncate max-w-[155px]">{{ res.autorizador || '-' }}</span>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center gap-1 mb-1.5">
                <span class="text-slate-400">Ref:</span>
                <span class="font-mono bg-slate-50 px-1 py-0.2 rounded border border-slate-100 text-slate-600">{{ res.referencia || '-' }}</span>
              </div>
              <div>
                <span v-if="res.monto_poliza" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Q {{ res.monto_poliza }}
                </span>
                <span v-else class="text-slate-400 italic text-[11px]">-</span>
              </div>
            </td>

            <!-- Col 3: Datos Registrales -->
            <td class="px-6 py-4 align-top select-none">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1">
                  <span class="text-[10px] font-bold text-slate-400 w-4">F:</span>
                  <span class="text-xs font-mono bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80" title="Finca">{{ res.no_finca || '-' }}</span>
                  <span class="text-[10px] font-bold text-slate-400 ml-1.5 w-4">F:</span>
                  <span class="text-xs font-mono bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80" title="Folio">{{ res.folio || '-' }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-[10px] font-bold text-slate-400 w-4">L:</span>
                  <span class="text-xs font-mono bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80" title="Libro">{{ res.libro || '-' }}</span>
                  <span class="text-[10px] font-bold text-slate-400 ml-1.5 w-4">D:</span>
                  <span class="text-xs font-mono bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80" title="Dominio">{{ res.no_dominio || '-' }}</span>
                </div>
              </div>
            </td>

            <!-- Col 4: Observaciones & Asociaciones -->
            <td class="px-6 py-4 align-top text-sm text-slate-500">
              <div class="flex flex-col gap-2 max-w-xs">
                <!-- Observacion Documento -->
                <div class="bg-slate-50 p-2 rounded border border-slate-100 shadow-sm/5">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Observación del Documento:</span>
                    <p class="text-xs text-slate-600 italic whitespace-normal leading-relaxed">
                      <i class="far fa-comment-alt mr-1 text-slate-400"></i>{{ res.observacion || '(Sin observaciones)' }}
                    </p>
                </div>
                <!-- Respuesta de Confirmacion -->
                <div class="bg-blue-50/45 p-2 rounded border border-blue-100/50" v-if="res.observacion_confirmacion || res.confirmacion">
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">Respuesta de Confirmación:</span>
                    <p class="text-xs text-slate-800 font-medium whitespace-normal leading-relaxed">
                      <i class="fas fa-reply mr-1 text-blue-400"></i>{{ res.observacion_confirmacion || '-' }}
                    </p>
                </div>
                
                <!-- Expedientes asociados (En tiempo real) -->
                <div v-if="res.confirmacion && res.documento && res.documento.nuevos_expedientes && res.documento.nuevos_expedientes.length > 0" class="mt-1">
                    <div class="flex items-center justify-between bg-emerald-50 px-2.5 py-1 rounded-t border-t border-x border-emerald-200">
                        <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Asociados ({{ res.documento.nuevos_expedientes.length }})</span>
                        <span class="text-[9px] bg-emerald-200 text-emerald-800 font-bold px-1 rounded animate-pulse">En Línea</span>
                    </div>
                    <ul class="divide-y divide-emerald-100 bg-white border-x border-b border-emerald-200 rounded-b overflow-hidden shadow-sm">
                      <li v-for="exp in res.documento.nuevos_expedientes" :key="exp.id" class="px-2.5 py-1.5 text-xs hover:bg-emerald-50/20 transition-colors">
                        <div class="font-bold text-emerald-800 font-mono text-[10px]"><i class="fas fa-folder-open text-emerald-500 mr-1"></i>Exp: {{ exp.numero_documento }}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5 truncate pl-3.5" :title="exp.nombre_asociado">{{ exp.nombre_asociado }}</div>
                      </li>
                    </ul>
                </div>
                <div v-else-if="res.confirmacion && res.documento" class="text-[11px] text-slate-400 italic pl-1 mt-1">
                    <i class="fas fa-info-circle mr-1 text-slate-300"></i>Sin expedientes asociados.
                </div>
              </div>
            </td>

            <!-- Col 5: Resultado -->
            <td class="px-6 py-4 align-top">
              <div class="flex flex-col items-start gap-2.5">
                  <span 
                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm select-none"
                    :class="{
                        'bg-emerald-100 text-emerald-800 border-emerald-200': res.confirmacion === 'SI',
                        'bg-rose-100 text-rose-800 border-rose-200': res.confirmacion === 'NO',
                        'bg-amber-100 text-amber-800 border-amber-200': !res.confirmacion
                    }"
                  >
                    <i class="fas mr-1 text-[9px]" :class="{
                      'fa-check-circle': res.confirmacion === 'SI',
                      'fa-times-circle': res.confirmacion === 'NO',
                      'fa-clock': !res.confirmacion
                    }"></i>
                    {{ res.confirmacion === 'SI' ? 'EXISTE' : (res.confirmacion === 'NO' ? 'NO EXISTE' : 'PENDIENTE') }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium pl-1 flex items-center gap-1">
                    <i class="far fa-clock text-[9px]"></i>
                    {{ res.fecha_confirmacion ? formatDateTime(res.fecha_confirmacion) : 'En espera' }}
                  </span>
                  
                  <!-- PDF Button -->
                  <button v-if="res.confirmacion"
                    @click="downloadPDF(res)"
                    class="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded shadow-sm transition-all duration-150 font-bold"
                  >
                    <i class="far fa-file-pdf text-[11px]"></i>
                    CONSTANCIA
                  </button>
              </div>
            </td>
          </tr>
        </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div class="text-sm text-slate-500">
          Mostrando <span class="font-semibold text-slate-700">{{ pagination.from ?? 0 }}</span> al
          <span class="font-semibold text-slate-700">{{ pagination.to ?? 0 }}</span> de
          <span class="font-semibold text-slate-700">{{ pagination.total ?? 0 }}</span> registros
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!pagination.prev_page_url || loading"
            class="px-2.5 py-1.5 rounded border border-slate-200 text-xs font-medium bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-slate-600 transition"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1.5 rounded border text-xs font-semibold transition',
              page === pagination.current_page
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!pagination.next_page_url || loading"
            class="px-2.5 py-1.5 rounded border border-slate-200 text-xs font-medium bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-slate-600 transition"
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
