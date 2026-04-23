<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Encabezado
                    title="Buzón Entrantes/Pendientes"
                    subtitle="Expedientes enviados a Protocolos que requieren revisión de crédito."
                    labelIndicator="Secretaria Créditos"
                    indicator-color="bg-cyan-600"
                />
                
                <div class="flex items-center gap-3">
                    <router-link :to="{ name: 'secretaria-credito-edicion' }" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Expedientes
                    </router-link>
                    <router-link :to="{ name: 'secretaria-credito-buzon-completados' }" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completados
                    </router-link>
                     <button @click="fetchExpedientes" class="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition shadow-sm" title="Refrescar listado">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Filtros y Búsqueda -->
             <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div class="relative w-full md:w-80">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            v-model="search"
                            @input="debouncedSearch"
                            type="text" 
                            placeholder="Código, Nombre, CUI o Producto..." 
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-verde-cope focus:border-verde-cope sm:text-sm transition-colors"
                        >
                    </div>

                    <div class="w-full md:w-64">
                        <select 
                            v-model="selectedAgencia"
                            @change="debouncedSearch"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-verde-cope focus:border-verde-cope sm:text-sm transition-colors"
                        >
                            <option value="">Todas las Agencias</option>
                            <option v-for="agencia in agencias" :key="agencia.id" :value="agencia.id">
                                {{ agencia.nombre }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                    <thead class="bg-table-azul dark:bg-table-verde text-white">
                        <tr>
                            <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">
                                ID Exp
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Código / CUI
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Nombre Asociado
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Agencia / Asesor
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Monto / Tasa
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                                Desembolso / Producto
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">
                                Fecha Recibido
                            </th>
                            <th scope="col" class="w-20 px-2 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                        <tr v-if="loading && expedientes.length === 0">
                            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 border-4 border-verde-cope border-t-transparent rounded-full animate-spin"></div>
                                    <span class="font-medium text-xs">Cargando expedientes...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="expedientes.length === 0">
                            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p class="text-base font-medium text-slate-500 dark:text-slate-400">No hay expedientes en buzón</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td class="px-4 py-4 text-center">
                                <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.id }}</span>
                            </td>

                            <td class="px-6 py-4">
                                <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
                                <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.cui || '---' }}</div>
                            </td>

                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                {{ exp.nombre_asociado }}
                            </td>

                                                    <td class="px-6 py-4 text-center">
                            <div class="inline-flex flex-col">
                                <span class="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase mb-1">
                                    Agencia: {{ exp.id_agencia || '-' }}
                                </span>
                                <span class="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                                    {{ exp.usuario_asesor || '-' }}
                                </span>
                            </div>
                        </td>

                            <td class="px-6 py-4">
                                <div class="font-mono font-bold text-azul-cope dark:text-blue-300">
                                    {{ formatCurrency(exp.monto_documento) }}
                                </div>
                                <div class="text-[11px] text-verde-cope dark:text-green-500 font-medium mt-0.5 uppercase">
                                    Tasa: {{ exp.tasa_interes || '0' }}%
                                </div>
                            </td>

                            <td class="px-6 py-4">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.fecha_inicio ? formatDate(exp.fecha_inicio) : 'N/A' }}
                                </div>
                                <div class="text-[10px] text-verde-cope font-bold mt-0.5 uppercase italic">
                                    Prod: #{{ exp.numero_documento || exp.id }}
                                </div>
                            </td>

                             <td class="px-6 py-4 text-center">
                                <div class="text-slate-600 dark:text-slate-300 font-medium text-xs">
                                    {{ exp.fechas?.f_enviado_protocolos ? formatDateTime(exp.fechas.f_enviado_protocolos) : 'N/A' }}
                                </div>
                            </td>

                            <td class="px-2 py-4 text-center">
                                <button 
                                    @click="openDetails(exp)"
                                    class="p-2 text-azul-cope hover:bg-azul-cope hover:text-white rounded-lg transition-all border border-azul-cope/20 group/btn shadow-sm"
                                    title="Revisar Expediente">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

             <!-- Paginación -->
             <div v-if="pagination.total > 0" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                        Mostrando
                        <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.from }}</span>
                        –
                        <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.to }}</span>
                        de
                        <span class="font-bold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span>
                    </div>

                    <div class="flex items-center justify-center md:justify-end gap-2 flex-wrap">
                        <button
                            type="button"
                            @click="changePage(pagination.current_page - 1)"
                            :disabled="loading || pagination.current_page === 1"
                            class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Anterior
                        </button>

                        <button
                            v-for="item in pageItems"
                            :key="String(item)"
                            type="button"
                            @click="typeof item === 'number' ? changePage(item) : null"
                            :disabled="loading || item === '...'"
                            :class="[
                                'min-w-[40px] px-3 py-2 rounded-xl text-xs font-extrabold transition border',
                                item === '...'
                                    ? 'border-transparent bg-transparent text-slate-400 dark:text-slate-500 cursor-default'
                                    : (item === pagination.current_page
                                        ? 'border-cyan-600 bg-cyan-600 text-white shadow-sm'
                                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900')
                            ]"
                        >
                            {{ item }}
                        </button>

                        <button
                            type="button"
                            @click="changePage(pagination.current_page + 1)"
                            :disabled="loading || pagination.current_page === pagination.last_page"
                            class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/40 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
             </div>
        </div>

        <SecretariaCreditoDetallesModal 
            :show="showModal"
            :expediente="selectedExpediente"
            @close="closeModal"
            @refresh="fetchExpedientes"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import SecretariaCreditoDetallesModal from '../tracking/components/SecretariaCreditoDetallesModal.vue'
