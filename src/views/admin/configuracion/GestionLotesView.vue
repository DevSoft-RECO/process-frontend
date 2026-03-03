<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <svg class="w-8 h-8 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Gestión de Lotes de Importación
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Administra y revierte cargas masivas de datos de nuevos expedientes.
        </p>
      </div>
    </div>

    <!-- Lotes List -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div v-if="loadingLotes" class="p-12 flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-cope"></div>
        <p class="text-slate-500 animate-pulse">Cargando lotes...</p>
      </div>

      <div v-else-if="lotes.length === 0" class="p-12 text-center text-slate-500">
        No se han encontrado lotes de importación registrados.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lote ID</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Archivo Original</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Carga</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Registros</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="lote in lotes" :key="lote.id" 
                class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
              <td class="px-6 py-4 font-mono text-verde-cope font-bold">#{{ lote.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{{ lote.nombre_archivo || 'N/A' }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400">
                {{ formatDateTime(lote.created_at) }}
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {{ lote.registros_totales }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                {{ lote.usuario?.name || 'Desconocido' }}
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button 
                  @click="previewLote(lote)"
                  class="p-2 text-slate-400 hover:text-verde-cope transition-colors rounded-lg hover:bg-verde-cope/10"
                  title="Ver registros"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  @click="confirmDelete(lote)"
                  class="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                  title="Eliminar lote"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="selectedLotePreview" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div class="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 scale-in-center">
        <!-- Modal Header -->
        <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold dark:text-white flex items-center gap-3">
              <span class="text-verde-cope font-mono">#{{ selectedLotePreview.id }}</span>
              Vista Previa de Registros
            </h2>
            <p class="text-sm text-slate-500 mt-1">Mostrando hasta 500 registros del archivo: {{ selectedLotePreview.nombre_archivo }}</p>
          </div>
          <button @click="selectedLotePreview = null" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div v-if="loadingPreview" class="p-12 flex flex-col items-center justify-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-cope"></div>
            <p class="text-slate-500">Obteniendo registros...</p>
          </div>
          <div v-else class="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
             <table class="w-full text-left text-sm border-collapse">
               <thead>
                 <tr class="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                   <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-tighter">Cód. Cliente</th>
                   <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-tighter">Nombre Asociado</th>
                   <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-tighter">Núm. Documento</th>
                   <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-tighter">Fecha Registro</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                 <tr v-for="record in previewRecords" :key="record.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                   <td class="px-4 py-2 font-mono text-verde-cope">{{ record.codigo_cliente }}</td>
                   <td class="px-4 py-2 uppercase truncate max-w-[200px]">{{ record.nombre_asociado }}</td>
                   <td class="px-4 py-2 text-slate-500">{{ record.numero_documento }}</td>
                   <td class="px-4 py-2 text-xs text-slate-400">{{ formatDateTime(record.created_at) }}</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button 
            @click="selectedLotePreview = null"
            class="px-6 py-2.5 rounded-xl font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-slate-700 dark:text-slate-200"
          >
            Cerrar
          </button>
          <button 
            @click="confirmDelete(selectedLotePreview)"
            class="px-6 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Eliminar Lote Completo
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="loteToDelete" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/20 scale-in-center">
        <div class="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 mx-auto">
          <svg class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">¿Confirmar eliminación?</h3>
        <p class="text-center text-slate-500 dark:text-slate-400 mb-8">
          Estás a punto de eliminar el lote <span class="font-bold text-red-500">#{{ loteToDelete.id }}</span>. 
          Esta acción borrará <span class="font-bold underline">{{ loteToDelete.registros_totales }} registros</span> de la tabla de nuevos expedientes de forma permanente.
        </p>
        <div class="flex flex-col gap-3">
          <button 
            @click="handleDelete" 
            :disabled="isDeleting"
            class="w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isDeleting" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
            {{ isDeleting ? 'Eliminando...' : 'Sí, borrar todo el lote' }}
          </button>
          <button 
            @click="loteToDelete = null" 
            :disabled="isDeleting"
            class="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

// Interface
interface User {
  id: number;
  name: string;
}

interface Lote {
  id: number;
  nombre_archivo: string;
  usuario_id: number;
  registros_totales: number;
  created_at: string;
  usuario?: User;
}

interface RecordPreview {
  id: number;
  codigo_cliente: number;
  nombre_asociado: string;
  numero_documento: string;
  created_at: string;
}

// State
const lotes = ref<Lote[]>([])
const loadingLotes = ref(true)
const selectedLotePreview = ref<Lote | null>(null)
const previewRecords = ref<RecordPreview[]>([])
const loadingPreview = ref(false)
const loteToDelete = ref<Lote | null>(null)
const isDeleting = ref(false)

// Methods
const fetchLotes = async () => {
  loadingLotes.value = true
  try {
    const { data } = await api.get('/import-nuevos/lotes')
    if (data.success) {
      lotes.value = data.data
    }
  } catch (error) {
    console.error('Error fetching lotes:', error)
  } finally {
    loadingLotes.value = false
  }
}

const previewLote = async (lote: Lote) => {
  selectedLotePreview.value = lote
  loadingPreview.value = true
  previewRecords.value = []
  try {
    const { data } = await api.get(`/import-nuevos/lotes/${lote.id}`)
    if (data.success) {
      previewRecords.value = data.data
    }
  } catch (error) {
    console.error('Error fetching preview:', error)
  } finally {
    loadingPreview.value = false
  }
}

const confirmDelete = (lote: Lote) => {
  loteToDelete.value = lote
}

const handleDelete = async () => {
  if (!loteToDelete.value) return
  
  isDeleting.value = true
  try {
    const { data } = await api.delete(`/import-nuevos/lotes/${loteToDelete.value.id}`)
    if (data.success) {
      loteToDelete.value = null
      selectedLotePreview.value = null
      fetchLotes()
      Swal.fire({
        icon: 'success',
        title: 'Lote Eliminado',
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#fff'
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el lote.',
      background: '#1e293b',
      color: '#fff'
    })
  } finally {
    isDeleting.value = false
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

onMounted(() => {
  fetchLotes()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.scale-in-center { animation: scaleIn 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
@keyframes scaleIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.1); border-radius: 20px; }
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(51, 65, 85, 0.5); }
</style>
