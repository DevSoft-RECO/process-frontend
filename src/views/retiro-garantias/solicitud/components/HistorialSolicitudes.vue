<template>
  <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex-1 overflow-hidden flex flex-col space-y-4 transition-all duration-300">
    <!-- Header with Tabs and Sync Button -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-800 pb-3 gap-4">
      <div class="flex bg-gray-100/70 dark:bg-gray-800/60 p-1 rounded-xl">
        <button 
          @click="$emit('update-tab', 'sent')"
          class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
          :class="activeTab === 'sent' ? 'bg-white dark:bg-gray-750 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-450 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Mis Solicitudes
        </button>
        <button 
          @click="$emit('update-tab', 'received')"
          class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
          :class="activeTab === 'received' ? 'bg-white dark:bg-gray-750 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-450 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Solicitudes Recibidas
        </button>
      </div>
      
      <button 
        @click="refreshList" 
        class="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
      >
        <i class="fas fa-sync" :class="{ 'animate-spin': loadingHistory || loadingIncoming }"></i>
        <span>Actualizar</span>
      </button>
    </div>
    
    <!-- MIS SOLICITUDES (SENT TAB) -->
    <div v-if="activeTab === 'sent'" class="flex-1 overflow-hidden flex flex-col">
      <!-- Sub-tabs for Sent Requests -->
      <div class="flex space-x-2 pb-3 border-b border-gray-50 dark:border-gray-800">
        <button 
          v-for="filterOpt in ['all', 'Temporal', 'Definitivo']"
          :key="filterOpt"
          @click="$emit('update-sent-filter', filterOpt)" 
          class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
          :class="sentFilter === filterOpt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          {{ filterOpt === 'all' ? 'Todos' : filterOpt === 'Temporal' ? 'Enviados Temporales' : 'Enviados Definitivos' }}
        </button>
      </div>

      <!-- Table Container -->
      <div class="flex-1 overflow-auto border border-gray-100 dark:border-gray-805 rounded-xl mt-4">
        <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead class="bg-gray-50/70 dark:bg-gray-800/40 sticky top-0 backdrop-blur-md">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Fecha Despacho</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="loadingHistory">
              <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                <i class="fas fa-circle-notch animate-spin text-blue-500 mr-2 text-sm"></i> Cargando historial...
              </td>
            </tr>
            <tr v-else-if="filteredHistory.length === 0">
              <td colspan="7" class="px-5 py-8 text-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                No hay solicitudes registradas con este filtro.
              </td>
            </tr>
            <tr v-for="item in filteredHistory" :key="item.id" class="hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all duration-150">
              <td class="px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-800 dark:text-gray-200">#{{ item.id }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">{{ formatDate(item.fecha_solicitud) }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-800 dark:text-gray-200">
                <div class="font-bold text-gray-700 dark:text-gray-300">{{ item.numero_documento }}</div>
                <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center" v-if="item.fecha_documento">
                  <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(item.fecha_documento) }}
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 font-medium">{{ item.titulo_nombre }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs">
                <span 
                  class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold"
                  :class="item.tipo_retiro === 'Definitivo' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'"
                >
                  {{ item.tipo_retiro }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-xs">
                <span :class="getStatusClass(item.estado_actual)" class="px-2 py-1 inline-flex text-[10px] font-bold rounded-full">
                  {{ getStatusLabel(item.estado_actual) }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ item.fecha_envio ? formatDate(item.fecha_envio) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Sent) -->
      <div v-if="lastPage > 1" class="bg-gray-50/50 dark:bg-gray-850 px-5 py-3 border border-gray-100 dark:border-gray-800 rounded-xl mt-4 flex items-center justify-between">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Mostrando página <span class="font-bold text-gray-700 dark:text-gray-300">{{ currentPage }}</span> de <span class="font-bold text-gray-700 dark:text-gray-300">{{ lastPage }}</span>
              (<span class="font-bold text-gray-700 dark:text-gray-300">{{ totalHistory }}</span> resultados totales)
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="$emit('load-history', currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="$emit('load-history', currentPage + 1)"
                :disabled="currentPage === lastPage"
                class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Mobile Pagination -->
        <div class="flex items-center justify-between sm:hidden w-full">
          <button 
            @click="$emit('load-history', currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-lg text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            Anterior
          </button>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            {{ currentPage }} / {{ lastPage }}
          </span>
          <button 
            @click="$emit('load-history', currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="relative inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-lg text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
    
    <!-- SOLICITUDES RECIBIDAS (RECEIVED TAB) -->
    <div v-if="activeTab === 'received'" class="flex-1 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-auto border border-gray-100 dark:border-gray-805 rounded-xl">
        <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead class="bg-gray-50/70 dark:bg-gray-800/40 sticky top-0 backdrop-blur-md">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Fecha Envío</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Origen (Agencia)</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="loadingIncoming">
              <td colspan="8" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                <i class="fas fa-circle-notch animate-spin text-blue-500 mr-2 text-sm"></i> Cargando solicitudes recibidas...
              </td>
            </tr>
            <tr v-else-if="incomingRequests.length === 0">
              <td colspan="8" class="px-5 py-8 text-center text-gray-400 dark:text-gray-500 text-xs font-medium">
                No ha recibido solicitudes de otras agencias.
              </td>
            </tr>
            <tr v-for="item in incomingRequests" :key="item.id" class="hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all duration-150">
              <td class="px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-800 dark:text-gray-200">#{{ item.id }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">{{ formatDate(item.fecha_envio) }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-800 dark:text-gray-200 font-bold">{{ item.agencia?.nombre || 'N/A' }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 font-medium">{{ item.solicitante?.name || 'N/A' }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-800 dark:text-gray-200">
                <div class="font-bold text-gray-700 dark:text-gray-300">{{ item.numero_documento }}</div>
                <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center" v-if="item.fecha_documento">
                  <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(item.fecha_documento) }}
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 font-medium">{{ item.titulo_nombre }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-xs">
                <span :class="getStatusClass(item.estado_actual)" class="px-2 py-1 inline-flex text-[10px] font-bold rounded-full">
                  <span v-if="item.estado_actual === 2">Recibido Temporal</span>
                  <span v-else-if="item.estado_actual === 3">Recibido Definitivo</span>
                  <span v-else>{{ getStatusLabel(item.estado_actual) }}</span>
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 font-semibold space-x-1">
                <button 
                  v-if="[2, 3].includes(item.estado_actual)"
                  @click="$emit('confirm-receipt', item)"
                  class="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-emerald-200 dark:border-emerald-900/30 transition-all duration-150 inline-flex items-center space-x-1 shadow-sm shadow-emerald-500/5 hover:shadow-emerald-500/10 active:scale-97"
                  title="Confirmar Recepción Física"
                >
                  <i class="fas fa-check-circle"></i>
                  <span>Recibir</span>
                </button>
                
                <button 
                  v-if="item.estado_actual === 4 && item.tipo_retiro === 'Temporal'"
                  @click="$emit('return-archive', item)"
                  class="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-350 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-gray-200 dark:border-gray-700 transition-all duration-150 inline-flex items-center space-x-1 active:scale-97"
                  title="Reingresar al Archivo (Devolución)"
                >
                  <i class="fas fa-archive"></i>
                  <span>Reingresar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Incoming) -->
      <div v-if="lastPageIncoming > 1" class="bg-gray-50/50 dark:bg-gray-850 px-5 py-3 border border-gray-100 dark:border-gray-800 rounded-xl mt-4 flex items-center justify-between">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Página <span class="font-bold text-gray-700 dark:text-gray-300">{{ currentPageIncoming }}</span> de <span class="font-bold text-gray-700 dark:text-gray-300">{{ lastPageIncoming }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="$emit('load-incoming', currentPageIncoming - 1)"
                :disabled="currentPageIncoming === 1"
                class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="$emit('load-incoming', currentPageIncoming + 1)"
                :disabled="currentPageIncoming === lastPageIncoming"
                class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  sentFilter: {
    type: String,
    required: true
  },
  history: {
    type: Array,
    required: true
  },
  incomingRequests: {
    type: Array,
    required: true
  },
  loadingHistory: {
    type: Boolean,
    default: false
  },
  loadingIncoming: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  lastPage: {
    type: Number,
    default: 1
  },
  totalHistory: {
    type: Number,
    default: 0
  },
  currentPageIncoming: {
    type: Number,
    default: 1
  },
  lastPageIncoming: {
    type: Number,
    default: 1
  },
  totalIncoming: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  'update-tab', 
  'update-sent-filter', 
  'load-history', 
  'load-incoming', 
  'confirm-receipt', 
  'return-archive'
]);

const filteredHistory = computed(() => {
  if (props.sentFilter === 'all') return props.history;
  return props.history.filter(item => item.tipo_retiro === props.sentFilter);
});

const refreshList = () => {
  if (props.activeTab === 'sent') {
    emit('load-history', 1);
  } else {
    emit('load-incoming', 1);
  }
};

const getStatusLabel = (status) => {
  switch (Number(status)) {
    case 0: return 'Archivado';
    case 1: return 'Solicitado';
    case 2: return 'Enviado Temp';
    case 3: return 'Enviado Def';
    case 4: return 'Recibido en Ag.';
    case 5: return 'Entregado a Asoc.';
    case 6: return 'En Retorno';
    default: return `Desc (${status})`;
  }
};

const getStatusClass = (status) => {
  switch (Number(status)) {
    case 0: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-305 border border-gray-200 dark:border-gray-700';
    case 1: return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30';
    case 2: return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
    case 3: return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
    case 4: return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30';
    case 5: return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
    case 6: return 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30';
    default: return 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
  }
};
</script>