import Encabezado from '../../components/common/encabezado.vue'

interface Expediente {
    id: number;
    codigo_cliente: string;
    nombre_asociado: string;
    id_agencia: string;
    usuario_asesor: string;
    monto_documento: number;
    cui: string;
    tasa_interes: number;
    fecha_inicio: string;
    numero_documento: string;
    fechas: {
        f_enviado_protocolos: string | null;
    } | null;
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const search = ref('')
const selectedAgencia = ref('')
const agencias = ref<any[]>([])
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
})

const showModal = ref(false)
const selectedExpediente = ref<any>(null)

// Debounce helper
let timeout: any = null
const debouncedSearch = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        pagination.value.current_page = 1
        fetchExpedientes()
    }, 500)
}

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const params = {
            page: pagination.value.current_page,
            search: search.value,
            id_agencia: selectedAgencia.value
        }
        const res = await api.get('/secretaria-credito/solicitudes', { params })
        if (res.data.success) {
            expedientes.value = res.data.data.data
            pagination.value = {
                current_page: res.data.data.current_page,
                last_page: res.data.data.last_page,
                total: res.data.data.total,
                from: res.data.data.from,
                to: res.data.data.to
            }
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
    } finally {
        loading.value = false
    }
}

const changePage = (page: number) => {
    if (page > 0 && page <= pagination.value.last_page) {
        pagination.value.current_page = page
        fetchExpedientes()
    }
}

const pageItems = computed<(number | '...')[]>(() => {
    const current = pagination.value.current_page || 1
    const last = pagination.value.last_page || 1
    if (last <= 1) return [1]

    const windowSize = 2
    const pages = new Set<number>([1, last])
    for (let i = current - windowSize; i <= current + windowSize; i++) {
        if (i >= 1 && i <= last) pages.add(i)
    }

    const sorted = Array.from(pages).sort((a, b) => a - b)
    const items: (number | '...')[] = []
    sorted.forEach((page, i) => {
        if (i > 0) {
            const prev = sorted[i - 1]
            if (prev !== undefined && page - prev > 1) items.push('...')
        }
        items.push(page)
    })
    return items
})

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    if (dateString.length === 10) {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES')
    }
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString()
}

const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

const openDetails = (expediente: any) => {
    selectedExpediente.value = expediente
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedExpediente.value = null
}

const fetchAgencias = async () => {
    try {
        const res = await api.get('/agencias', { params: { all: 1 } })
        if (Array.isArray(res.data)) {
            agencias.value = res.data
        } else if (res.data.data && Array.isArray(res.data.data)) {
            agencias.value = res.data.data
        }
    } catch (error) {
        console.error('Error fetching agencies:', error)
    }
}

onMounted(() => {
    fetchAgencias()
    fetchExpedientes()
})
</script>
