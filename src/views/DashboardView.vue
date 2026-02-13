<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Analítico</h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Panorama general del rendimiento y cuellos de botella.</p>
            </div>
            <button @click="loadAll" :disabled="loading" class="p-2 text-gray-500 hover:text-verde-cope transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>

        <!-- KPIs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Active Cases -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Expedientes Activos</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ kpi.total_active }}</h3>
                    </div>
                    <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- In Amount -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-verde-cope">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monto (Este Mes)</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ formatCurrency(kpi.total_amount) }}</h3>
                    </div>
                    <div class="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-verde-cope">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Finalized -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Finalizados</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ kpi.total_finalized }}</h3>
                    </div>
                    <div class="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Avg Time -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo Promedio</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ kpi.avg_days_open }} <span class="text-sm font-normal text-gray-500">días</span></h3>
                    </div>
                    <div class="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Pipeline (2/3 width) -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Pipeline de Procesos</h3>
                <div class="space-y-4">
                    <div v-for="(item, index) in pipeline" :key="index" class="relative">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.state_name }}</span>
                            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ item.count }}</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" :style="{ width: calculatePercent(item.count, kpi.total_active) + '%' }"></div>
                        </div>
                    </div>
                    <div v-if="pipeline.length === 0" class="text-center text-gray-500 py-4">No hay datos suficientes.</div>
                </div>
            </div>

            <!-- Trends Mini Table (1/3 width) -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tendencia (6 Meses)</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left border-b border-gray-100 dark:border-gray-700">
                                <th class="pb-2 font-medium text-gray-500">Mes</th>
                                <th class="pb-2 font-medium text-gray-500 text-right">Nuevos</th>
                                <th class="pb-2 font-medium text-gray-500 text-right">Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(t, i) in trends" :key="i" class="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                                <td class="py-2 text-gray-800 dark:text-gray-300">{{ t.month }}</td>
                                <td class="py-2 text-right text-blue-600 font-medium">{{ t.created }}</td>
                                <td class="py-2 text-right text-green-600 font-medium">{{ t.finalized }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Advisors & Rejections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Advisor Performance -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Rendimiento por Asesor</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th class="px-4 py-3 rounded-l-lg">Asesor</th>
                                <th class="px-4 py-3 text-center">Activos</th>
                                <th class="px-4 py-3 text-center">Rechazos Hist.</th>
                                <th class="px-4 py-3 text-right rounded-r-lg">Tasa Rechazo</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="(adv, i) in advisors.data" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[150px]" :title="adv.asesor">
                                    {{ adv.asesor }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {{ adv.active_cases }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">
                                    {{ adv.rejected_cases }}
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <span :class="{'text-green-600': adv.rejection_rate < 10, 'text-yellow-600': adv.rejection_rate >= 10 && adv.rejection_rate < 30, 'text-red-600': adv.rejection_rate >= 30}">
                                            {{ adv.rejection_rate }}%
                                        </span>
                                        <div class="w-16 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                            <div class="h-1.5 rounded-full" :class="{'bg-green-500': adv.rejection_rate < 10, 'bg-yellow-500': adv.rejection_rate >= 10 && adv.rejection_rate < 30, 'bg-red-500': adv.rejection_rate >= 30}" :style="{ width: Math.min(adv.rejection_rate, 100) + '%' }"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Rejections -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Rechazos (Por Agente/Agencia)</h3>
                <p class="text-xs text-gray-500 mb-4">Expedientes que han sido devueltos al menos una vez.</p>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left">
                        <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th class="px-4 py-3 rounded-l-lg">Asesor</th>
                                <th class="px-4 py-3">Agencia</th>
                                <th class="px-4 py-3 text-right rounded-r-lg">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="(rej, i) in rejections.slice(0, 10)" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                    {{ rej.asesor }}
                                </td>
                                <td class="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                    {{ rej.agencia }}
                                </td>
                                <td class="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                    {{ rej.rejections }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Agency Workload -->
         <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Carga por Agencia</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="(agency, i) in agencies" :key="i" class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition">
                        <h4 class="font-bold text-gray-800 dark:text-gray-200 truncate">{{ agency.agency }}</h4>
                        <div class="mt-3 flex justify-between text-sm">
                            <div class="text-center">
                                <span class="block text-xl font-bold text-blue-600">{{ agency.active }}</span>
                                <span class="text-xs text-gray-500 uppercase">Activos</span>
                            </div>
                            <div class="text-center">
                                <span class="block text-xl font-bold text-green-600">{{ agency.finalized }}</span>
                                <span class="text-xs text-gray-500 uppercase">Finalizados</span>
                            </div>
                            <div class="text-center">
                                <span class="block text-xl font-bold text-gray-600 dark:text-gray-400">{{ agency.total }}</span>
                                <span class="text-xs text-gray-500 uppercase">Total</span>
                            </div>
                        </div>
                    </div>
                </div>
         </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardService from '@/services/DashboardService'

const loading = ref(false)
const kpi = ref({ total_active: 0, total_finalized: 0, total_amount: 0, avg_days_open: 0 })
const pipeline = ref<any[]>([])
const advisors = ref<{ data: any[], current_page: number, total: number }>({ data: [], current_page: 1, total: 0 })
const rejections = ref<any[]>([])
const agencies = ref<any[]>([])
const trends = ref<any[]>([])

const loadAll = async () => {
    loading.value = true
    try {
        const [kpiRes, pipeRes, advRes, rejRes, agRes, trRes] = await Promise.all([
            DashboardService.getKpi(),
            DashboardService.getPipeline(),
            DashboardService.getAdvisors(),
            DashboardService.getRejections(),
            DashboardService.getAgencies(),
            DashboardService.getTrends()
        ])

        kpi.value = kpiRes
        pipeline.value = pipeRes
        advisors.value = advRes // Matches paginated structure now
        rejections.value = rejRes
        agencies.value = agRes
        trends.value = trRes

    } catch (e) {
        console.error("Error loading dashboard data", e)
    } finally {
        loading.value = false
    }
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value)
}

const calculatePercent = (val: number, total: number) => {
    if (!total || total === 0) return 0
    return Math.min(Math.round((val / total) * 100), 100)
}

onMounted(() => {
    loadAll()
})
</script>
