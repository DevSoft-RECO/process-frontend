<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <!-- Header con Stats y Filtros -->
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mb-3 tracking-wide">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Espacio de Trabajo
                    </span>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        Bandeja de Abogado
                        <span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                            {{ filteredExpedientes.length }}
                        </span>
                    </h1>
                     <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                        Gestione los expedientes asignados para su revisión y trámite legal.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative group">
                         <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            v-model="search" 
                            type="text" 
                            placeholder="Buscar expediente..." 
                            class="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all shadow-sm group-hover:shadow-md"
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="overflow-x-auto">
            <div v-if="loading" class="p-12 flex justify-center">
                 <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                     <span class="text-gray-500 text-sm font-medium animate-pulse">Cargando expedientes...</span>
                </div>
            </div>

            <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50/50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Expediente</th>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                         <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Recibido</th>
                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
                     <tr v-if="filteredExpedientes.length === 0" class="group">
                        <td colspan="4" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center gap-3">
                                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-full">
                                    <svg class="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                </div>
                                <p class="text-gray-500 text-sm">No se encontraron expedientes</p>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="expediente in filteredExpedientes" :key="expediente.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                    {{ expediente.codigo_cliente.toString().slice(-2) }}
                                </div>
                                 <div class="ml-4">
                                    <div class="text-sm font-bold text-gray-900 dark:text-white">{{ expediente.codigo_cliente }}</div>
                                </div>
                            </div>
                        </td>
                         <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white">{{ expediente.nombre_asociado || 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white" v-if="expediente.fechas?.f_aceptado_abogado">
                                {{ formatDate(expediente.fechas.f_aceptado_abogado) }}
                                <div class="text-xs text-gray-500">
                                    {{ timeAgo(expediente.fechas.f_aceptado_abogado) }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400" v-else>
                                <span class="italic text-gray-300 dark:text-gray-600">Pendiente de recepción</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                @click="openDetails(expediente)" 
                                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700"
                            >
                                Revisar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <AbogadoDetallesModal 
            :show="showModal" 
            :expediente="selectedExpediente" 
            @close="closeDetails" 
            @refresh="fetchExpedientes"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import AbogadoDetallesModal from './components/AbogadoDetallesModal.vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'

const expedientes = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)
const selectedExpediente = ref<any>(null)

onMounted(() => {
    fetchExpedientes()
})

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const res = await api.get('/abogado/buzon')
        if (res.data.success) {
            expedientes.value = res.data.data
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const filteredExpedientes = computed(() => {
    if (!search.value) return expedientes.value
    const s = search.value.toLowerCase()
    return expedientes.value.filter(e => 
        e.codigo_cliente.toString().includes(s) || 
        e.nombre_asociado?.toLowerCase().includes(s)
    )
})

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a", { locale: es })
}

const timeAgo = (dateString: string) => {
    if (!dateString) return ''
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
}

const openDetails = (expediente: any) => {
    selectedExpediente.value = expediente
    showModal.value = true
}

const closeDetails = () => {
    showModal.value = false
    selectedExpediente.value = null
}
</script>
