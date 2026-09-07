<template>
  <div v-if="show" class="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-all duration-300 animate-fade-in-down">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 dark:border-gray-800 gap-2">
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          {{ isManual ? 'Nueva Solicitud (Carga Manual)' : 'Datos del Documento' }}
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete la información requerida para registrar la solicitud de retiro.</p>
      </div>
      <div class="flex items-center">
        <span v-if="isManual" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
          <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Documento no encontrado
        </span>
        <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
          <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Documento Validado
        </span>
      </div>
    </div>

    <!-- Lista de Documentos Encontrados -->
    <div v-if="documentsList.length > 0" class="space-y-4">
      <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 border border-blue-100 dark:border-blue-900/20 flex items-start space-x-3">
        <div class="p-2 bg-blue-100/60 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-400 mt-0.5">
          <i class="fas fa-info-circle"></i>
        </div>
        <div>
          <h3 class="font-bold text-blue-900 dark:text-blue-300 text-sm">Garantías Asociadas al Expediente</h3>
          <p class="text-xs text-blue-700/80 dark:text-blue-400/80 mt-0.5">Seleccione la garantía que desea retirar de la lista a continuación.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div 
          v-for="doc in documentsList" 
          :key="doc.id" 
          class="border rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800 border-gray-100 dark:border-gray-800/80 hover:border-blue-300 hover:shadow-sm transition-all duration-200 relative cursor-pointer"
          :class="{
            'border-blue-500 dark:border-blue-500 bg-white dark:bg-gray-850 ring-4 ring-blue-500/10': formData.id_documento === doc.id, 
            'border-gray-100 dark:border-gray-800': formData.id_documento !== doc.id
          }"
          @click="selectDoc(doc)"
        >
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div class="flex-1 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-extrabold text-lg text-gray-800 dark:text-white">No. {{ doc.numero }}</span>
                <span 
                  v-if="doc.tiene_otros_activos" 
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 cursor-help"
                  title="Amarrado a otros expedientes activos"
                  @click.stop="$emit('show-links', doc)"
                >
                  <i class="fas fa-link mr-1 text-[10px]"></i> Vinculado a otros
                </span>
                <span v-if="doc.estado_physical !== 'activo' && doc.estado_fisico !== 'activo'" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                  <i class="fas fa-box mr-1 text-[10px]"></i> Estado Físico: {{ (doc.estado_fisico || 'N/A').toUpperCase() }}
                </span>
              </div>
              
              <div class="text-xs text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Tipo:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.tipo_documento?.nombre || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Fecha:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ formatDate(doc.fecha) }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Propietario:</span> <span class="text-gray-700 dark:text-gray-200 font-medium truncate">{{ doc.propietario || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Monto:</span> <span class="text-gray-700 dark:text-blue-400 font-semibold text-blue-600">{{ doc.monto_poliza || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Autorizador:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.autorizador || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Finca:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.no_finca || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Folio:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.folio || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Libro:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.libro || 'N/A' }}</span></p>
                <p class="flex items-center"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0">Reg. Prop.:</span> <span class="text-gray-700 dark:text-gray-200 font-medium">{{ doc.registro_propiedad?.nombre || 'N/A' }}</span></p>
                <p class="sm:col-span-2 lg:col-span-3 flex items-start"><span class="font-bold text-gray-400 dark:text-gray-500 w-24 shrink-0 mt-0.5">Observación:</span> <span class="text-gray-600 dark:text-gray-400 italic">{{ doc.observacion || 'Sin observaciones' }}</span></p>
              </div>
            </div>
            
            <div class="flex flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-3 lg:pt-0">
              <button 
                type="button"
                @click.stop="$emit('select-document', doc)"
                class="flex-1 lg:flex-none text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm"
                :class="{
                  'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10': formData.id_documento === doc.id,
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10': formData.id_documento !== doc.id && doc.estado_fisico === 'activo',
                  'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed shadow-none': doc.estado_fisico !== 'activo'
                }"
                :disabled="doc.estado_fisico !== 'activo'"
              >
                <i class="fas" :class="formData.id_documento === doc.id ? 'fa-check-circle' : (doc.estado_fisico === 'activo' ? 'fa-hand-pointer' : 'fa-lock')"></i>
                <span>{{ formData.id_documento === doc.id ? 'Seleccionado' : (doc.estado_fisico === 'activo' ? 'Seleccionar' : 'No Disponible') }}</span>
              </button>

              <button 
                v-if="doc.tiene_otros_activos"
                type="button"
                @click.stop="$emit('show-links', doc)"
                class="flex-1 lg:flex-none bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-200 dark:border-rose-900/30 px-4 py-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/45 transition-all duration-200 text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <i class="fas fa-eye"></i>
                <span>Ver Vinculados</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalle Simple (Solo para Manual o sin lista) -->
    <div v-if="isManual || (documentInfo && documentsList.length === 0)" class="bg-gray-50 dark:bg-gray-850 p-5 rounded-2xl border border-gray-200/60 dark:border-gray-800 text-xs grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 shadow-inner">
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Tipo</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.tipo_documento?.nombre || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Fecha</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ formatDate(documentInfo?.fecha) }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Propietario</span> <span class="text-gray-700 dark:text-gray-200 font-semibold truncate">{{ documentInfo?.propietario || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Monto</span> <span class="text-gray-700 dark:text-blue-400 font-bold text-blue-600">{{ documentInfo?.monto_poliza || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Autorizador</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.autorizador || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Finca</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.no_finca || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Folio</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.folio || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Libro</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.libro || 'N/A' }}</span></div>
      <div class="flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Reg. Propiedad</span> <span class="text-gray-700 dark:text-gray-200 font-semibold">{{ documentInfo?.registro_propiedad?.nombre || 'N/A' }}</span></div>
      <div class="md:col-span-3 xl:col-span-4 flex flex-col space-y-0.5"><span class="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">Observación</span> <span class="text-gray-600 dark:text-gray-400 italic">{{ documentInfo?.observacion || 'Sin observaciones' }}</span></div>
    </div>

    <!-- Campos del Formulario -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Número de Documento</label>
        <input 
          :value="formData.numero_documento" 
          @input="$emit('update-field', { field: 'numero_documento', value: $event.target.value })"
          type="text" 
          :readonly="!isManual"
          class="w-full border rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 font-medium"
          :class="!isManual ? 'bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-150 dark:border-gray-750' : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 text-gray-750 dark:text-gray-200'"
        >
      </div>
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha del Documento</label>
        <input 
          :value="formData.fecha_documento" 
          @input="$emit('update-field', { field: 'fecha_documento', value: $event.target.value })"
          type="date" 
          :readonly="!isManual"
          class="w-full border rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 font-medium"
          :class="!isManual ? 'bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-150 dark:border-gray-750' : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 text-gray-750 dark:text-gray-200'"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Título / Nombre Asociado</label>
        <input 
          :value="formData.titulo_nombre" 
          @input="$emit('update-field', { field: 'titulo_nombre', value: $event.target.value })"
          type="text" 
          :readonly="!isManual"
          class="w-full border rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 font-medium"
          :class="!isManual ? 'bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-150 dark:border-gray-750' : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 text-gray-750 dark:text-gray-200'"
        >
      </div>
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tipo de Retiro</label>
        <select 
          :value="formData.tipo_retiro" 
          @change="$emit('update-field', { field: 'tipo_retiro', value: $event.target.value })"
          class="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 font-medium bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-200 disabled:bg-gray-50/70 dark:disabled:bg-gray-800/40 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:border-gray-150 dark:disabled:border-gray-750 cursor-pointer"
          :disabled="!formData.numero_documento"
        >
          <option value="Temporal" :disabled="isTemporalDisabled">Temporal</option>
          <option value="Definitivo" :disabled="isSelectionLinked">Definitivo</option>
        </select>
        <p v-if="isSelectionLinked && !isManual" class="text-[11px] text-rose-500 font-semibold mt-1.5 flex flex-col gap-0.5">
          <span class="flex items-center"><i class="fas fa-exclamation-triangle mr-1"></i> Advertencia: El expediente asociado aún se encuentra ACTIVO.</span>
          <span class="ml-3.5 opacity-90">Solicite la cancelación del producto en SADEC para realizar el retiro definitivo.</span>
        </p>
        <p v-if="isTemporalDisabled && !isManual" class="text-[11px] text-blue-500 font-semibold mt-1.5 flex items-center">
          <i class="fas fa-info-circle mr-1"></i> Retiro temporal bloqueado. No posee vinculaciones activas.
        </p>
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Justificación</label>
      <textarea 
        :value="formData.justificacion" 
        @input="$emit('update-field', { field: 'justificacion', value: $event.target.value })"
        rows="3" 
        class="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 font-medium bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-200 resize-none shadow-inner"
        placeholder="Escriba detalladamente el motivo del retiro..."
      ></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
      <button 
        type="button"
        @click="$emit('cancel')" 
        class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/80 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-350 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
      >
        Cancelar
      </button>
      <button 
        type="button"
        @click="$emit('submit')" 
        :disabled="loadingSubmit"
        class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span v-if="loadingSubmit" class="flex items-center space-x-1.5">
          <i class="fas fa-circle-notch animate-spin text-sm"></i>
          <span>Enviando...</span>
        </span>
        <span v-else class="flex items-center space-x-1.5">
          <i class="fas fa-paper-plane text-xs"></i>
          <span>Enviar Solicitud</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isManual: {
    type: Boolean,
    default: false
  },
  documentsList: {
    type: Array,
    default: () => []
  },
  documentInfo: {
    type: Object,
    default: null
  },
  expedienteActive: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  loadingSubmit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel', 'select-document', 'show-links', 'update-field']);

const selectedDoc = computed(() => {
  return props.documentsList.find(d => d.id === props.formData.id_documento);
});

const isSelectionLinked = computed(() => {
  if (!props.formData.id_documento || props.isManual) return false;
  return selectedDoc.value ? !selectedDoc.value.permite_definitivo : false;
});

const isTemporalDisabled = computed(() => {
  if (!props.formData.id_documento || props.isManual) return false;
  return selectedDoc.value ? !selectedDoc.value.permite_temporal : false;
});

const selectDoc = (doc) => {
  emit('select-document', doc);
};
</script>
