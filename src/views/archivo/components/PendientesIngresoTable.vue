<template>
  <div class="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-sm text-left border-separate border-spacing-0">
        <thead class="bg-indigo-600 dark:bg-indigo-800 text-white">
          <tr>
            <th scope="col" class="w-14 px-4 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 rounded-tl-2xl text-center">ID Exp</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">Código / CUI</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">Nombre Asociado</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">Monto / Tasa</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">Desembolso / Producto</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center">Observación</th>
            <th scope="col" class="px-6 py-4 font-bold uppercase tracking-wider text-[11px] border-b border-white/10 text-center rounded-tr-2xl">Info Garantía</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
          <tr v-if="loading && items.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="font-medium text-xs">Cargando pendientes...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <div class="flex flex-col items-center justify-center">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-base font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">No hay expedientes pendientes de ingreso</p>
              </div>
            </td>
          </tr>
          <tr v-for="exp in items" :key="exp.id" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="px-4 py-4 text-center">
              <span class="text-slate-400 dark:text-slate-500 font-mono text-xs">{{ exp.id }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="text-slate-700 dark:text-slate-200 font-semibold">{{ exp.codigo_cliente }}</div>
              <div class="text-[12px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 tracking-tighter">{{ exp.cui || '---' }}</div>
            </td>
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ exp.nombre_asociado }}</td>
            <td class="px-6 py-4">
              <div class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ formatCurrency(exp.monto_documento) }}</div>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-500 font-medium mt-0.5 uppercase">Tasa: {{ exp.tasa_interes || '0' }}%</div>
            </td>
            <td class="px-6 py-4 text-center text-xs">
              <div class="text-slate-600 dark:text-slate-300">{{ exp.fecha_inicio ? formatDate(exp.fecha_inicio) : 'N/A' }}</div>
              <div class="text-[10px] text-indigo-500 font-bold mt-0.5 uppercase italic">Prod: #{{ exp.numero_documento || exp.id }}</div>
            </td>
            <td class="px-6 py-4 text-center">
              <button 
                v-if="exp.seguimientos?.[0]?.observacion_envio"
                @click="$emit('show-observation', exp.seguimientos[0].observacion_envio)"
                class="text-orange-500 hover:text-orange-600 transition-colors p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/50"
                title="Ver observación de envío"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <span v-else class="text-slate-400 text-[10px] italic">---</span>
            </td>
            <td class="px-6 py-4 text-center">
              <button 
                v-if="exp.seguimientos?.[0]?.observacion_envio"
                @click="$emit('show-info', exp)"
                class="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm"
              >
                Garantía
              </button>
              <span v-else class="text-slate-400 text-[10px] italic">Sin observación</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div v-if="nextPageUrl" class="bg-indigo-50/20 dark:bg-slate-800/30 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
      <button @click="$emit('load-more')" :disabled="loading" class="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors uppercase tracking-widest">
        {{ loading ? 'Cargando...' : 'Cargar más pendientes' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatCurrency } from '@/utils/formatters'

defineProps<{
  items: any[]
  loading: boolean
  nextPageUrl: string | null
}>()

defineEmits(['show-info', 'load-more', 'show-observation'])
</script>
