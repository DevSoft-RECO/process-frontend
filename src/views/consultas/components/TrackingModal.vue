<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
  >
    <div
      class="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
    >
      <!-- HEADER -->
      <div
        class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start"
      >
        <div>
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
          >
            Historial de Seguimiento
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ expediente?.codigo_cliente }}
            <span class="mx-1">•</span>
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {{ expediente?.nombre_asociado }}
            </span>
          </p>
        </div>

        <button
          @click="close"
          class="text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto px-8 py-8 space-y-10">
        <!-- LOADING -->
        <div v-if="loading" class="flex justify-center py-16">
          <div
            class="h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <!-- TIMELINE -->
        <div v-else class="relative">
          <!-- Vertical line -->
          <div
            class="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent dark:from-gray-600"
          ></div>

          <!-- EVENTS -->
          <div
            v-for="seg in historyData.seguimientos"
            :key="seg.id_seguimiento"
            class="relative flex gap-6 group"
          >
            <!-- ICON -->
            <div class="relative z-10">
              <div
                :class="[
                  'h-10 w-10 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-gray-900 transition-transform group-hover:scale-110',
                  getStateColorInfo(seg.id_estado).bg
                ]"
              >
                <component
                  :is="getStateIcon(seg.id_estado)"
                  class="h-5 w-5 text-white"
                />
              </div>
            </div>

            <!-- CARD -->
            <div
              class="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {{ seg.estado?.nombre || 'Estado Desconocido' }}
                    <span v-if="seg.estado_secundario || seg.estadoSecundario" class="font-normal text-gray-500 dark:text-gray-400">
                      - {{ (seg.estado_secundario || seg.estadoSecundario)?.nombre }}
                    </span>
                  </h3>

                  <p
                    v-if="seg.usuario"
                    class="text-xs text-gray-500 mt-1"
                  >
                    Por {{ seg.usuario }}
                  </p>
                </div>

                <span
                  class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >
                  {{ formatDate(seg.created_at) }}
                </span>
              </div>

              <!-- Badge finalizado -->
              <div
                v-if="[4, 6].includes(seg.id_estado)"
                class="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              >
                Proceso Finalizado
              </div>

              <!-- Observación -->
              <div
                v-if="(seg.id_estado === 2 && seg.observacion_rechazo) || (seg.id_estado !== 2 && seg.observacion)"
                class="mt-4 text-sm text-gray-600 dark:text-gray-300"
              >
                <p class="italic">
                  “{{ seg.id_estado === 2
                    ? seg.observacion_rechazo
                    : seg.observacion }}”
                </p>
              </div>
            </div>
          </div>

          <!-- CREATED STEP -->
          <div class="relative flex gap-6 mt-10">
            <div class="relative z-10">
              <div
                class="h-10 w-10 rounded-full flex items-center justify-center bg-gray-400 ring-4 ring-white dark:ring-gray-900"
              >
                +
              </div>
            </div>

            <div
              class="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex justify-between items-start">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Expediente Creado
                </h3>
                <span
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{
                    formatDate(
                      expedienteInfo?.created_at ||
                      expediente?.created_at
                    )
                  }}
                </span>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                El expediente fue ingresado al sistema.
              </p>
            </div>
          </div>

          <!-- EMPTY -->
          <div
            v-if="!historyData.seguimientos?.length"
            class="text-center py-16 text-gray-400 italic"
          >
            No hay historial disponible.
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div
        class="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-end"
      >
        <button
          @click="close"
          class="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/api/axios'

// Icons (Simple SVGs as components for cleaner template)
const IconCheckCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>` }
const IconClockCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }
const IconXCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>` }
const IconArchiveCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>` }
const IconSendCallback = { template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>` }

const props = defineProps<{
    show: boolean
    expediente: any
}>()

const emit = defineEmits(['close'])

const loading = ref(false)
const historyData = ref<any>({ seguimientos: [] })
const expedienteInfo = ref<any>(null)

const close = () => {
    emit('close')
}

const fetchHistory = async () => {
    if (!props.expediente?.codigo_cliente) return
    
    loading.value = true
    try {
        const res = await api.get(`/tracking/${props.expediente.id}`)
        if (res.data.success) {
            historyData.value = res.data.data
            expedienteInfo.value = res.data.data.expediente
        }
    } catch (error) {
        console.error('Error fetching tracking history:', error)
    } finally {
        loading.value = false
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        // Reset and fetch
        historyData.value = { seguimientos: [] }
        fetchHistory()
    }
})

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('es-GT', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStateColorInfo = (idEstado: number) => {
    switch(idEstado) {
        case 1: return { bg: 'bg-blue-500' }     // Enviado
        case 2: return { bg: 'bg-red-500' }      // Rechazado / Devuelto
        case 3: return { bg: 'bg-green-500' }    // Aceptado
        case 4: return { bg: 'bg-gray-600' }     // Archivo
        case 6: return { bg: 'bg-gray-800' }     // Archivo Admin
        case 10: return { bg: 'bg-orange-500' }  // Devuelto Abogado
        default: return { bg: 'bg-indigo-500' }
    }
}

const getStateIcon = (idEstado: number) => {
    switch(idEstado) {
        case 1: return IconSendCallback
        case 2: return IconXCallback
        case 3: return IconCheckCallback
        case 4: return IconArchiveCallback
        case 6: return IconArchiveCallback
        default: return IconClockCallback
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in {
    opacity: 0;
    animation: slideIn 0.4s ease-out forwards;
}
</style>
