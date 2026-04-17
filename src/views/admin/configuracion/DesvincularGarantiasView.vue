<template>
  <div class="space-y-8 animate-fade-in relative pb-20 p-2 md:p-4">
    
    <!-- HEADER -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-verde-cope dark:bg-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            Desvinculación <span class="text-verde-cope dark:text-red-500 font-light">Garantías</span>
          </h1>
          <p class="text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 mt-2">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
            Desvinculacion de Garantias a los productos
          </p>
        </div>
      </div>
    </header>

    <!-- SEARCH SECTION -->
    <section class="p-8 md:p-12 relative overflow-hidden">

        <!-- Decorative bg circle -->
        <div class="max-w-3xl mx-auto relative z-10 text-center space-y-6">
          <h2 class="text-slate-800 dark:text-white text-xl font-black uppercase tracking-[0.3em]">Buscador Global de Expedientes</h2>
          
          <div class="relative group">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Número Documento o Codigo Cliente"
              class="w-full pl-8 pr-40 py-5 md:py-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 rounded-2xl text-lg md:text-xl font-bold text-slate-900 dark:text-white shadow-sm focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-500/20 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 uppercase tracking-tight"
              @keyup.enter="searchExpediente"
            >
            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                @click="searchExpediente"
                :disabled="searching || !searchQuery"
                class="px-6 md:px-8 py-3 bg-azul-cope hover:bg-verde-cope disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-black uppercase tracking-tighter transition-all flex items-center gap-3 shadow-sm active:scale-95 disabled:active:scale-100"
              >
                <span v-if="searching" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span>
                <span class="text-sm">{{ searching ? 'Buscando' : 'Consultar' }}</span>
                <svg v-if="!searching" class="w-5 h-5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Sugerencia: Ingrese el número completo para obtener el registro exacto</p>
        </div>
  
    </section>

    <!-- RESULTS: EXPEDIENTE DETAILS -->
    <div v-if="expediente" class="animate-slide-up space-y-8">
      
      <!-- Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Card 1: Associate -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-5 hidden sm:block">
             <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-600 shadow-sm">ID: {{ expediente.id }}</span>
          </div>
          <p class="text-verde-cope dark:text-red-500 font-black text-xs uppercase tracking-[0.4em] mb-3">Asociado Titular</p>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none break-words">{{ expediente.nombre_asociado }}</h2>
          <div class="mt-8 flex items-center gap-4">
            <div class="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-600 shrink-0">
              <svg class="w-6 h-6 text-gray-400 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Sede de Origen</p>
              <p class="text-gray-800 dark:text-gray-200 font-black uppercase tracking-tight">{{ (expediente as any).agencia?.nombre || 'Sucursal General' }}</p>
            </div>
          </div>
        </div>

        <!-- Card 2: Document Reference -->
        <div class="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between group hover:border-red-600 dark:hover:border-red-500 transition-colors">
          <p class="text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest">Referencia Documental</p>
          <p class="text-3xl font-mono font-black text-gray-900 dark:text-white mt-2 tracking-tighter break-all">{{ expediente.numero_documento }}</p>
          <div class="mt-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">Expediente ID</span>
            <span class="text-gray-700 dark:text-gray-300 font-bold text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600">#{{ expediente.id }}</span>
          </div>
        </div>

        <!-- Card 3: Amount -->
        <div class="bg-gray-50 dark:bg-gray-700/30 p-8 rounded-[3rem] shadow-inner border border-gray-200 dark:border-gray-600 flex flex-col justify-center">
          <p class="text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">Monto de Operación</p>
          <div class="space-y-1">
            <span class="text-gray-700 dark:text-gray-300 font-bold text-lg uppercase leading-none">Quetzales</span>
            <p class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Q. {{ (expediente as any).monto_documento }}</p>
          </div>
        </div>
      </div>

      <!-- RESULTS: DOCUMENTS TABLE -->
      <div class="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden flex flex-col">
        
        <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800">
          <div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Documentos Vinculados</h3>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Auditoría de relaciones activas en el sistema</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-white dark:bg-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
              <span class="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest">
                {{ (expediente as any).documentos?.length || 0 }} Registros
              </span>
            </div>
            <button 
              @click="openLinkModal"
              class="flex items-center gap-2 px-5 py-2.5 bg-verde-cope hover:bg-green-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Vincular Garantía
            </button>
          </div>
        </div>

        <div class="p-2 overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-transparent">
                <th class="px-6 py-5">Ref. ID</th>
                <th class="px-6 py-5">Categoría del Documento</th>
                <th class="px-6 py-5">Identificador / Número</th>
                <th class="px-6 py-5 text-center">Registro</th>
                <th class="px-6 py-5 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="doc in (expediente as any).documentos" :key="doc.id" class="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-default">
                <td class="px-6 py-5 font-mono text-xs font-black text-red-600 dark:text-red-500">ID-{{ doc.id }}</td>
                <td class="px-6 py-5 border-x border-gray-50 dark:border-gray-700/50">
                  <p class="font-black text-gray-800 dark:text-white text-sm uppercase leading-none mb-1.5">{{ doc.tipo_documento?.nombre || 'General' }}</p>
                  <div class="flex items-center gap-1.5 mt-1.5 font-bold uppercase tracking-widest text-[9px]">
                    <span 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="doc.estado === 'ACTIVO' ? 'bg-emerald-500' : (doc.estado === 'INACTIVO' ? 'bg-orange-500' : 'bg-gray-500')"
                    ></span>
                    <span :class="doc.estado === 'ACTIVO' ? 'text-emerald-600 dark:text-emerald-400' : (doc.estado === 'INACTIVO' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400')">
                        {{ doc.estado || 'S/E' }}
                    </span>
                  </div>
                  <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider line-clamp-1 mt-2">{{ doc.propietario || 'S/D' }}</p>
                </td>
                <td class="px-6 py-5 font-mono font-bold text-gray-700 dark:text-gray-300 text-sm tracking-tight">{{ doc.numero || 'S/N' }}</td>
                <td class="px-6 py-5 text-center">
                   <span class="font-bold text-[10px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md uppercase border border-transparent dark:border-gray-600">{{ formatDate(doc.fecha) }}</span>
                </td>
                <td class="px-6 py-5 text-right">
                  <button 
                    @click="confirmUnlink(doc)"
                    class="ml-auto flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-transparent dark:border-red-500/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Quitar
                  </button>
                </td>
              </tr>
              <tr v-if="!((expediente as any).documentos?.length)">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                  No hay garantías vinculadas registradas para este expediente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    

    <!-- MODAL VINCULACIÓN -->
    <Teleport to="body">
      <div v-if="showLinkModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-slide-up flex flex-col">
          
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Vincular Nueva Garantía</h3>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Busque y seleccione el documento para asociar</p>
            </div>
            <button @click="closeLinkModal" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Número de Garantía</label>
                <input v-model="linkSearch.numero" type="text" placeholder="Ej: 123456" class="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:border-verde-cope transition-all focus:ring-0">
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Fecha de Garantía</label>
                <input v-model="linkSearch.fecha" type="date" class="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:border-verde-cope transition-all focus:ring-0">
              </div>
            </div>

            <button 
              @click="searchGuarantees"
              :disabled="!linkSearch.numero || !linkSearch.fecha || searchingGuarantees"
              class="w-full py-4 bg-azul-cope hover:bg-verde-cope text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span v-if="searchingGuarantees" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span>
              {{ searchingGuarantees ? 'Buscando Registros...' : 'Consultar Garantía' }}
            </button>

            <!-- Results List -->
            <div v-if="linkResults.length > 0" class="space-y-3">
               <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resultados Encontrados ({{ linkResults.length }})</p>
               <div class="space-y-3">
                  <div v-for="res in linkResults" :key="res.id" class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-verde-cope transition-all">
                    <div class="space-y-1">
                      <p class="text-[10px] font-black text-verde-cope uppercase tracking-[0.2em]">{{ res.tipo_documento?.nombre || 'General' }}</p>
                      <p class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{{ res.propietario || 'Sin Propietario' }}</p>
                      <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 font-mono">ID: {{ res.id }} | NÚMERO: {{ res.numero }}</p>
                    </div>
                    <button 
                      @click="linkDocument(res.id)"
                      class="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-verde-cope hover:text-white hover:border-verde-cope transition-all shadow-sm active:scale-95"
                    >
                      Vincular
                    </button>
                  </div>
               </div>
            </div>
            <div v-else-if="guaranteesSearched && linkResults.length === 0" class="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
               <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">No se encontraron garantías</p>
               <p class="text-[10px] text-gray-400 uppercase mt-1">Verifique el número y la fecha ingresada</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

