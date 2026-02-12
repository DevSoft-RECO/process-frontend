<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        
        <!-- Header Principal -->
        <header class="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white shadow-lg relative overflow-hidden">
             <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10"></div>
             <div class="container mx-auto px-4 py-8 relative z-10">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                         <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
                            Enviados a Abogados
                        </h1>
                         <p class="text-indigo-200 mt-1 text-sm md:text-base font-light">
                            Expedientes bajo análisis jurídico
                        </p>
                    </div>
                     <div class="flex items-center gap-3">
                        <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl">
                             <div class="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Total Enviados</div>
                             <div class="text-2xl font-bold text-white text-center">{{ expedientes.length }}</div>
                        </div>
                    </div>
                </div>
             </div>
        </header>

         <!-- Contenido Principal -->
        <main class="container mx-auto px-4 py-8 -mt-6 relative z-20">
             <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                
                <!-- Toolbar de Filtros -->
                <div class="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div class="relative w-full sm:w-96 group">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            v-model="search" 
                            type="text" 
                            class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                            placeholder="Buscar expediente, asociado o código..."
                        >
                    </div>
                </div>

                 <!-- Tabla de Resultados -->
                <div class="overflow-x-auto">
                     <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Id Expediente / Cliente
                                </th>
                                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Asociado
                                </th>
                                 <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Abogado Asignado
                                </th>
                                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Estado Actual
                                </th>
                                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fecha Envío
                                </th>
                                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                         <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-if="loading" class="animate-pulse">
                                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">Cargando expedientes...</td>
                            </tr>
                            <tr v-else-if="filteredExpedientes.length === 0">
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center text-gray-400">
                                        <svg class="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                        <p class="text-base font-medium">No se encontraron expedientes</p>
                                    </div>
                                </td>
                            </tr>
                             <tr v-for="expediente in filteredExpedientes" :key="expediente.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                            {{ expediente.id }}
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
                                     <div v-if="expediente.seguimientos?.[0]?.bufete" class="flex items-center gap-2">
                                        <div class="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ expediente.seguimientos[0].bufete.user?.name }}</div>
                                            <div class="text-xs text-gray-500">{{ expediente.seguimientos[0].bufete.agencia?.nombre }}</div>
                                        </div>
                                     </div>
                                     <span v-else class="text-xs text-gray-400 italic">No asignado</span>
                                </td>
                                 <td class="px-6 py-4 whitespace-nowrap">
                                     <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                        {{ expediente.seguimientos?.[0]?.estado?.nombre || 'En Proceso' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">
                                        {{ formatDate(expediente.fechas?.f_enviado_abogado) }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        Hace {{ timeAgo(expediente.fechas?.f_enviado_abogado) }}
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

                <!-- Pagination (Placeholder) -->
                <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                     <span class="text-sm text-gray-500 dark:text-gray-400">Mostrando {{ filteredExpedientes.length }} expedientes</span>
                </div>
            </div>
        </main>
        
        <!-- Modal de Detalles -->
        <SecretariaAbogadoDetallesModal
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
import SecretariaAbogadoDetallesModal from '../tracking/components/SecretariaAbogadoDetallesModal.vue'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const expedientes = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const selectedExpediente = ref<any>(null)

onMounted(() => {
    fetchExpedientes()
})

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const res = await api.get('/secretaria-credito/abogados')
        if (res.data.success) {
            expedientes.value = res.data.data
        }
    } catch (error) {
        console.error(error)
        // Swal.fire('Error', 'Error al cargar expedientes enviados a abogados.', 'error')
    } finally {
        loading.value = false
    }
}

const filteredExpedientes = computed(() => {
    if (!search.value) return expedientes.value
    const term = search.value.toLowerCase()
    return expedientes.value.filter((e: any) => 
        e.codigo_cliente?.toString().includes(term) ||
        e.nombre_asociado?.toLowerCase().includes(term) ||
        e.nombre_cliente?.toLowerCase().includes(term)
    )
})

const openDetails = (expediente: any) => {
    selectedExpediente.value = expediente
    showModal.value = true
}

const closeDetails = () => {
    showModal.value = false
    selectedExpediente.value = null
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
}

const timeAgo = (dateString: string) => {
    if (!dateString) return ''
    return formatDistanceToNow(new Date(dateString), { addSuffix: false, locale: es })
}
</script>
