<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Código</th>
                        <th scope="col" class="px-6 py-3">Nombre Asociado</th>
                        <th scope="col" class="px-6 py-3">CUI</th>
                        <th scope="col" class="px-6 py-3 text-right">Monto</th>
                        <th scope="col" class="px-6 py-3 text-center">Acciones</th>
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
                            No hay expedientes nuevos.
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            {{ exp.codigo_cliente }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ exp.nombre_asociado }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                            {{ exp.cui }}
                        </td>
                        <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto_documento) }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <!-- Old Buttons -->
                                <button 
                                    @click="$emit('open-garantia', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-verde-cope bg-verde-cope/10 hover:bg-verde-cope/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope transition-colors"
                                    title="Agregar Garantía"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Garantía
                                </button>
                                <button 
                                    @click="$emit('open-documento', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    title="Agregar Documento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documento
                                </button>
                                <!-- New Buttons -->
                                <button 
                                    @click="$emit('open-detalles', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    title="Ver Detalles"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Detalles
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-center">
            <button @click="$emit('load-more')" :disabled="loading" class="text-sm text-verde-cope font-bold hover:underline">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    expedientes: any[]
    loading: boolean
    nextPageUrl: string | null
}>()

defineEmits(['open-garantia', 'open-documento', 'open-detalles', 'load-more'])

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}
</script>
