<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Buzón de Pagarés</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Código Cliente
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            DPI
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha Inicio
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Monto
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Estado
                        </th>
                         <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading" class="animate-pulse">
                        <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">Cargando...</td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0">
                        <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No hay expedientes con pagarés.</td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {{ exp.codigo_cliente }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {{ exp.nombre1 }} {{ exp.apellido1 }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ exp.dpi }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ formatDate(exp.fecha_inicio) }}
                        </td>
                         <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto) }}
                        </td>
                         <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {{ exp.seguimientos?.[0]?.estado?.nombre || 'Desconocido' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-right flex justify-end gap-2">
                             <button 
                                v-if="!exp.seguimientos?.[0]?.recibi_pagare || exp.seguimientos?.[0]?.recibi_pagare !== 'si'"
                                @click="recibirPagare(exp)" 
                                class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium"
                             >
                                Recibí Pagaré
                             </button>
                             
                             <button 
                                v-if="exp.seguimientos?.[0]?.recibi_pagare === 'si'"
                                @click="archivarPagare(exp)" 
                                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                             >
                                Archivar Administrativamente
                             </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
         <!-- Pagination could be added here -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const expedientes = ref<any[]>([])
const loading = ref(false)

const fetchExpedientes = async () => {
    loading.value = true
    try {
        const res = await api.get('/secretaria-agencia/buzon-pagares')
        if (res.data.success) {
            expedientes.value = res.data.data.data // Pagination structure
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
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
                codigo_cliente: exp.codigo_cliente
            })

            if (res.data.success) {
                Swal.fire('Éxito', 'Pagaré marcado como recibido.', 'success')
                fetchExpedientes() // Refresh to update list and hide button
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
        }
    }
}

const archivarPagare = async (exp: any) => {
    const result = await Swal.fire({
        title: '¿Archivar Expediente?',
        text: `El expediente ${exp.codigo_cliente} cambiará al estado 6 (Archivado) y saldrá de este buzón.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, archivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.post('/secretaria-agencia/archivar-pagare', {
                codigo_cliente: exp.codigo_cliente
            })

            if (res.data.success) {
                Swal.fire('Éxito', 'Expediente archivado correctamente.', 'success')
                fetchExpedientes() // Refresh to list
            }
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'No se pudo archivar el expediente.', 'error')
        }
    }
}

onMounted(() => {
    fetchExpedientes()
})
</script>