// State
const searchQuery = ref('')
const lastSearch = ref('')
const searching = ref(false)
const expediente = ref<any>(null)
const expedienteEncontrado = ref<boolean | null>(null)

// Vincular Garantía State
const showLinkModal = ref(false)
const searchingGuarantees = ref(false)
const guaranteesSearched = ref(false)
const linkSearch = ref({
    numero: '',
    fecha: ''
})
const linkResults = ref<any[]>([])

// Methods
const searchExpediente = async () => {
  if (!searchQuery.value) return
  
  errorReseter()
  searching.value = true
  lastSearch.value = searchQuery.value
  
  try {
    const { data } = await api.get('/admin/desvinculacion/buscar-expediente', {
      params: { numero_documento: searchQuery.value }
    })
    
    if (data.success && data.data) {
      expediente.value = data.data
      expedienteEncontrado.value = true
    } else {
      expediente.value = null
      expedienteEncontrado.value = false
    }
  } catch (error) {
    console.error('Search error:', error)
    expediente.value = null
    expedienteEncontrado.value = false
  } finally {
    searching.value = false
  }
}

const confirmUnlink = (documento: any) => {
  const docName = documento.tipo_documento?.nombre || 'Documento'
  const docNum = documento.numero || documento.id
  const isDark = document.documentElement.classList.contains('dark')

  Swal.fire({
    title: '¿Confirmar Desvinculación?',
    html: `
        <div class="text-center space-y-4">
            <p class="text-sm text-slate-500 dark:text-slate-400">Esta acción removerá la asociación permanente entre este expediente y el documento físico seleccionado.</p>
            <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 text-left space-y-2">
                <p class="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-500 tracking-widest">Documento Seleccionado</p>
                <p class="text-lg font-black text-slate-800 dark:text-white uppercase">${docName}</p>
                <p class="text-xs font-mono text-slate-600 dark:text-slate-400">NÚMERO: ${docNum}</p>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">PROPIETARIO: ${documento.propietario || 'N/A'}</p>
            </div>
        </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'SÍ, QUITAR VÍNCULO',
    cancelButtonText: 'CANCELAR',
    background: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#ffffff' : '#0f172a',
    customClass: {
        popup: 'rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl',
        confirmButton: 'rounded-xl font-black px-6 py-3',
        cancelButton: 'rounded-xl font-black px-6 py-3'
    },
    hideClass: { popup: 'animate-slide-down' },
    backdrop: isDark ? `rgba(15, 23, 42, 0.7)` : `rgba(241, 245, 249, 0.7)`
  }).then((result) => {
    if (result.isConfirmed) {
      unlinkDocument(documento.id)
    }
  })
}

const unlinkDocument = async (documentoId: number) => {
  const isDark = document.documentElement.classList.contains('dark')
  try {
    const { data } = await api.delete('/admin/desvinculacion/unlink', {
      data: {
        nuevo_expediente_id: expediente.value.id,
        documento_id: documentoId
      }
    })
    
    if (data.success) {
      // Remove from local list
      expediente.value.documentos = expediente.value.documentos.filter((d: any) => d.id !== documentoId)
      
      Swal.fire({
        icon: 'success',
        title: '¡Vínculo Eliminado!',
        text: 'La relación se ha disuelto correctamente.',
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#ffffff' : '#0f172a',
        customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl' },
        backdrop: isDark ? `rgba(15, 23, 42, 0.7)` : `rgba(241, 245, 249, 0.7)`
      })
    }
  } catch (error: any) {
    console.error('Unlink error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error de Sistema',
      text: error.response?.data?.message || 'No se pudo completar la desvinculación.',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#ffffff' : '#0f172a',
      customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl' },
      backdrop: isDark ? `rgba(15, 23, 42, 0.7)` : `rgba(241, 245, 249, 0.7)`
    })
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'S/F'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date).replace('.', '')
}

const errorReseter = () => {
  expedienteEncontrado.value = null
  expediente.value = null
}

// Vincular Garantía Methods
const openLinkModal = () => {
    linkSearch.value = { numero: '', fecha: '' }
    linkResults.value = []
    guaranteesSearched.value = false
    showLinkModal.value = true 
}

const closeLinkModal = () => {
    showLinkModal.value = false
}

const searchGuarantees = async () => {
    if (!linkSearch.value.numero || !linkSearch.value.fecha) return
    
    searchingGuarantees.value = true
    guaranteesSearched.value = true
    
    try {
        const { data } = await api.get('/admin/desvinculacion/search-documentos', {
            params: linkSearch.value
        })
        if (data.success) {
            linkResults.value = data.data
        }
    } catch (error) {
        console.error('Search guarantees error:', error)
        linkResults.value = []
    } finally {
        searchingGuarantees.value = false
    }
}

const linkDocument = async (documentoId: number) => {
    const isDark = document.documentElement.classList.contains('dark')
    try {
        Swal.showLoading()
        const { data } = await api.post('/admin/desvinculacion/link', {
            nuevo_expediente_id: expediente.value.id,
            documento_id: documentoId
        })
        
        if (data.success) {
            // Refresh local data (re-run search to get complete object with relations)
            await searchExpediente()
            closeLinkModal()
            
            Swal.fire({
                icon: 'success',
                title: '¡Vínculo Exitoso!',
                text: 'La garantía ha sido vinculada correctamente.',
                timer: 2000,
                showConfirmButton: false,
                background: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#ffffff' : '#0f172a',
                customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl' },
                backdrop: isDark ? `rgba(15, 23, 42, 0.7)` : `rgba(241, 245, 249, 0.7)`
            })
        }
    } catch (error: any) {
        console.error('Link error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error de Vinculación',
            text: error.response?.data?.message || 'No se pudo vincular el documento.',
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl' },
            backdrop: isDark ? `rgba(15, 23, 42, 0.7)` : `rgba(241, 245, 249, 0.7)`
        })
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-slide-down { animation: slideDown 0.3s ease-out; }
.animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.2); border-radius: 20px; }
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(51, 65, 85, 0.5); }
</style>
