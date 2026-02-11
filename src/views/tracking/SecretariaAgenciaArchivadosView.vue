<template>
  <div class="space-y-6">
    <!-- Header with Tabs -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Buzón Archivados Administrativamente
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Expedientes que han sido archivados administrativamente (sin garantía real).
          </p>
        </div>
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
                        <th scope="col" class="px-6 py-3">Fecha Aceptado</th>
                        <th scope="col" class="px-6 py-3">Estado Actual</th>
                        <th scope="col" class="px-6 py-3">Recibí Pagaré</th>
                        <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                            No hay expedientes archivados administrativamente.
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
                            {{ exp.fechas?.f_aceptado_secretaria ? formatDate(exp.fechas.f_aceptado_secretaria) : '-' }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                             <div class="flex flex-col">
                                <span v-if="exp.seguimientos?.[0]?.estado" 
                                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                                    {{ exp.seguimientos[0].estado?.nombre }}
                                </span>
                                <span v-else class="text-xs text-gray-400 italic">Desconocido</span>

                                <span v-if="exp.seguimientos?.[0]?.estadoSecundario || exp.seguimientos?.[0]?.estado_secundario" class="text-xs text-gray-500 mt-1 pl-1">
                                    + {{ (exp.seguimientos[0].estadoSecundario || exp.seguimientos[0].estado_secundario)?.nombre }}
                                </span>
                             </div>
                        </td>
                         <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                            <span v-if="exp.seguimientos?.[0]?.recibi_pagare === 'si'" class="text-green-600 font-bold">
                                Sí
                            </span>
                             <button v-else-if="exp.seguimientos?.[0]?.es_un_pagare === 'si'" @click="recibirPagare(exp)" class="text-verde-cope hover:text-green-800 font-medium text-xs border border-verde-cope px-2 py-1 rounded hover:bg-green-50 transition">
                                Recibí Pagaré
                            </button>
                            <span v-else class="text-xs text-gray-400 italic">
                                -
                            </span>
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
        :is-archived-view="true"
        @close="showModal = false"
        @refresh="handleRefresh" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import SecretariaDetallesModal from './components/SecretariaDetallesModal.vue'

interface Expediente {
    id: number;
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
        recibi_pagare?: string;
        es_un_pagare?: string;
        estadoSecundario?: {
            nombre: string;
        };
        estado_secundario?: {
            nombre: string;
        };
    }>;
}

const expedientes = ref<Expediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)
// const activeTab = ref<'buzon' | 'regresados' | 'aceptados'>('buzon')

// Modal State
const showModal = ref(false)
const selectedExpediente = ref<any>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    try {
        const endpoint = url || '/secretaria-agencia/buzon-archivados'
        
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

// watch(activeTab, () => {
    // fetchExpedientes()
// })

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

const recibirPagare = async (exp: any) => {
    const result = await Swal.fire({
        title: '¿Confirmar recepción?',
        text: `¿Confirma que ha recibido el pagaré físico del expediente ${exp.codigo_cliente}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, recibí pagaré',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.post('/secretaria-agencia/recibir-pagare', {
                id: exp.id
            })

            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Pagaré marcado como recibido.',
                    timer: 1500,
                    showConfirmButton: false
                })
                fetchExpedientes()
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
        }
    }
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
