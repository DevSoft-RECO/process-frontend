<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Código</th>
                        <th scope="col" class="px-6 py-3">Nombre Asociado</th>
                        <th scope="col" class="px-6 py-3">Fecha Ingreso</th>
                        <th scope="col" class="px-6 py-3">Tasa Interés</th>
                        <th scope="col" class="px-6 py-3">CUI</th>
                        <th scope="col" class="px-6 py-3 text-right">Monto</th>
                        <th scope="col" class="px-6 py-3 text-center">Acciones</th>
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
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300 text-xs">
                             {{ formatDate(exp.fecha_inicio) }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300 text-xs text-center">
                             {{ exp.tasa_interes }}%
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                            {{ exp.cui }}
                        </td>
                        <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto_documento) }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <!-- New Unified Button -->
                                <button 
                                    v-if="canEdit(exp)"
                                    @click="$emit('open-adjuntar', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    title="Adjuntar Información"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    Adjuntar
                                </button>
                                <!-- New Buttons -->
                                <button 
                                    v-if="canEdit(exp) && hasAttachments(exp)"
                                    @click="$emit('open-detalles', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    title="Ver Detalles"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Revisar y enviar
                                </button>
                                <button 
                                    v-if="exp.seguimientos && exp.seguimientos.length > 0"
                                    @click="$emit('open-tracking', exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                    title="Ver Seguimiento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Seguimiento
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

defineEmits(['open-adjuntar', 'open-detalles', 'open-tracking', 'load-more'])

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    // Manual formatting for consistency DD/MM/YYYY
    // Adjust for timezone offset if needed, or assume string date is local
    // Using string slice YYYY-MM-DD is safer for consistency without timezone shifts
    if(dateString.includes('T')) return new Date(dateString).toLocaleDateString('es-ES')
    
    // If format is YYYY-MM-DD
    const [y, m, dstr] = dateString.split('-')
    return `${dstr}/${m}/${y}`
}

// Logic to control button visibility
const canEdit = (exp: any) => {
    // If no tracking, it's new -> Editable
    if (!exp.seguimientos || exp.seguimientos.length === 0) {
        return true
    }
    
    // If has tracking, check the LATEST state (index 0 because of orderBy desc in controller)
    const latestState = exp.seguimientos[0]
    
    // Editable only if returned (State 2)
    return latestState.id_estado === 2
}

const hasAttachments = (exp: any) => {
    const hasGarantias = exp.garantias && exp.garantias.length > 0
    const hasDocumentos = exp.documentos && exp.documentos.length > 0
    return hasGarantias || hasDocumentos
}
</script>
