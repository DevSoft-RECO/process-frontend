<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Archivo Sistema
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Listado histórico completo de expedientes finalizados en sistema.
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
                          <th scope="col" class="px-6 py-3">ID</th>
                          <th scope="col" class="px-6 py-3">Código</th>
                          <th scope="col" class="px-6 py-3">Agencia</th>
                          <th scope="col" class="px-6 py-3">Asociado / Producto</th>
                          <th scope="col" class="px-6 py-3">Interés</th>
                          <th scope="col" class="px-6 py-3">Monto</th>
                          <th scope="col" class="px-6 py-3">Fecha Inicio</th>
                          <th scope="col" class="px-6 py-3">Fecha Archivo</th>
                          <th scope="col" class="px-6 py-3">Estado</th>
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
                              No hay expedientes en el sistema de archivo.
                          </td>
                      </tr>
                      <tr v-for="exp in expedientes" :key="exp.id" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {{ exp.id }}
                          </td>
                          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {{ exp.codigo_cliente }}
                          </td>
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.agencia?.nombre || '-' }}
                          </td>
                          <!-- <td class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[150px] truncate" :title="exp.nombre_asociado">
                              {{ exp.nombre_asociado }}
                          </td> -->
                           <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              <span class="block text-xs font-bold">{{ exp.nombre_asociado }}</span>
                              <span class="block">{{ exp.numero_documento }}</span>
                          </td>
                           <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.tasa_interes }}%
                          </td>
                          <td class="px-6 py-4 font-mono text-gray-900 dark:text-white whitespace-nowrap">
                              {{ formatCurrency(exp.monto_documento) }}
                          </td>
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ formatDate(exp.fecha_inicio) }}
                          </td>
                          
                          <!-- Fecha Archivo -->
                          <td class="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {{ exp.seguimientos?.[0]?.archivado_at ? formatDate(exp.seguimientos[0].archivado_at) : '-' }}
                          </td>
                          
                          <td class="px-6 py-4">
                              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                  Finalizado
                              </span>
                          </td>

                          <td class="px-6 py-4 text-right">
                               <button 
                                  @click="verDetalles(exp)" 
                                  class="text-blue-600 hover:text-blue-800 font-medium text-xs whitespace-nowrap"
                               >
                                  Ver Detalles
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <!-- Pagination -->
          <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-center">
              <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold hover:underline">
                  {{ loading ? 'Cargando...' : 'Cargar más registros' }}
              </button>
          </div>
      </div>
      
      <!-- Modal Detalles (Placeholder Logic) -->
      <!-- Podrías reutilizar TrackingModal o DetallesModal aquí si fuera necesario -->

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
          const endpoint = url || '/archivo/sistema'
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
  
  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
  }

  const formatDate = (dateString: string) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString()
  }

  const verDetalles = (exp: any) => {
      // Por ahora solo redirige al tracking como visualización rápida
       window.open(`/admin/tracking/${exp.codigo_cliente}`, '_blank')
  }

  onMounted(() => {
      fetchExpedientes()
  })
  </script>
