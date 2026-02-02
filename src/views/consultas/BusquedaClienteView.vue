<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Búsqueda de Cliente
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Validación de datos mediante DPI.
        </p>
      </div>
    </div>

    <!-- Search Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="max-w-xl mx-auto space-y-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingrese DPI del Cliente</label>
            <div class="flex gap-2">
                <input v-model="dpi" 
                       type="text" 
                       placeholder="Ej. 1234567890101" 
                       class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                       @keyup.enter="handleSearch"
                >
                <button @click="handleSearch" 
                        :disabled="loading || !dpi"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cope hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope disabled:opacity-50 transition-colors">
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscar
                </button>
            </div>
            <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
        </div>
    </div>

    <!-- Result Card -->
    <div v-if="client" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Detalles del Cliente</h3>
        </div>
            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Código Cliente</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.codigo_cliente }}</p>
            </div>
            
            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Nombre Completo</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">
                    {{ [client.nombre1, client.apellido1].filter(Boolean).join(' ') }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Nombre Corto</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">
                    {{ client.nombre_corto || 'N/A' }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">DPI / CUI</span>
                <p class="text-gray-900 dark:text-gray-200 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded inline-block">
                    {{ client.dpi }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Agencia</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">{{ client.agencia || client.empresa || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Documento</span>
                <div class="text-sm">
                    <p class="text-gray-900 dark:text-gray-200">{{ client.tipo_documento }}</p>
                    <p class="text-xs text-gray-500">{{ client.numero_documento }}</p>
                </div>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Tipo Garantía</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.tipo_garantia || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Fecha Inicio</span>
                <p class="text-gray-900 dark:text-gray-200">{{ formatDate(client.fecha_inicio) }}</p>
            </div>

             <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Tasa Interés</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.tasa_interes ? client.tasa_interes + '%' : 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Monto Documento</span>
                <p class="text-gray-900 dark:text-gray-200 font-mono text-lg text-verde-cope">
                    {{ formatCurrency(client.monto_documento) }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Usuario Asesor</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">{{ client.usuario_asesor || 'N/A' }}</p>
            </div>

            <div v-if="client.nombre_asociado" class="space-y-1 md:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-semibold">Nombre Asociado</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">{{ client.nombre_asociado }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Contrato</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">{{ client.contrato || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Estado</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">
                    <span :class="{'bg-green-100 text-green-800 px-2 py-0.5 rounded': client.estado === 'COMPLETO', 'bg-gray-100 text-gray-800 px-2 py-0.5 rounded': client.estado !== 'COMPLETO'}">
                        {{ client.estado || 'N/A' }}
                    </span>
                </p>
            </div>

            <div v-if="client.observacion" class="space-y-1 md:col-span-3">
                <span class="text-xs text-gray-500 uppercase font-semibold">Observaciones</span>
                <p class="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-100 dark:border-gray-800">
                    {{ client.observacion }}
                </p>
            </div>

        </div>
    </div>
 
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Client {
    codigo_cliente: number
    nombre1: string
    apellido1: string
    nombre_corto: string
    dpi: string
    empresa: string
    tipo_documento: string
    numero_documento: string
    tipo_garantia: string
    fecha_inicio: string
    tasa_interes: number
    monto_documento: number
    usuario_asesor: string
    agencia?: string
    nombre_asociado?: string
    contrato?: string
    observacion?: string
    estado?: string
}

const dpi = ref('')
const client = ref<Client | null>(null)
const loading = ref(false)
const error = ref('')

const handleSearch = async () => {
    if (!dpi.value) return
    
    loading.value = true
    error.value = ''
    client.value = null

    try {
        // Use environment variable
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clientes/search`, {
            dpi: dpi.value
        })
        
        if (response.data.success) {
            client.value = response.data.data
        }
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            error.value = 'Cliente no encontrado con ese DPI.'
        } else {
            error.value = 'Error al consultar. Verifique la conexión.'
            console.error(err)
        }
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-GT', { timeZone: 'UTC' })
}

const formatCurrency = (amount: number, currency?: string) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: currency || 'GTQ' 
    }).format(amount)
}
</script>
