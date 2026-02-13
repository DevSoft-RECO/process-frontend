<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <!-- Header con Stats y Filtros -->
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-3 tracking-wide">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Historial de Envíos
                    </span>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        Devueltos a Secretaría
                        <span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                            {{ filteredExpedientes.length }}
                        </span>
                    </h1>
                     <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                        Expedientes enviados a Secretaría de Créditos para digitalización y archivo.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative group">
                         <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            v-model="search" 
                            type="text" 
                            placeholder="Buscar expediente..." 
                            class="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full sm:w-64 transition-all shadow-sm group-hover:shadow-md"
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="overflow-x-auto">
            <div v-if="loading" class="p-12 flex justify-center">
                 <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                     <span class="text-gray-500 text-sm font-medium animate-pulse">Cargando historial...</span>
                </div>
            </div>

            <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50/50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Id Expediente / cliente</th>
                        <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Asociado</th>
                         <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Envío</th>
                        <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
                     <tr v-if="filteredExpedientes.length === 0" class="group">
                        <td colspan="4" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center gap-3">
                                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-full">
                                    <svg class="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <p class="text-gray-500 text-sm">No hay expedientes devueltos.</p>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="expediente in filteredExpedientes" :key="expediente.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                    {{ expediente.id}}
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
                            <div class="text-sm text-gray-900 dark:text-white" v-if="expediente.fechas?.f_enviado_secretaria_credito">
                                {{ formatDate(expediente.fechas.f_enviado_secretaria_credito) }}
                                <div class="text-xs text-gray-500">
                                    {{ timeAgo(expediente.fechas.f_enviado_secretaria_credito) }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400" v-else>
                                -
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                Enviado a Sc. Créditos
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'

const expedientes = ref<any[]>([])
const loading = ref(true)
const search = ref('')

onMounted(() => {
    fetchExpedientes()
})

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const res = await api.get('/abogado/devueltos')
        
        // Laravel Paginate devuelve los datos en la propiedad 'data'
        // Si tu controlador devuelve return response()->json($expedientes), 
        // entonces el array está en res.data.data
        if (res.data && res.data.data) {
            expedientes.value = res.data.data
        } else {
            expedientes.value = []
        }
    } catch (error) {
        console.error("Error cargando expedientes:", error)
        expedientes.value = []
    } finally {
        loading.value = false
    }
}

const filteredExpedientes = computed(() => {
    if (!search.value) return expedientes.value
    const s = search.value.toLowerCase()
    return expedientes.value.filter(e => 
        e.id.toString().includes(s) || 
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
</script>
