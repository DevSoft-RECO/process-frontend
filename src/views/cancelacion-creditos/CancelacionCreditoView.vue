<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Cancelación y Reactivación de Créditos</h1>
      <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
        Módulo Especial
      </span>
    </div>

    <!-- Search Section -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">Buscar Expediente</h2>
      <p class="text-sm text-gray-500 mb-2">Ingrese el Número de Producto o Código de Cliente para localizar el expediente.</p>
      <div class="flex space-x-2">
        <input 
          v-model="searchTerm" 
          @keyup.enter="searchExpediente"
          type="text" 
          placeholder="Ej: ESC-2023-001 o 10023456" 
          class="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          :disabled="loadingSearch"
        >
        <button 
          @click="searchExpediente" 
          :disabled="loadingSearch || !searchTerm.trim()"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center shadow-sm"
        >
          <span v-if="loadingSearch"><i class="fas fa-spinner fa-spin mr-2"></i> Buscando...</span>
          <span v-else><i class="fas fa-search mr-2"></i> Buscar</span>
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="expediente" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 animate-fade-in-down">
      <div class="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            Expediente: {{ expediente.numero_documento }}
          </h3>
          <p class="text-gray-500">{{ expediente.nombre_asociado }}</p>
        </div>
        <div class="text-right flex flex-col items-end gap-2">
           <span class="text-sm font-bold uppercase px-4 py-1.5 rounded-full border shadow-sm transition-colors"
                 :class="estadoClases">
              <i class="fas" :class="expediente.estado === 'activo' ? 'fa-check-circle' : (expediente.estado === 'sin_seguimiento' ? 'fa-exclamation-circle' : 'fa-times-circle')"></i>
              Estado: {{ textEstadoOriginal }}
           </span>
           <span v-if="expediente.estado === 'cancelado'" class="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
             <i class="fas fa-lock"></i> Crédito Pagado / En Archivo Inactivo
           </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         <!-- Existing basic data... -->
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Código Cliente</span>
             <span class="font-bold text-gray-900 text-lg">{{ expediente.codigo_cliente || 'N/A' }}</span>
         </div>
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Agencia</span>
             <span class="font-bold text-gray-900">{{ expediente.agencia }}</span>
         </div>
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Asesor</span>
             <span class="font-bold text-gray-900">{{ expediente.asesor }}</span>
         </div>
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tipo de Crédito</span>
             <span class="font-bold text-gray-900">{{ expediente.tipo_credito || 'N/A' }}</span>
         </div>
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monto Original</span>
             <span class="font-bold text-green-700 text-lg">{{ formatCurrency(expediente.monto_original) }}</span>
         </div>
         <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
             <span class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fecha Otorgamiento</span>
             <span class="font-bold text-gray-900">{{ formatDate(expediente.fecha_otorgado) }}</span>
         </div>
      </div>

      <!-- Garantías / Documentos Relacionados -->
      <div class="mb-8">
         <h4 class="text-sm font-bold text-gray-700 mb-3 border-b pb-2 uppercase tracking-wide flex items-center gap-2">
            <i class="fas fa-file-contract text-blue-600"></i>
            Garantías y Documentos Asociados ({{ expediente.documentos?.length || 0 }})
         </h4>
         
         <div v-if="expediente.documentos && expediente.documentos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div v-for="doc in expediente.documentos" :key="doc.id" class="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                 <div class="absolute top-0 left-0 w-1.5 h-full" :class="doc.estado_pivote === 'activo' ? 'bg-blue-500' : 'bg-gray-400'"></div>
                 <div class="pl-3">
                     <div class="flex justify-between items-start mb-2">
                         <span class="font-bold text-gray-800">{{ doc.numero }}</span>
                         <span class="text-xs px-2 py-1 rounded-md font-semibold" :class="doc.estado_pivote === 'activo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'">
                             {{ doc.estado_pivote?.toUpperCase() || 'N/A' }}
                         </span>
                     </div>
                     <div class="text-xs text-gray-600 space-y-1">
                         <p><span class="font-bold text-gray-700">Fecha:</span> {{ formatDate(doc.fecha) }}</p>
                         <p v-if="doc.propietario"><span class="font-bold text-gray-700">Propietario:</span> {{ doc.propietario }}</p>
                         <p><span class="font-bold text-gray-700">Tipo:</span> {{ doc.tipo_documento_nombre }}</p>
                     </div>
                 </div>
             </div>
         </div>
         <div v-else class="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
             Este expediente no tiene garantías o documentos registrados en el sistema.
         </div>
      </div>

      <!-- Action Area -->
      <div v-if="expediente.tiene_seguimiento" class="border-t-2 border-dashed border-gray-200 mt-8 pt-8 flex flex-col items-center text-center">
         <h4 class="text-lg font-black text-gray-800 mb-2">Gestión de Cancelación de Expediente</h4>
         
         <p v-if="expediente.estado === 'activo'" class="text-sm text-gray-600 max-w-2xl mb-6">
             Al clickear el botón de cancelar, usted está certificando que este crédito <strong class="text-gray-800">ha sido pagado o finalizado en su totalidad</strong>. Cambiar el estado moverá virtualmente el expediente y sus garantías asociadas hacia el archivo inactivo. Use esta opción con precaución.
         </p>
         <p v-else class="text-sm text-gray-600 max-w-2xl mb-6">
             Este crédito está actualmente listado como pagado / cancelado. Si hubo un error en la cancelación o el crédito debe ser retornado a estado de "seguimiento", pulse Reactivar Expediente.  
         </p>

         <button 
             @click="confirmToggle"
             :disabled="loadingSubmit"
             class="px-8 py-4 text-white rounded-xl font-black text-lg flex items-center transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
             :class="botonAccionClases"
         >
             <span v-if="loadingSubmit">
                 <i class="fas fa-circle-notch fa-spin mr-3"></i> Validando Transacción...
             </span>
             <span v-else>
                 <i class="fas mr-3 text-xl" :class="expediente.estado === 'activo' ? 'fa-file-signature' : 'fa-history'"></i> 
                 {{ textoBotonAccion }}
             </span>
         </button>
      </div>

      <!-- Action Area Disabled (Sin Seguimiento) -->
      <div v-else class="border-t-2 border-dashed border-gray-200 mt-8 pt-8 flex flex-col items-center text-center">
         <h4 class="text-lg font-black text-amber-600 mb-2 flex items-center gap-2">
             <i class="fas fa-exclamation-triangle mt-1"></i> Expediente Sin Seguimiento Físico
         </h4>
         <p class="text-sm text-gray-600 max-w-2xl">
             Este expediente existe en la base de datos central, pero el archivo físico no posee garantías ni documentos matriculados en la tabla de control del archivo. Por consiguiente, no puede alterar el estado de cancelación ya que no existe un paquete de seguimiento que cancelar o reactivar.
         </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!expediente && !loadingSearch && hasSearched" class="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 flex-1">
        <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-bold text-gray-600">No se encontraron resultados</h3>
        <p class="text-gray-500 max-w-md text-center mt-2">No existe ningún expediente con el identificador proporcionado. Verifique el número e intente de nuevo.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

