<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Buzón Secretaría Agencia
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Expedientes entrantes para revisión (Estado 1).
        </p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Código / Cliente</th>
                        <th scope="col" class="px-6 py-3">Asociado</th>
                        <th scope="col" class="px-6 py-3">Monto</th>
                        <th scope="col" class="px-6 py-3">Fecha Recibido</th>
                        <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            No hay expedientes en buzón.
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {{ exp.codigo_cliente }}
                        </td>
                         <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {{ exp.nombre_asociado }}
                        </td>
                        <td class="px-6 py-4 font-mono text-gray-900 dark:text-white">
                            {{ formatCurrency(exp.monto_documento) }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {{ exp.fechas?.f_enviado_secretaria ? formatDate(exp.fechas.f_enviado_secretaria) : '-' }}
                        </td>
                        <td class="px-6 py-4 text-right">
                             <button class="text-blue-600 hover:text-blue-800 font-medium text-xs">
                                Ver Detalles
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-center">
            <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

interface Expediente {
    codigo_cliente: string
    nombre_asociado: string
    monto_documento: number
    fechas: {
        f_enviado_secretaria: string | null
    } | null
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/seguimiento/buzon-secretaria'
        const res = await api.get(endpoint)
        if (res.data.success) {
            if (!url) {
                expedientes.value = res.data.data.data
            } else {
                expedientes.value = [...expedientes.value, ...res.data.data.data]
            }
            nextPageUrl.value = res.data.data.next_page_url
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
}

onMounted(() => {
    fetchExpedientes()
})
</script>
