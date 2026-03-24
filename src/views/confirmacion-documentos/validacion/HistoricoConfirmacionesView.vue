<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Histórico de Confirmaciones</h1>
        <p class="text-sm text-gray-500">Bitácora de documentos validados por usted</p>
      </div>
      <div>
        <button 
          @click="loadHistory" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expediente</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datos Registrales</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">Cargando histórico...</td>
            </tr>
            <tr v-else-if="history.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No hay documentos en el histórico.</td>
            </tr>
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50">
              <!-- Col 1: Documento -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-sm font-bold text-gray-900">No. {{ item.numero }}</div>
                <div class="text-xs text-gray-500">Fecha: {{ formatDate(item.fecha) }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ item.tipo_documento }}</div>
                <div class="text-xs text-gray-400">{{ item.registro_propiedad }}</div>
              </td>

              <!-- Col 2: Identificacion -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-xs text-gray-900"><span class="font-semibold">Prop:</span> {{ item.propietario || '-' }}</div>
                <div class="text-xs text-gray-900"><span class="font-semibold">Aut:</span> {{ item.autorizador || '-' }}</div>
                <div class="text-xs text-gray-500 mt-1">Ref: {{ item.referencia || '-' }}</div>
                <div class="text-xs text-gray-500">Monto: {{ item.monto_poliza ? 'Q ' + item.monto_poliza : '-' }}</div>
              </td>

              <!-- Col 3: Solicitante -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-sm font-medium text-gray-900">{{ item.nombre_solicitante || item.user?.name || '-' }}</div>
                <div class="text-xs text-gray-400 mt-0.5">
                  <i class="fas fa-building mr-1"></i>Agencia: {{ item.id_agencia || '-' }}
                </div>
              </td>

              <!-- Col 4: Expediente -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-xs text-gray-700">
                  <span class="font-semibold text-gray-500">Cód. Cliente:</span>
                  <span class="ml-1 font-mono">{{ item.codigo_cliente || '-' }}</span>
                </div>
                <div class="text-xs text-gray-700 mt-0.5">
                  <span class="font-semibold text-gray-500">No. Producto:</span>
                  <span class="ml-1 font-mono">{{ item.numero_producto || '-' }}</span>
                </div>
              </td>

              <!-- Col 5: Datos Registrales -->
              <td class="px-6 py-4 whitespace-nowrap align-top text-center">
                <button 
                  @click="showDocumentData(item.documento)"
                  class="text-blue-500 hover:text-blue-700 transition p-2 bg-blue-50 rounded-full hover:bg-blue-100"
                  title="Ver datos del documento registrado"
                >
                  <i class="fas fa-info-circle fa-lg"></i>
                </button>
              </td>

              <!-- Col 6: Observaciones -->
              <td class="px-6 py-4 text-sm text-gray-500 align-top">
                  <div class="mb-2">
                      <span class="text-xs font-semibold text-gray-400 uppercase">Solicitud:</span>
                      <p class="text-xs text-gray-600 italic whitespace-normal max-w-xs">{{ item.observacion || '(Sin obs)' }}</p>
                  </div>
                  <div>
                      <span class="text-xs font-semibold text-gray-400 uppercase">Respuesta:</span>
                      <p class="text-xs text-gray-800 font-medium whitespace-normal max-w-xs">{{ item.observacion_confirmacion || '-' }}</p>
                  </div>
              </td>

              <!-- Col 7: Resultado -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="flex flex-col items-start gap-1">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="item.confirmacion === 'SI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ item.confirmacion === 'SI' ? 'EXISTE' : 'NO EXISTE' }}
                    </span>
                    <span class="text-xs text-gray-400 mt-1">
                      {{ formatDateTime(item.fecha_confirmacion) }}
                    </span>
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
          <span class="font-medium">{{ pagination.total ?? 0 }}</span> registros
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
import { formatDate, formatDateTime } from '@/utils/formatters';

const history = ref([]);
const loading = ref(false);