// State
const searchTerm = ref('');
const loadingSearch = ref(false);
const loadingSubmit = ref(false);
const hasSearched = ref(false);
const expediente = ref(null);
const motivo = ref('');

const textEstadoOriginal = computed(() => {
    if (!expediente.value) return '';
    if (expediente.value.estado === 'sin_seguimiento') return 'Sin Seguimiento';
    return expediente.value.estado === 'activo' ? 'Crédito Activo' : 'Crédito Cancelado';
});

// Computed
const estadoClases = computed(() => {
    if (!expediente.value) return '';
    if (expediente.value.estado === 'sin_seguimiento') return 'bg-amber-100 text-amber-800 border-amber-200 shadow-amber-500/20';
    return expediente.value.estado === 'activo' 
        ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-blue-500/20' 
        : 'bg-gray-200 text-gray-800 border-gray-300 shadow-gray-500/20';
});

const botonAccionClases = computed(() => {
    if (!expediente.value) return '';
    return expediente.value.estado === 'activo'
        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 ring-2 ring-red-200 ring-offset-2'
        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 ring-2 ring-emerald-200 ring-offset-2';
});

const textoBotonAccion = computed(() => {
    if (!expediente.value) return '';
    return expediente.value.estado === 'activo' ? 'PROCEDER A CANCELAR CRÉDITO' : 'PROCEDER A REACTIVAR CRÉDITO';
});

