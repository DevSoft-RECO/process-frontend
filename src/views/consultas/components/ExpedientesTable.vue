<template>
    <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
        <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-sm text-left border-separate border-spacing-0">
                <thead class="bg-table-azul dark:bg-table-verde text-white">
                    <tr>
                        <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">
                            ID Exp
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                            Código Cliente / CUI
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                            Nombre Asociado
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                            Fecha Desembolso / No. Producto
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-right">
                            Monto / Tasa
                        </th>
                        <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
                    <tr v-if="loading && expedientes.length === 0">
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 border-4 border-verde-cope border-t-transparent rounded-full animate-spin"></div>
                                <span class="text-gray-400 font-medium">Cargando expedientes...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="exp in expedientes" :key="exp.id" 
                        class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-150">
                        
                        <td class="px-4 py-4 text-center">
                            <span class="text-slate-700 dark:text-slate-500 font-mono text-xs">
                                {{ exp.id }}
                            </span>
                        </td>
                        
                        <td class="px-6 py-4">
                            <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
                            <div class="text-[14px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{{ exp.cui }}</div>
                        </td>
                        
                        <td class="px-6 py-4 font-medium">
                            <div class="text-slate-900 dark:text-white font-bold">{{ exp.nombre_asociado }}</div>
                            <div class="text-[10px] text-slate-400 uppercase tracking-tighter">Asociado Activo</div>
                        </td>
                        
                        <td class="px-6 py-4">
                            <div class="text-slate-600 dark:text-slate-300">{{ formatDate(exp.fecha_inicio) }}</div>
                            <div class="text-[12px] text-verde-cope font-medium mt-0.5 italic">Prod: #{{ exp.numero_documento || exp.id }}</div>
                        </td>
                        
                        <td class="px-6 py-4 text-right">
                            <div class="font-mono font-bold text-azul-cope dark:text-blue-300">
                                {{ formatCurrency(exp.monto_documento) }}
                            </div>
                            <div class="text-[13px] text-verde-cope dark:text-green-500 font-medium mt-0.5">
                                Tasa: {{ exp.tasa_interes }}%
                            </div>
                        </td>
                        
                        <td class="px-6 py-4">
                            <div class="flex justify-center gap-2" v-if="!hideActions">
                                <button 
                                    v-if="canEdit(exp)"
                                    @click="$emit('open-adjuntar', exp)"
                                    class="p-2 text-slate-400 hover:text-naranja-cope hover:bg-naranja-cope/10 rounded-lg transition-colors border border-transparent hover:border-naranja-cope/20"
                                    title="Adjuntar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                </button>

                                <button 
                                    v-if="canEdit(exp) && hasAttachments(exp)"
                                    @click="$emit('open-detalles', exp)"
                                    class="p-2 text-slate-400 hover:text-verde-cope hover:bg-verde-cope/10 rounded-lg transition-colors border border-transparent hover:border-verde-cope/20"
                                    title="Revisar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>

                                <button 
                                    v-if="exp.seguimientos && exp.seguimientos.length > 0"
                                    @click="$emit('open-tracking', exp)"
                                    class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                    title="Seguimiento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </button>
                            </div>
                            <div v-else-if="finalizedMode" class="text-center">
                                <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-green-50/50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:border-green-500/20">
                                    Finalizado
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="nextPageUrl" class="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
            <button @click="$emit('load-more')" :disabled="loading" 
                class="text-xs text-azul-cope font-bold hover:text-blue-700 transition-colors uppercase tracking-widest">
                {{ loading ? 'Sincronizando...' : 'Cargar más registros' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    expedientes: any[]
    loading: boolean
    nextPageUrl: string | null
    hideActions?: boolean
    finalizedMode?: boolean
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
