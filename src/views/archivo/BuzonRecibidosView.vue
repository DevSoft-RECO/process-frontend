<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Buzón de Recibidos (Archivo)
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Expedientes enviados a archivo (Estado 4).
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
                          <th scope="col" class="px-6 py-3">Código / Expediente</th>
                          <th scope="col" class="px-6 py-3">Nombre Corto Asociado</th>
                          <th scope="col" class="px-6 py-3">Interés</th>
                          <th scope="col" class="px-6 py-3">Monto</th>
                          <th scope="col" class="px-6 py-3">Fecha Envío Archivo</th>
                          <th scope="col" class="px-6 py-3">Observación Garantía</th>
                          <th scope="col" class="px-6 py-3">Garantía Real</th>
                          <th scope="col" class="px-6 py-3">Contrato</th>
                          <th scope="col" class="px-6 py-3">Recibido en Archivo</th>
                          <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                          <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                              Cargando...
                          </td>
                      </tr>
                      <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                          <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                              No hay expedientes en archivo.
                          </td>
                      </tr>
                      <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {{ exp.codigo_cliente }}
                          </td>
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[150px] truncate" :title="exp.nombre_asociado">
                              {{ exp.nombre_asociado }}
                          </td>
                           <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.tasa_interes }}%
                          </td>
                          <td class="px-6 py-4 font-mono text-gray-900 dark:text-white whitespace-nowrap">
                              {{ formatCurrency(exp.monto_documento) }}
                          </td>
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.fechas?.f_enviado_archivos ? formatDate(exp.fechas.f_enviado_archivos) : '-' }}
                          </td>
                          
                          <!-- Observación Garantía (Envío) -->
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[150px]">
                              <div 
                                v-if="exp.seguimientos?.[0]?.observacion_envio"
                                @click="showObservation(exp.seguimientos[0].observacion_envio)"
                                class="truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                title="Clic para ver completo"
                              >
                                {{ exp.seguimientos[0].observacion_envio }}
                              </div>
                              <span v-else>-</span>
                          </td>
                          
                          <!-- Garantía Real -->
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[140px]">
                             <!-- Si ya tiene valor, mostrarlo truncate -->
                             <span 
                                v-if="exp.seguimientos?.[0]?.recibi_garantia_real" 
                                class="text-green-600 font-medium text-xs block truncate"
                                :title="exp.seguimientos[0].recibi_garantia_real"
                             >
                                 {{ exp.seguimientos[0].recibi_garantia_real }}
                             </span>
                             <!-- Si no, y estado secundario es 4, mostrar botón -->
                             <button 
                                v-else-if="exp.seguimientos?.[0]?.id_estado_secundario === 4"
                                @click="recibirGarantia(exp)"
                                class="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 whitespace-nowrap"
                             >
                                Recibir Garantía
                             </button>
                             <!-- Default -->
                             <span v-else class="text-gray-400 text-xs italic whitespace-nowrap">No aplica</span>
                          </td>

                          <!-- Contrato -->
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[140px]">
                             <!-- Si ya tiene valor, mostrarlo truncate -->
                             <span 
                                v-if="exp.seguimientos?.[0]?.recibi_contrato" 
                                class="text-green-600 font-medium text-xs block truncate"
                                :title="exp.seguimientos[0].recibi_contrato"
                             >
                                 {{ exp.seguimientos[0].recibi_contrato }}
                             </span>
                             <!-- Si no, y estado es 4, mostrar botón -->
                             <button 
                                v-else-if="exp.seguimientos?.[0]?.id_estado === 4"
                                @click="recibirContratoAction(exp)"
                                class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 whitespace-nowrap"
                             >
                                Recibir Contrato
                             </button>
                             <!-- Default -->
                             <span v-else class="text-gray-400 text-xs italic whitespace-nowrap">No aplica</span>
                          </td>

                          <!-- Fecha Recibido (Archivado) -->
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.seguimientos?.[0]?.archivado_at ? formatDate(exp.seguimientos[0].archivado_at) : '-' }}
                          </td>

                          <td class="px-6 py-4 text-right">
                               <button 
                                  v-if="exp.seguimientos?.[0]?.archivado_at"
                                  disabled
                                  class="text-gray-400 font-medium text-xs whitespace-nowrap cursor-not-allowed"
                               >
                                  Completado
                              </button>
                               <button 
                                  v-else
                                  @click="archivarAction(exp)" 
                                  :disabled="!canArchive(exp)"
                                  :class="[
                                    'font-medium text-xs whitespace-nowrap',
                                    canArchive(exp) 
                                        ? 'text-blue-600 hover:text-blue-800' 
                                        : 'text-gray-300 cursor-not-allowed'
                                  ]"
                                  :title="!canArchive(exp) ? 'El expediente debe estar en Integración (Estado 11)' : ''"
                               >
                                  Archivar Expediente
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
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/api/axios'
  import Swal from 'sweetalert2'
  
  const expedientes = ref<any[]>([])
  const loading = ref(false)
  const nextPageUrl = ref<string | null>(null)
  
  const fetchExpedientes = async (url: string | null = null) => {
      loading.value = true
      try {
          const endpoint = url || '/archivo/buzon-recibidos'
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
          Swal.fire('Error', 'No se pudieron cargar los expedientes.', 'error')
      } finally {
          loading.value = false
      }
  }
  
  const loadMore = () => {
      if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
  }

  const canArchive = (exp: any) => {
      const s = exp.seguimientos?.[0]
      if (!s) return false
      
      // La condición para archivar es que el estado sea 11
      return s.id_estado === 11
  }
  
  const archivarAction = async (exp: any) => {
      const result = await Swal.fire({
          title: '¿Archivar Expediente?',
          text: `¿Estás seguro de archivar el expediente ${exp.codigo_cliente}? Se creará un registro histórico.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, archivar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366'
      })

      if (result.isConfirmed) {
          try {
              const res = await api.post(`/archivo/archivar/${exp.codigo_cliente}`)
              if (res.data.success) {
                  Swal.fire('Éxito', res.data.message, 'success')
                  fetchExpedientes() // Refresh to update button state
              }
          } catch (error: any) {
              console.error(error)
              const msg = error.response?.data?.message || 'No se pudo archivar el expediente.'
              Swal.fire('Error', msg, 'error')
          }
      }
  }
  
  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
  }

  const formatDate = (dateString: string) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString()
  }
  
  const showObservation = (text: string) => {
      Swal.fire({
          title: 'Observación Garantía',
          text: text,
          icon: 'info',
          confirmButtonText: 'Cerrar'
      })
  }

  const recibirGarantia = async (exp: any) => {
      const result = await Swal.fire({
          title: '¿Confirmar recepción?',
          text: `¿Has recibido la Garantía Real del expediente ${exp.codigo_cliente}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, recibir',
          cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
          try {
              const res = await api.post(`/archivo/recibir-garantia/${exp.codigo_cliente}`)
              if (res.data.success) {
                  Swal.fire('Éxito', res.data.message, 'success')
                  fetchExpedientes() // Refresh
              }
          } catch (error) {
              console.error(error)
              Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
          }
      }
  }

  const recibirContratoAction = async (exp: any) => {
      const result = await Swal.fire({
          title: '¿Confirmar recepción?',
          text: `¿Has recibido el Contrato del expediente ${exp.codigo_cliente}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, recibir',
          cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
          try {
              const res = await api.post(`/archivo/recibir-contrato/${exp.codigo_cliente}`)
              if (res.data.success) {
                  Swal.fire('Éxito', res.data.message, 'success')
                  fetchExpedientes() // Refresh
              }
          } catch (error) {
              console.error(error)
              Swal.fire('Error', 'No se pudo registrar la recepción.', 'error')
          }
      }
  }

  onMounted(() => {
      fetchExpedientes()
  })
  </script>
