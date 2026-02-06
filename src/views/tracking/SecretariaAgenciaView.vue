<template>
  <div class="space-y-6">
    <!-- Header with Tabs -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Buzón Secretaría Agencia
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestión de expedientes entrantes y regresados.
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button 
                  @click="activeTab = 'buzon'"
                  :class="[
                      activeTab === 'buzon' 
                          ? 'border-verde-cope text-verde-cope' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                  ]"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Buzón (Pendientes)
              </button>
              <button 
                  @click="activeTab = 'regresados'"
                  :class="[
                      activeTab === 'regresados' 
                          ? 'border-red-500 text-red-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                  ]"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Regresados
              </button>
              <button 
                  @click="activeTab = 'aceptados'"
                  :class="[
                      activeTab === 'aceptados' 
                          ? 'border-green-500 text-green-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                  ]"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Aceptados
              </button>
          </nav>
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
                        <th scope="col" class="px-6 py-3">
                            <span v-if="activeTab === 'buzon'">Fecha Recibido</span>
                            <span v-else-if="activeTab === 'regresados'">Fecha Retorno</span>
                            <span v-else>Fecha Aceptado</span>
                        </th>
                        <th scope="col" class="px-6 py-3">Estado Actual</th>
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
                            No hay expedientes en {{ activeTab === 'buzon' ? 'buzón' : (activeTab === 'regresados' ? 'regresados' : 'aceptados') }}.
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
                            {{ 
                                activeTab === 'buzon' 
                                    ? (exp.fechas?.f_enviado_secretaria ? formatDate(exp.fechas.f_enviado_secretaria) : '-') 
                                    : (activeTab === 'regresados' 
                                        ? (exp.fechas?.f_retorno_asesores ? formatDate(exp.fechas.f_retorno_asesores) : '-')
                                        : (exp.fechas?.f_aceptado_secretaria ? formatDate(exp.fechas.f_aceptado_secretaria) : '-')
                                      )
                            }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                             <span v-if="exp.seguimientos?.[0]?.estado" 
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {{ exp.seguimientos[0].estado?.nombre }}
                            </span>
                             <span v-else class="text-xs text-gray-400 italic">Desconocido</span>
                        </td>
                        <td class="px-6 py-4 text-right">
                             <button @click="openDetalles(exp)" class="text-blue-600 hover:text-blue-800 font-medium text-xs">
                                Revisar
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

    <!-- Modal Detalles (Secretaria) -->
    <SecretariaDetallesModal 
        :show="showModal" 
        :expediente="selectedExpediente" 
        @close="showModal = false"
        @refresh="handleRefresh" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '@/api/axios'
import SecretariaDetallesModal from './components/SecretariaDetallesModal.vue'

interface Expediente {
    codigo_cliente: string;
    nombre_asociado: string;
    monto_documento: number;
    fechas: {
        f_enviado_secretaria: string | null;
        f_retorno_asesores: string | null;
        f_aceptado_secretaria: string | null;
    } | null;
    seguimientos?: Array<{
        estado?: {
            nombre: string;
        };
    }>;
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)
const activeTab = ref<'buzon' | 'regresados' | 'aceptados'>('buzon')

// Modal State
const showModal = ref(false)
const selectedExpediente = ref<any>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/seguimiento/buzon-secretaria'
        let status = 1;
        if (activeTab.value === 'regresados') status = 2;
        if (activeTab.value === 'aceptados') status = 3;
        
        const res = await api.get(endpoint, {
            params: { status }
        })

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

watch(activeTab, () => {
    fetchExpedientes()
})

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

const openDetalles = (expor: any) => {
    selectedExpediente.value = expor
    showModal.value = true
}

const handleRefresh = () => {
    fetchExpedientes()
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
