<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Mis Expedientes
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Listado general de expedientes y préstamos.
        </p>
      </div>
      <div>
         <button @click="fetchExpedientes" class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refrescar
         </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">ID</th>
                        <th scope="col" class="px-6 py-3">CUI Asociado</th>
                        <th scope="col" class="px-6 py-3">Nombre Asociado</th>
                        <th scope="col" class="px-6 py-3">Préstamo</th>
                        <th scope="col" class="px-6 py-3 text-right">Monto</th>
                        <th scope="col" class="px-6 py-3 text-center">Tasa</th>
                        <th scope="col" class="px-6 py-3">Fecha Solicitud</th>
                        <th scope="col" class="px-6 py-3">Asesor</th>
                        <th scope="col" class="px-6 py-3">Agencia</th>
                        <th scope="col" class="px-6 py-3 text-center">Proceso</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading" class="bg-white dark:bg-gray-800">
                        <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                            <div class="flex justify-center items-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-verde-cope" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando expedientes...
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                            No se encontraron expedientes registrados.
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.expediente_id" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            #{{ exp.expediente_id }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ exp.cui_asociado }}
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {{ exp.nombre_asociado }}
                        </td>
                         <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                            <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-900">
                                {{ exp.cod_prestamo }}
                            </span>
                        </td>
                         <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto) }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            {{ exp.tasa_interes }}%
                        </td>
                         <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {{ formatDate(exp.fecha_solicitud) }}
                        </td>
                         <td class="px-6 py-4 text-gray-900 dark:text-white text-xs">
                            {{ exp.asesor?.name || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 text-gray-900 dark:text-white text-xs">
                            {{ exp.agencia?.nombre || exp.agencia_id }}
                        </td>
                        <td class="px-6 py-4 text-center">
                             <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                exp.proceso === 1 ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800'
                             ]">
                                {{ exp.proceso === 1 ? 'Activo' : 'Inactivo' }}
                             </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Expediente {
    expediente_id: number
    cui_asociado: string
    nombre_asociado: string
    cod_prestamo: string
    monto: number
    tasa_interes: number
    fecha_solicitud: string
    proceso: number
    asesor?: { name: string }
    agencia_id: number
    agencia?: { nombre: string } // Assuming Agencia has a 'nombre' field
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/expedientes`)
        if (response.data.success) {
            expedientes.value = response.data.data
        }
    } catch (error) {
        console.error("Error fetching expedientes:", error)
    } finally {
        loading.value = false
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ' 
    }).format(amount)
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-GT')
}

onMounted(() => {
    fetchExpedientes()
})
</script>
