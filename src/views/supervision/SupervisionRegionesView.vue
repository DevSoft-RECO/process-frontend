<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-6">
             <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <Encabezado
                    title="Supervisión Regional"
                    subtitle="Panorama completo de expedientes de todas las agencias."
                    labelIndicator="Regional"
                    indicator-color="bg-indigo-600"
                />
            </div>
            
             <!-- Tabs and Filters -->
            <div class="relative z-30 flex flex-col xl:flex-row xl:items-start justify-between gap-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm">
                
                <div class="flex flex-col gap-4 w-full">
                    <!-- Tabs Navigation -->
                    <div class="flex flex-wrap items-center gap-2">
                        <button 
                            v-for="tab in tabs" 
                            :key="tab.id"
                            @click="changeTab(tab.id)"
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                                currentTab === tab.id 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            ]"
                        >
                            <component :is="tab.icon" class="w-4 h-4" />
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Filters Row 1: Advisor, Date, Agencies, Actions -->
                    <div class="flex flex-col xl:flex-row items-center gap-3 w-full">
                        <!-- Asesor Search -->
                        <div class="relative w-full xl:w-64">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                v-model="filtroAsesor"
                                @keyup.enter="aplicarFiltros"
                                type="text"
                                placeholder="Buscar asesor responsable..."
                                class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        <!-- Date Search -->
                        <div class="w-full xl:w-48">
                            <input
                                v-model="filtroFecha"
                                @change="aplicarFiltros"
                                type="date"
                                title="Filtrar por Fecha de Desembolso"
                                class="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-slate-700 dark:text-slate-300"
                            />
                        </div>

                        <!-- Agency Compact Filter -->
                        <div class="relative w-full xl:w-72">
                            <button 
                                @click.stop="showAgenciasDropdown = !showAgenciasDropdown"
                                class="flex items-center justify-between w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors"
                            >
                                <div class="flex items-center gap-2 overflow-hidden">
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span class="truncate">
                                        {{ agenciasSeleccionadas.length === 0 ? 'Todas las Agencias' : `${agenciasSeleccionadas.length} agencias seleccionadas` }}
                                    </span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 transition-transform duration-200', showAgenciasDropdown ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <div 
                                v-if="showAgenciasDropdown" 
                                v-click-outside="() => showAgenciasDropdown = false"
                                class="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                <div class="flex items-center justify-between p-2 mb-2 border-b border-gray-100 dark:border-slate-700">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agencias</span>
                                    <div class="flex items-center gap-2">
                                        <button @click="seleccionarTodasAgencias" class="text-[10px] text-indigo-500 hover:underline">Todas</button>
                                        <button @click="deseleccionarTodasAgencias" class="text-[10px] text-slate-400 hover:text-slate-600">Ninguna</button>
                                    </div>
                                </div>
                                <div class="max-h-60 overflow-y-auto custom-scrollbar">
                                    <div 
                                        v-for="agencia in agenciasList" 
                                        :key="agencia.id"
                                        @click="toggleAgencia(agencia.id)"
                                        class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                    >
                                        <div :class="['w-4 h-4 rounded border flex items-center justify-center transition-colors', agenciasSeleccionadas.includes(agencia.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600']">
                                            <svg v-if="agenciasSeleccionadas.includes(agencia.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <span class="text-xs text-slate-600 dark:text-slate-300">{{ agencia.nombre }}</span>
                                    </div>
                                </div>
                                <div class="mt-2 p-2 pt-0">
                                    <button 
                                        @click="showAgenciasDropdown = false; aplicarFiltros()"
                                        class="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        Aplicar Selección
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                             <button 
                                v-if="filtroAsesor || filtroFecha || agenciasSeleccionadas.length > 0"
                                @click="limpiarFiltros"
                                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Limpiar filtros"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <button 
                                @click="aplicarFiltros"
                                class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                     <thead class="bg-indigo-600 text-white">
                        <tr>
                            <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">
                                ID Exp
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Agencia
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Código / Cliente
                            </th>
                             <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Asesor / Desembolso
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Asociado
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Monto / Tasa
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Estado Actual
                            </th>
                            <th scope="col" class="w-32 px-2 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                     <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                        <tr v-if="loading && expedientes.length === 0">
                            <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span class="font-medium text-xs">Cargando expedientes regionales...</span>
                                </div>
                            </td>
                        </tr>
                         <tr v-else-if="expedientes.length === 0">
                             <td colspan="8" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <p class="text-base font-medium text-slate-500 dark:text-slate-400">No se encontraron expedientes con los filtros seleccionados.</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="exp in expedientes" :key="exp.id" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td class="px-4 py-4 text-center">
                                <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.id }}</span>
                            </td>

                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {{ getAgenciaNombre(exp.id_agencia) }}
                                </span>
                            </td>

                             <td class="px-6 py-4">
                                <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
                                <div class="text-[12px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.cui || '---' }}</div>
                            </td>
                            
                             <td class="px-6 py-4">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                     {{ exp.usuario_asesor || 'No Asignado' }}
                                </div>
                                <div class="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1" title="Fecha Desembolso">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ exp.fecha_inicio ? new Date(exp.fecha_inicio).toLocaleDateString('es-GT') : 'Sin Fecha' }}
                                </div>
                            </td>

                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                {{ exp.nombre_asociado }}
                            </td>
                            
                             <td class="px-6 py-4">
                                <div class="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {{ formatCurrency(exp.monto_documento || 0) }}
                                </div>
                                <div class="text-[11px] text-green-600 dark:text-green-500 font-medium mt-0.5 uppercase">
                                    Tasa: {{ exp.tasa_interes || '0' }}%
                                </div>
                            </td>

                             <td class="px-6 py-4 text-center">
                                <span v-if="esCompletado(exp)" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    Finalizado
                                </span>
                                <span v-else-if="exp.seguimientos && exp.seguimientos.length > 0" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    En Proceso
                                </span>
                                <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                                    Sin Ingresar
                                </span>
                                <div v-if="exp.seguimientos && exp.seguimientos.length > 0 && exp.seguimientos[0]" class="text-[10px] text-gray-500 mt-1">
                                    {{ formatDate(exp.seguimientos[0].created_at) }}
                                </div>
                            </td>

                            <td class="px-2 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button 
                                        @click="verDetalles(exp)" 
                                        class="p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-600/20 group/btn shadow-sm"
                                        title="Ver Detalles"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>

                                    <button 
                                        v-if="exp.seguimientos && exp.seguimientos.length > 0 && exp.seguimientos[0]"
                                        @click="verTracking(exp)" 
                                        class="p-2 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all border border-purple-500/30 group/btn shadow-sm"
                                        title="Ver Tracking"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Mostrando <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.from }}</span> a <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.to }}</span> de <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span> registros
                </div>
                
                <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button 
                        @click="goToPage(pagination.current_page - 1)"
                        :disabled="pagination.current_page === 1 || loading"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-800"
                    >
                        <span class="sr-only">Anterior</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <template v-for="page in displayedPages" :key="page">
                        <button 
                            v-if="page !== '...'"
                            @click="goToPage(page as number)"
                            :class="[
                                pagination.current_page === page 
                                    ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                                    : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-800'
                            ]"
                        >
                            {{ page }}
                        </button>
                        <span 
                            v-else
                            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-400 dark:ring-gray-600"
                        >
                            ...
                        </span>
                    </template>

                    <button 
                        @click="goToPage(pagination.current_page + 1)"
                        :disabled="pagination.current_page === pagination.last_page || loading"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-800"
                    >
                        <span class="sr-only">Siguiente</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>

      <ArchivoDetalleModal 
        :show="showDetalleModal" 
        :id-seguimiento="selectedSeguimientoId" 
        @close="showDetalleModal = false" 
      />

      <TrackingModal
        :show="showTrackingModal"
        :expediente="selectedTrackingExpediente"
        @close="showTrackingModal = false"
      />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, markRaw, h } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import ArchivoDetalleModal from '../archivo/components/ArchivoDetalleModal.vue'
