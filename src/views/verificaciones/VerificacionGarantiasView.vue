<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i class="fas fa-shield-alt text-amber-500"></i>
          Verificación de Garantías
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Módulo administrativo para consultar la asociación entre Garantías (Documentos) y Productos (Expedientes).
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
        Consultar Garantía
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Número Field -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Número de Garantía</label>
          <input 
            v-model="searchFields.numero" 
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="Ingrese el número de la garantía" 
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-inner"
            :disabled="loading"
          >
        </div>

        <!-- Fecha Field -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha de Garantía</label>
          <input 
            v-model="searchFields.fecha" 
            @keyup.enter="handleSearch"
            type="date" 
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 dark:text-slate-100 transition-all shadow-inner"
            :disabled="loading"
          >
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button 
          @click="resetSearch" 
          type="button"
          class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          Limpiar
        </button>
        <button 
          @click="handleSearch" 
          :disabled="loading || !searchFields.numero.trim() || !searchFields.fecha"
          class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 !text-white font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
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
      <!-- Multiple Owners Option (Selector) -->
      <div v-if="multipleResults.length > 0" key="multiple" class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-amber-200 dark:border-amber-900/50 space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <i class="fas fa-users-cog text-xl text-amber-500"></i>
          <div>
            <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">Múltiples Propietarios Encontrados</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Coincide el número y fecha, seleccione la garantía por el propietario correcto.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="doc in multipleResults" 
            :key="doc.id" 
            @click="selectDocument(doc.id)"
            class="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/5 cursor-pointer transition-all flex justify-between items-center group"
          >
            <div>
              <p class="font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                {{ doc.propietario || 'Sin Propietario Registrado' }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No. Garantía: {{ doc.numero }} | Fecha: {{ formatDate(doc.fecha) }}
              </p>
            </div>
            <i class="fas fa-chevron-right text-slate-400 group-hover:text-amber-500 transition-all group-hover:translate-x-1"></i>
          </div>
        </div>
      </div>

      <!-- Single Results View -->
      <div v-else-if="result" key="result" class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 overflow-y-auto flex-1 flex flex-col custom-scrollbar">
        <!-- Result Header -->
        <div class="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">Garantía Consultada</span>
            <h3 class="text-xl font-black text-slate-800 dark:text-slate-100">
              No. {{ result.garantia.numero }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Propietario: <strong class="text-slate-700 dark:text-slate-300">{{ result.garantia.propietario || 'N/A' }}</strong>
            </p>
          </div>
          <div class="text-left md:text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl">
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Fecha de Garantía</span>
            <span class="font-bold text-slate-700 dark:text-slate-300 text-sm">{{ formatDate(result.garantia.fecha) }}</span>
          </div>
        </div>

        <!-- Products Content -->
        <div class="p-6 flex-1 flex flex-col space-y-4">
          <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <i class="fas fa-box text-amber-500"></i>
            Productos Asociados ({{ result.productos.length }})
          </h4>

          <!-- Empty Association Message -->
          <div 
            v-if="result.productos.length === 0" 
            class="flex flex-col items-center justify-center p-12 bg-amber-500/5 rounded-2xl border border-dashed border-amber-300/40 text-center flex-1"
          >
            <div class="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 shadow-sm">
              <i class="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">Ningun producto Asociado a la garantia</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              Esta garantía se encuentra registrada en el sistema, pero actualmente no tiene asignaciones a ningún expediente de crédito activo o archivado.
            </p>
          </div>

          <!-- Products List -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div 
              v-for="prod in result.productos" 
              :key="prod.id" 
              class="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <!-- Border bar -->
              <div class="absolute top-0 left-0 w-1.5 h-full" :class="prod.estado_pivote === 'activo' ? 'bg-amber-500' : 'bg-slate-400'"></div>

              <div class="pl-3 space-y-3">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase">Número de Producto / Crédito</span>
                    <span class="font-black text-slate-800 dark:text-slate-100 text-lg">{{ prod.numero_documento }}</span>
                  </div>
                  <span 
                    class="text-xs px-2.5 py-1 rounded-full font-bold uppercase border shadow-sm"
                    :class="prod.estado_pivote === 'activo' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'"
                  >
                    {{ prod.estado_pivote }}
                  </span>
                </div>

                <div class="pt-2 border-t border-slate-50 dark:border-slate-900 flex justify-between items-center">
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase">Código del Cliente</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ prod.codigo_cliente }}</span>
                  </div>
                  
                  <RouterLink 
                    :to="`/admin/configuracion/editar-nuevo-expediente?search=${prod.id}`"
                    class="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Ver Detalles
                    <i class="fas fa-arrow-right text-[10px]"></i>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty/Welcome State -->
      <div v-else-if="!loading" key="welcome" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 flex-1">
        <div class="w-20 h-20 bg-amber-500/5 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-6 text-amber-500/60 shadow-inner">
          <i class="fas fa-shield-alt text-4xl"></i>
        </div>
        <h3 class="text-xl font-black text-slate-700 dark:text-slate-300">Consulta de Relaciones</h3>
        <p class="text-slate-500 dark:text-slate-400 max-w-md text-center mt-2 text-sm leading-relaxed">
          Ingrese el número y la fecha de garantía para validar si cuenta con productos o expedientes asignados en la base de datos de control.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// Search inputs
const searchFields = ref({
  numero: '',
  fecha: ''
});

// State variables
const loading = ref(false);
const result = ref(null);
const multipleResults = ref([]);

// Formats date nicely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Reset state
const resetSearch = () => {
  searchFields.value.numero = '';
  searchFields.value.fecha = '';
  result.value = null;
  multipleResults.value = [];
};

// Search by Number and Date
const handleSearch = async () => {
  if (!searchFields.value.numero.trim() || !searchFields.value.fecha) return;

  loading.value = true;
  result.value = null;
  multipleResults.value = [];

  try {
    const response = await api.get('/admin/verificaciones/garantias/search', {
      params: {
        numero: searchFields.value.numero,
        fecha: searchFields.value.fecha
      }
    });

    if (response.data.success) {
      if (response.data.multiple) {
        multipleResults.value = response.data.data;
      } else {
        result.value = response.data;
        if (response.data.message) {
          Swal.fire({
            icon: 'info',
            title: 'Consulta Realizada',
            text: response.data.message,
            confirmButtonColor: '#f59e0b'
          });
        }
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: response.data.message || 'No se obtuvieron resultados.',
        confirmButtonColor: '#f59e0b'
      });
    }
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    const errorMsg = error.response?.data?.message || 'Hubo un error al realizar la consulta de verificación.';
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

// Select one document in case of multiple owners matching number and date
const selectDocument = async (id) => {
  loading.value = true;
  multipleResults.value = [];
  result.value = null;

  try {
    const response = await api.get('/admin/verificaciones/garantias/search', {
      params: {
        documento_id: id
      }
    });

    if (response.data.success) {
      result.value = response.data;
      if (response.data.message) {
        Swal.fire({
          icon: 'info',
          title: 'Consulta Realizada',
          text: response.data.message,
          confirmButtonColor: '#f59e0b'
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: response.data.message || 'No se obtuvieron detalles del documento.',
        confirmButtonColor: '#f59e0b'
      });
    }
  } catch (error) {
    console.error('Error al seleccionar documento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al obtener los detalles de la garantía seleccionada.',
      confirmButtonColor: '#f59e0b'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

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
