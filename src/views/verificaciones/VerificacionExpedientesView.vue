<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fas fa-folder-open text-amber-500"></i>
          Verificación de Expedientes
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Módulo administrativo para consultar la asociación inversa: buscar un Producto (Expediente) y verificar sus Garantías (Documentos) asociadas.
        </p>
      </div>
      <span class="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50 shadow-sm flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Solo Super Admin
      </span>
    </div>

    <!-- Search Form -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 transition-all duration-300">
      <h2 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
        <i class="fas fa-search text-amber-500"></i>
        Consultar Expediente
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
        Ingrese el Número de Producto (Crédito) o el Código de Cliente.
      </p>
      <div class="flex space-x-3">
        <input 
          v-model="searchTerm" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Ej: 1260000 o 123456" 
          class="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-inner"
          :disabled="loading"
        >
        
        <button 
          @click="handleSearch" 
          :disabled="loading || !searchTerm.trim()"
          class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 !text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
        >
          <template v-if="loading">
            <svg class="animate-spin h-5 w-5 !text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="!text-white">Buscando...</span>
          </template>
          <template v-else>
            <svg class="h-5 w-5 !text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="!text-white">Consultar</span>
          </template>
        </button>
      </div>
    </div>

    <!-- Main Results Transitions -->
    <Transition name="fade-slide" mode="out-in">
      <!-- Single Results View -->
      <div v-if="result" key="result" class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 overflow-y-auto flex-1 flex flex-col custom-scrollbar">
        <!-- Result Header -->
        <div class="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">Expediente Encontrado</span>
            <h3 class="text-xl font-black text-slate-800 dark:text-slate-100">
              No. {{ result.numero_documento }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Asociado: <strong class="text-slate-700 dark:text-slate-300">{{ result.nombre_asociado || 'N/A' }}</strong>
            </p>
          </div>
          <div class="text-left md:text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl">
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Estado General</span>
            <span 
              class="font-bold text-sm uppercase px-2.5 py-0.5 rounded-full"
              :class="result.estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'"
            >
              {{ result.estado }}
            </span>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Código Cliente</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ result.codigo_cliente || 'N/A' }}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Agencia</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ result.agencia || 'N/A' }}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Asesor Asignado</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ result.asesor || 'N/A' }}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipo Garantía</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ result.tipo_credito || 'N/A' }}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Monto Original</span>
            <span class="font-bold text-green-600 dark:text-green-400">{{ formatCurrency(result.monto_original) }}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fecha Otorgamiento</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatDate(result.fecha_otorgado) }}</span>
          </div>
        </div>

        <!-- Associated Guarantees Content -->
        <div class="p-6 flex-1 flex flex-col space-y-4">
          <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <i class="fas fa-file-contract text-amber-500"></i>
            Garantías y Documentos Asociados ({{ result.documentos ? result.documentos.length : 0 }})
          </h4>

          <!-- Empty Guarantees Message -->
          <div 
            v-if="!result.documentos || result.documentos.length === 0" 
            class="flex flex-col items-center justify-center p-12 bg-amber-500/5 rounded-2xl border border-dashed border-amber-300/40 text-center flex-1"
          >
            <div class="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 shadow-sm">
              <i class="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">Ninguna garantía asociada</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              Este expediente se encuentra registrado en el sistema, pero no tiene ninguna garantía o documento cargado en su tabla de control físico.
            </p>
          </div>

          <!-- Guarantees List -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div 
              v-for="doc in result.documentos" 
              :key="doc.id" 
              class="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <!-- Border bar -->
              <div class="absolute top-0 left-0 w-1.5 h-full" :class="doc.estado_pivote === 'activo' ? 'bg-amber-500' : 'bg-slate-400'"></div>

              <div class="pl-3 space-y-3">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase">Número de Garantía</span>
                    <span class="font-black text-slate-800 dark:text-slate-100 text-lg">{{ doc.numero }}</span>
                  </div>
                  <span 
                    class="text-xs px-2.5 py-1 rounded-full font-bold uppercase border shadow-sm"
                    :class="doc.estado_pivote === 'activo' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'"
                  >
                    {{ doc.estado_pivote }}
                  </span>
                </div>

                <div class="pt-2 border-t border-slate-50 dark:border-slate-900 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p><span class="font-bold text-slate-700 dark:text-slate-300">Propietario:</span> {{ doc.propietario || 'N/A' }}</p>
                  <p><span class="font-bold text-slate-700 dark:text-slate-300">Tipo:</span> {{ doc.tipo_documento_nombre || 'N/A' }}</p>
                  <p><span class="font-bold text-slate-700 dark:text-slate-300">Fecha Emisión:</span> {{ formatDate(doc.fecha) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty/Welcome State -->
      <div v-else-if="!loading" key="welcome" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 flex-1">
        <div class="w-20 h-20 bg-amber-500/5 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-6 text-amber-500/60 shadow-inner">
          <i class="fas fa-folder-open text-4xl"></i>
        </div>
        <h3 class="text-xl font-black text-slate-700 dark:text-slate-300">Consulta de Expedientes</h3>
        <p class="text-slate-500 dark:text-slate-400 max-w-md text-center mt-2 text-sm leading-relaxed">
          Ingrese el Número de Producto (crédito) o Código de Cliente para validar los datos básicos del expediente y desplegar sus garantías asociadas.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// Search input
const searchTerm = ref('');
const loading = ref(false);
const result = ref(null);

// Formats date nicely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value);
};

// Search by Product Number / Client Code
const handleSearch = async () => {
  if (!searchTerm.value.trim()) return;

  loading.value = true;
  result.value = null;

  try {
    const response = await api.get('/admin/cancelar-credito/search', {
      params: {
        termino: searchTerm.value
      }
    });

    if (response.data.found) {
      result.value = response.data.data;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Búsqueda sin Resultados',
        text: response.data.message || 'No se encontró ningún expediente con ese número.',
        confirmButtonColor: '#f59e0b'
      });
    }
  } catch (error) {
    console.error('Error buscando expediente:', error);
    const errorMsg = error.response?.data?.message || 'Error al conectar con el servidor.';
    Swal.fire({
      icon: 'error',
      title: 'Error de Consulta',
      text: errorMsg,
      confirmButtonColor: '#f59e0b'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Fluid transition between states */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