import TrackingModal from '../consultas/components/TrackingModal.vue'
import Encabezado from '@/components/common/encabezado.vue'

interface Seguimiento {
    id_seguimiento: number;
    id_expediente: number;
    id_estado: number;
    id_estado_secundario: number;
    archivado_at: string | null;
    created_at: string;
}

interface Expediente {
    id: number;
    codigo_cliente: string;
    usuario_asesor: string;
    nombre_asociado: string;
    monto_documento: number;
    id_agencia: number;
    cui: string;
    tasa_interes: number;
    fecha_inicio: string;
    numero_documento: string;
    seguimientos?: Seguimiento[];
}

interface Agencia {
    id: number;
    nombre: string;
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const agenciasList = ref<Agencia[]>([])
const agenciasSeleccionadas = ref<number[]>([])

const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
})

// Modals State
const showDetalleModal = ref(false)
const selectedSeguimientoId = ref<number | null>(null)
const showTrackingModal = ref(false)
const selectedTrackingExpediente = ref<any>(null)

// Tabs and Filters State
const currentTab = ref('nuevos')
const filtroAsesor = ref('')
const filtroFecha = ref('')
const showAgenciasDropdown = ref(false)

const iconNuevo = markRaw({ 
    render() {
        return h('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", class: "w-4 h-4" }, [
            h('path', { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" })
        ])
    }
})

const iconSeguimiento = markRaw({ 
    render() {
        return h('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", class: "w-4 h-4" }, [
            h('path', { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
        ])
    }
})

const iconFinalizado = markRaw({ 
    render() {
        return h('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", class: "w-4 h-4" }, [
            h('path', { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })
        ])
    }
})

const tabs = [
    { id: 'nuevos', label: 'Cargados', icon: iconNuevo },
    { id: 'seguimiento', label: 'En Seguimiento', icon: iconSeguimiento },
    { id: 'finalizados', label: 'Completados', icon: iconFinalizado }
]

const fetchAgencias = async () => {
    try {
        const response = await api.get('/expedientes/agencias')
        // The API now returns a direct array of objects [{id, nombre, ...}]
        agenciasList.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
        console.error('Error cargando agencias:', error)
        agenciasList.value = []
    }
}

const fetchExpedientes = async (page: number = 1) => {
    loading.value = true
    try {
        const response = await api.get('/supervision/regiones', {
            params: { 
                page,
                tab: currentTab.value,
                asesor: filtroAsesor.value || null,
                fecha_inicio: filtroFecha.value || null,
                // Ensure we only send an array if it has elements
                agencias: agenciasSeleccionadas.value.length > 0 ? agenciasSeleccionadas.value : null
            }
        })

        if (response.data.success) {
            const resData = response.data.data
            expedientes.value = resData.data
            pagination.value = {
                current_page: resData.current_page,
                last_page: resData.last_page,
                total: resData.total,
                from: resData.from,
                to: resData.to
            }
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes regionales.', 'error')
    } finally {
        loading.value = false
    }
}

const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.last_page && !loading.value) {
        fetchExpedientes(page)
    }
}

