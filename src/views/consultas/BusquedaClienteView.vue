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
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Código</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.codigo_cliente }}</p>
            </div>
            
            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Nombre Completo</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">
                    {{ [client.nombre1, client.nombre2, client.apellido1, client.apellido2].filter(Boolean).join(' ') }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">DPI</span>
                <p class="text-gray-900 dark:text-gray-200 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded inline-block">
                    {{ client.dpi }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">NIT</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.nit || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Teléfono</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.telefono || client.celular || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Dirección</span>
                <p class="text-gray-900 dark:text-gray-200 truncate" :title="client.direccion">
                    {{ client.direccion || 'N/A' }}
                </p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Fecha Nacimiento</span>
                <p class="text-gray-900 dark:text-gray-200">{{ formatDate(client.fecha_nacimiento) }}</p>
            </div>

             <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Actividad Económica</span>
                <p class="text-gray-900 dark:text-gray-200 text-sm">{{ client.actividad_economica_ive || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Estado Civil</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.estado_civil || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Puesto / Ocupación</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.puesto || client.ocupacion || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Profesión</span>
                <p class="text-gray-900 dark:text-gray-200">{{ client.profesion || 'N/A' }}</p>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-gray-500 uppercase font-semibold">Ingresos Laborales</span>
                <p class="text-gray-900 dark:text-gray-200 font-mono text-sm">
                    {{ formatCurrency(client.ingresos_laborales, client.moneda_ingreso_laboral) }}
                </p>
            </div>

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
    nombre2: string
    apellido1: string
    apellido2: string
    dpi: string
    nit: string
    telefono: string
    celular: string
    direccion: string
    fecha_nacimiento: string
    actividad_economica_ive: string
    estado_civil: string
    puesto: string
    ocupacion: string
    profesion: string
    ingresos_laborales: number
    moneda_ingreso_laboral: string
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
        // Hardcoded URL as per previous store patterns, ideally environment var
        const response = await axios.post('http://localhost:8004/api/clientes/search', {
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

const formatCurrency = (amount: number, currency: string) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: currency || 'GTQ' 
    }).format(amount)
}
</script>