const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
  from: 0,
  to: 0,
  total: 0,
});

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

const loadHistory = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api.get('/confirmacion-documentos/historico', { params: { page } });
    const res = response.data;
    history.value    = res.data;
    pagination.value = {
      current_page:  res.current_page,
      last_page:     res.last_page,
      prev_page_url: res.prev_page_url,
      next_page_url: res.next_page_url,
      from:          res.from,
      to:            res.to,
      total:         res.total,
    };
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Error al cargar histórico', 'error');
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return;
  loadHistory(page);
};

const showDocumentData = (documento) => {
  if (!documento) {
    Swal.fire('Atención', 'No hay datos del documento disponibles.', 'info');
    return;
  }

  const tipoDoc = documento.tipo_documento?.nombre || 'Documento';
  
  const htmlContent = `
    <div class="text-left text-sm space-y-4 mt-2">
      <div class="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3">
        <div><span class="text-gray-500 font-semibold block text-xs uppercase">Tipo Documento</span><span class="text-gray-800">${tipoDoc}</span></div>
        <div><span class="text-gray-500 font-semibold block text-xs uppercase">Número</span><span class="text-gray-800">${documento.numero || '-'}</span></div>
        <div class="col-span-2"><span class="text-gray-500 font-semibold block text-xs uppercase">Fecha</span><span class="text-gray-800">${formatDate(documento.fecha)}</span></div>
      </div>
      
      <div class="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3">
        <div class="col-span-2"><span class="text-gray-500 font-semibold block text-xs uppercase">Propietario</span><span class="text-gray-800">${documento.propietario || '-'}</span></div>
        <div><span class="text-gray-500 font-semibold block text-xs uppercase">Autorizador</span><span class="text-gray-800">${documento.autorizador || '-'}</span></div>
        <div><span class="text-gray-500 font-semibold block text-xs uppercase">Referencia</span><span class="text-gray-800">${documento.referencia || '-'}</span></div>
        <div class="col-span-2"><span class="text-gray-500 font-semibold block text-xs uppercase">Monto Póliza</span><span class="text-gray-800">${documento.monto_poliza ? 'Q ' + documento.monto_poliza : '-'}</span></div>
      </div>
      
      <div class="border-b border-gray-100 pb-3">
        <span class="text-gray-500 font-semibold block text-xs uppercase mb-2">Datos Registrales</span>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="bg-gray-50 p-2 rounded border border-gray-200"><span class="text-xs text-gray-500 block mb-1">Finca</span><span class="font-bold text-gray-800">${documento.no_finca || '-'}</span></div>
          <div class="bg-gray-50 p-2 rounded border border-gray-200"><span class="text-xs text-gray-500 block mb-1">Folio</span><span class="font-bold text-gray-800">${documento.folio || '-'}</span></div>
          <div class="bg-gray-50 p-2 rounded border border-gray-200"><span class="text-xs text-gray-500 block mb-1">Libro</span><span class="font-bold text-gray-800">${documento.libro || '-'}</span></div>
          <div class="bg-gray-50 p-2 rounded border border-gray-200"><span class="text-xs text-gray-500 block mb-1">Dominio</span><span class="font-bold text-gray-800">${documento.no_dominio || '-'}</span></div>
        </div>
      </div>
      
      <div>
        <span class="text-gray-500 font-semibold block text-xs uppercase mb-1">Observaciones del documento</span>
        <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-gray-700 italic text-xs">
          ${documento.observacion || 'Sin observaciones'}
        </div>
      </div>
    </div>
  `;

  Swal.fire({
    title: '<div class="flex items-center"><i class="fas fa-file-alt text-blue-500 mr-2"></i> <span>Datos del Documento Registrado</span></div>',
    html: htmlContent,
    width: '600px',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-xl shadow-xl',
      title: 'text-lg font-bold text-gray-800 w-full text-left',
      closeButton: 'focus:outline-none'
    }
  });
};

onMounted(() => loadHistory());
</script>