const changeTab = (tabId: string) => {
    currentTab.value = tabId
    fetchExpedientes(1)
}

const aplicarFiltros = () => {
    fetchExpedientes(1)
}

const limpiarFiltros = () => {
    filtroAsesor.value = ''
    filtroFecha.value = ''
    agenciasSeleccionadas.value = []
    fetchExpedientes(1)
}

const seleccionarTodasAgencias = () => {
    if (Array.isArray(agenciasList.value)) {
        agenciasSeleccionadas.value = agenciasList.value.map(a => a.id)
        aplicarFiltros()
    }
}

const deseleccionarTodasAgencias = () => {
    agenciasSeleccionadas.value = []
}

const toggleAgencia = (id: number) => {
    const index = agenciasSeleccionadas.value.indexOf(id)
    if (index === -1) {
        agenciasSeleccionadas.value.push(id)
    } else {
        agenciasSeleccionadas.value.splice(index, 1)
    }
}

const vClickOutside = {
    mounted(el: any, binding: any) {
        el.clickOutsideEvent = (event: any) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted(el: any) {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

const getAgenciaNombre = (id: number) => {
    if (!agenciasList.value || !Array.isArray(agenciasList.value)) return `Agencia #${id}`
    const agencia = agenciasList.value.find(a => a.id === id)
    return agencia ? agencia.nombre : `Agencia #${id}`
}

const displayedPages = computed(() => {
    const current = pagination.value.current_page
    const last = pagination.value.last_page
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
            range.push(i)
        }
    }

    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
})

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-GT', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const esCompletado = (exp: Expediente) => {
    if (!exp.seguimientos || exp.seguimientos.length === 0 || !exp.seguimientos[0]) return false;
    const seg = exp.seguimientos[0];
    return seg.id_estado === 11 || seg.id_estado_secundario === 11;
}

const verDetalles = (exp: Expediente) => {
    if (exp.seguimientos && exp.seguimientos.length > 0 && exp.seguimientos[0]) {
        selectedSeguimientoId.value = exp.seguimientos[0].id_seguimiento
        showDetalleModal.value = true
    } else {
        Swal.fire('Información', 'Este expediente no tiene detalles avanzados registrados.', 'info')
    }
}

const verTracking = (exp: Expediente) => {
    selectedTrackingExpediente.value = exp;
    showTrackingModal.value = true;
}

onMounted(() => {
    fetchAgencias()
    fetchExpedientes()
})
</script>