// Methods
const searchExpediente = async () => {
    if (!searchTerm.value.trim()) return;

    loadingSearch.value = true;
    hasSearched.value = true;
    expediente.value = null;
    motivo.value = '';

    try {
        const response = await api.get('/admin/cancelar-credito/search', {
            params: { termino: searchTerm.value }
        });

        if (response.data.found) {
            expediente.value = response.data.data;
        } else {
            // Found property is false
            expediente.value = null;
            Swal.fire({
                icon: 'warning',
                title: 'Búsqueda Fallida',
                text: response.data.message
            });
        }

    } catch (error) {
        console.error("Error buscando expediente:", error);
        const msg = error.response?.data?.message || 'Error al conectar con el servidor.';
        Swal.fire({
            icon: 'error',
            title: 'Error de Búsqueda',
            text: msg
        });
        expediente.value = null;
    } finally {
        loadingSearch.value = false;
    }
};

const confirmToggle = () => {
    if (!expediente.value) return;

    const accionFuerte = expediente.value.estado === 'activo' ? 'CANCELAR' : 'REACTIVAR';
    const subAccion = expediente.value.estado === 'activo' ? 'certificando el pago total de' : 'devolviendo al seguimiento regular';

    Swal.fire({
        title: `¿Confirmación de Seguridad?`,
        html: `
            <div class="text-left">
               <p class="mb-4 text-gray-600">Al proceder, estás <b>${subAccion}</b> el crédito seleccionado.</p>
               <div class="bg-gray-50 p-4 border rounded-lg border-gray-200">
                  <div class="font-black text-xl text-center text-gray-800 mb-1">${expediente.value.numero_documento}</div>
                  <div class="font-bold text-center text-gray-500 text-sm">${expediente.value.nombre_asociado}</div>
               </div>
               <p class="mt-4 text-sm font-bold text-red-600 flex items-center gap-2">
                 <i class="fas fa-exclamation-triangle"></i> Revise antes de proceder.
               </p>
            </div>
        `,
        icon: expediente.value.estado === 'activo' ? 'warning' : 'info',
        showCancelButton: true,
        confirmButtonColor: expediente.value.estado === 'activo' ? '#dc2626' : '#059669', // Tailwind red-600 / emerald-600
        cancelButtonColor: '#6b7280',
        confirmButtonText: `<i class="fas fa-fingerprint mr-2"></i> Confirmar y ${accionFuerte}`,
        cancelButtonText: 'Abortar',
        reverseButtons: true,
        focusCancel: true
    }).then((result) => {
        if (result.isConfirmed) {
            executeToggle();
        }
    });
};

const executeToggle = async () => {
    loadingSubmit.value = true;
    try {
        const response = await api.post(`/admin/cancelar-credito/${expediente.value.id}/toggle`);
        
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: response.data.message
        });

        // Update local object to reflect the change visually immediately
        expediente.value.estado = response.data.estado;
        motivo.value = ''; // Clean reason input

    } catch (error) {
        console.error("Error cambiando estado:", error);
        const msg = error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg
        });
    } finally {
        loadingSubmit.value = false;
    }
};

const resetView = () => {
    searchTerm.value = '';
    hasSearched.value = false;
    expediente.value = null;
    motivo.value = '';
};

// Utilities
const formatCurrency = (value) => {
    if (!value || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
</style>
