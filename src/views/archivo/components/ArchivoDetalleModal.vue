<template>
  <div v-show="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="close"></div>

    <div class="relative bg-white dark:bg-gray-800 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col border dark:border-gray-700">
      
      <div class="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Ficha Técnica de Archivo</h3>
          <p v-if="detalle?.id_expediente" class="text-xs text-gray-500">ID Seguimiento: #{{ detalle.id_seguimiento }} | ID Expediente: #{{ detalle.id_expediente }}</p>
        </div>
        <button @click="close" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Obteniendo información técnica...</p>
        </div>

        <div v-else-if="detalle" class="animate-fadeIn">
          
          <div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg mb-8">
            <span class="text-[10px] font-bold uppercase text-green-700 dark:text-green-400 tracking-widest">Titular del Expediente</span>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase">
              {{ detalle.nuevo_expediente?.nombre_asociado || 'Sin Nombre' }}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-1 space-y-6">
              <section>
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-3 border-b pb-1">Gestión Legal</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs text-gray-500">Abogado / Bufete:</label>
                    <p class="text-sm font-bold dark:text-gray-200">{{ detalle.bufete?.user?.name || 'No asignado' }}</p>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">Número de Contrato:</label>
                    <p class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block dark:text-gray-300">
                      {{ detalle.numero_contrato || 'Sin registro' }}
                    </p>
                  </div>
                  <div v-if="detalle.path_contrato">
                    <a :href="`${apiUrl}/${detalle.path_contrato}`" target="_blank" 
                       class="flex items-center justify-center gap-2 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition shadow-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      VER PDF ESCANEADO
                    </a>
                  </div>
                </div>
              </section>

              <section v-if="detalle.nuevo_expediente?.detalle_garantias?.length > 0">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-3 border-b pb-1">Garantías y Observaciones</h4>
                <div class="space-y-4">
                  <div v-for="g in detalle.nuevo_expediente.detalle_garantias" :key="g.id" 
                       class="p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                    
                    <h5 class="font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase text-sm">
                      {{ g.garantia?.nombre || 'Garantía' }}
                    </h5>

                    <div class="grid grid-cols-1 gap-2">
                      <div v-if="g.codeudor1">
                        <p class="text-[10px] font-black text-gray-500 uppercase">Codeudor 1</p>
                        <p class="text-sm font-bold dark:text-white">{{ g.codeudor1 }}</p>
                        <p v-if="g.observacion1" class="text-xs italic text-gray-500 mt-1">"{{ g.observacion1 }}"</p>
                      </div>
                      <div v-if="g.codeudor2">
                        <p class="text-[10px] font-black text-gray-500 uppercase">Codeudor 2</p>
                        <p class="text-sm font-bold dark:text-white">{{ g.codeudor2 }}</p>
                        <p v-if="g.observacion2" class="text-xs italic text-gray-500 mt-1">"{{ g.observacion2 }}"</p>
                      </div>
                      <div v-if="g.codeudor3">
                        <p class="text-[10px] font-black text-gray-500 uppercase">Codeudor 3</p>
                        <p class="text-sm font-bold dark:text-white">{{ g.codeudor3 }}</p>
                        <p v-if="g.observacion3" class="text-xs italic text-gray-500 mt-1">"{{ g.observacion3 }}"</p>
                      </div>
                      <div v-if="g.codeudor4">
                        <p class="text-[10px] font-black text-gray-500 uppercase">Codeudor 4</p>
                        <p class="text-sm font-bold dark:text-white">{{ g.codeudor4 }}</p>
                        <p v-if="g.observacion4" class="text-xs italic text-gray-500 mt-1">"{{ g.observacion4 }}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div class="lg:col-span-2 space-y-8">
              
              <section v-if="detalle.nuevo_expediente?.documentos?.length > 0">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-3 border-b pb-1">Detalle Registral</h4>
                <div class="grid grid-cols-1 gap-6">
                  <div v-for="doc in detalle.nuevo_expediente.documentos" :key="doc.id" 
                       class="p-4 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-sm space-y-4">
                    
                    <!-- Fila 1: Datos Principales de Finca -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-b dark:border-gray-600 pb-3">
                      <div><p class="text-[10px] text-gray-500 uppercase">Finca</p><p class="font-bold dark:text-white text-lg">{{ doc.no_finca }}</p></div>
                      <div><p class="text-[10px] text-gray-500 uppercase">Folio</p><p class="font-bold dark:text-white text-lg">{{ doc.folio }}</p></div>
                      <div><p class="text-[10px] text-gray-500 uppercase">Libro</p><p class="font-bold dark:text-white text-lg">{{ doc.libro }}</p></div>
                      <div><p class="text-[10px] text-gray-500 uppercase">No. Dominio</p><p class="font-bold dark:text-white text-lg">{{ doc.no_dominio || '-' }}</p></div>
                    </div>

                    <!-- Fila 2: Información del Documento -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-xs text-gray-500">Número de Documento:</p>
                            <p class="font-semibold dark:text-gray-200">{{ doc.numero || '-' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Fecha de Documento:</p>
                            <p class="font-semibold dark:text-gray-200">{{ doc.fecha ? new Date(doc.fecha).toLocaleDateString() : '-' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Monto Póliza:</p>
                            <p class="font-semibold dark:text-gray-200">{{ doc.monto_poliza ? formatCurrency(doc.monto_poliza) : '-' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Referencia:</p>
                            <p class="font-semibold dark:text-gray-200">{{ doc.referencia || '-' }}</p>
                        </div>
                    </div>

                    <!-- Fila 3: Personas -->
                    <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong class="block text-gray-500 text-xs uppercase">Propietario:</strong>
                            <span class="dark:text-white">{{ doc.propietario }}</span>
                        </div>
                        <div>
                            <strong class="block text-gray-500 text-xs uppercase">Autorizador:</strong>
                            <span class="dark:text-white">{{ doc.autorizador }}</span>
                        </div>
                    </div>

                    <!-- Fila 4: Observaciones -->
                    <div v-if="doc.observacion">
                        <p class="text-xs text-gray-500 uppercase font-bold">Observaciones:</p>
                        <p class="text-sm italic text-gray-600 dark:text-gray-300 mt-1 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded">
                            "{{ doc.observacion }}"
                        </p>
                    </div>

                  </div>
                </div>
              </section>


            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p>No se pudo cargar la información técnica del expediente.</p>
        </div>
      </div>

      <div class="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
        <div v-if="showReceiveAction">
             <button @click="confirmReceive" class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold transition hover:bg-indigo-700 shadow-md flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Confirmar Recepción de Garantía
            </button>
        </div>
        <div v-else></div> <!-- Spacer -->

        <button @click="close" class="px-8 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold transition hover:scale-105 active:scale-95 shadow-md">
          Cerrar Vista
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/api/axios'

const apiUrl = import.meta.env.VITE_API_URL

const props = defineProps<{
  show: boolean
  idSeguimiento: number | null
  showReceiveAction?: boolean
}>()

const emit = defineEmits(['close', 'confirm-receive'])
const loading = ref(false)
const detalle = ref<any>(null)

const fetchDetalle = async () => {
  if (!props.idSeguimiento) return
  
  loading.value = true
  detalle.value = null

  try {
    // Asegúrate de que la ruta coincida con tu api.php
    const res = await api.get(`/archivo/detalle/${props.idSeguimiento}`)
    if (res.data.success) {
      detalle.value = res.data.data
    }
  } catch (err) {
    console.error("Error cargando detalle:", err)
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (isShown) => {
  if (isShown) fetchDetalle()
})

const close = () => {
  detalle.value = null
  emit('close')
}

const confirmReceive = () => {
    emit('confirm-receive')
}

const formatCurrency = (amount: any) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(amount))
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>