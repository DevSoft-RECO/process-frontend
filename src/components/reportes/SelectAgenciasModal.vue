<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center sm:px-4">
      <!-- Overlay oscuro -->
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <!-- Contenedor del Modal -->
      <div class="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        
        <!-- Header del Modal -->
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
             </div>
             <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Filtrar por Agencia</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Selecciona las agencias que deseas incluir en el reporte.</p>
             </div>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Cuerpo con Scroll y Checkboxes -->
        <div class="p-6 overflow-y-auto flex-grow custom-scrollbar">
           
           <div v-if="loading" class="flex flex-col items-center justify-center py-10 opacity-60">
               <svg class="animate-spin h-8 w-8 text-blue-500 mb-3" viewBox="0 0 24 24" fill="none">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span class="text-sm text-gray-500 font-medium">Cargando catálogo de agencias...</span>
           </div>

           <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
               No se pudieron cargar las agencias. Inténtalo más tarde.
           </div>

           <div v-else class="space-y-4">
              
              <!-- Checkbox: Todas las agencias -->
              <label class="flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-colors" 
                     :class="selectAll ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/50'">
                  <div class="flex items-center gap-3">
                     <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                     <span class="font-bold text-gray-800 dark:text-gray-200">Generar de Todas las Agencias</span>
                  </div>
              </label>

              <div class="h-px bg-gray-100 dark:bg-gray-700 w-full my-4"></div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">O Selecciona Específicas:</p>

              <!-- Lista de Agencias -->
              <div class="grid grid-cols-1 gap-2">
                 <label v-for="agencia in agenciasActivas" :key="agencia.id" 
                        class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
                        :class="selectedAgencias.includes(agencia.id) ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500/50' : 'border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-slate-700'">
                    <div class="flex items-center gap-3">
                       <input type="checkbox" :value="agencia.id" v-model="selectedAgencias" @change="updateSelectAllStatus"
                              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                       <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ agencia.nombre }}</span>
                    </div>
                 </label>
              </div>

           </div>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/80 rounded-b-3xl">
           <button 
             @click="confirmSelection"
             :disabled="loading || error || selectedAgencias.length === 0"
             class="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
           >
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             {{ selectedAgencias.length === agenciasActivas.length ? 'Generar Todo el Consolidado' : `Generar Filtro (${selectedAgencias.length})` }}
           </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/api/axios';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'confirm']);

const agenciasActivas = ref([]);
const selectedAgencias = ref([]);
const selectAll = ref(true); // Default generar todo
const loading = ref(true);
const error = ref(false);

const cargarAgencias = async () => {
    loading.value = true;
    error.value = false;
    try {
        const response = await api.get('/agencias');
        // Suponemos que devolvemos todas para filtrar, o si vienen de un 'data'
        agenciasActivas.value = response.data.data ? response.data.data : response.data;
        seleccionarTodas(); 
    } catch(err) {
        console.error('Error cargando agencias:', err);
        error.value = true;
    } finally {
        loading.value = false;
    }
};

const seleccionarTodas = () => {
    selectedAgencias.value = agenciasActivas.value.map(a => a.id);
    selectAll.value = true;
};

const deseleccionarTodas = () => {
    selectedAgencias.value = [];
    selectAll.value = false;
};

const toggleSelectAll = () => {
    if (selectAll.value) {
        seleccionarTodas();
    } else {
        deseleccionarTodas();
    }
};

const updateSelectAllStatus = () => {
    // Si la cantidad de seleccionadas es igual al total, activar el checkbox principal
    if (selectedAgencias.value.length === agenciasActivas.value.length && agenciasActivas.value.length > 0) {
        selectAll.value = true;
    } else {
        selectAll.value = false;
    }
};

const confirmSelection = () => {
    // Pasamos el arreglo de ids al componente padre (ReportesView)
    emit('confirm', [...selectedAgencias.value]);
    emit('close');
};

// Cargar agencias solo cuando se abre por primera vez o re-abre el modal para datos frescos
watch(() => props.isOpen, (newVal) => {
   if (newVal && agenciasActivas.value.length === 0) {
       cargarAgencias();
   } else if (newVal) {
       // Reset on open para generar todas por default de nuevo
       seleccionarTodas();
   }
});

// Precarga preventiva en mount
onMounted(() => {
    cargarAgencias();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
