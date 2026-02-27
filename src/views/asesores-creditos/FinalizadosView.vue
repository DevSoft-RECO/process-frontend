<template>
    <div class="space-y-6">
      <div class="flex flex-col gap-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Encabezado
                labelIndicator="Asesor de Creditos"
                title="Finalizados"
                subtitle="Historial de expedientes que han completado el proceso."
              />
            </div>
            <div class="flex gap-2">
               <button @click="resetFetch" class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Refrescar
               </button>
            </div>
          </div>
  
          <!-- Busqueda Global -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div class="relative w-full md:max-w-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  </div>
                  <input 
                      v-model="search"
                      @input="debouncedSearch"
                      type="text" 
                      placeholder="Buscar en histórico (Código, Cliente, CUI)..." 
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-verde-cope focus:border-verde-cope sm:text-sm transition-colors"
                  >
              </div>
          </div>
      </div>
  
      <!-- Table Component -->
      <ExpedientesTable 
          :expedientes="expedientes"
          :loading="loading"
          :pagination="pagination"
          :hide-actions="true"
          :finalized-mode="true"
          @change-page="(page) => fetchExpedientes(`/nuevos-expedientes/finalizados?page=${page}`)"
          @open-detalles="openDetallesModal"
      />
      <!-- Actions are hidden unless strictly needed, we pass open-detalles just in case user wants to see info -->
  
      <DetallesModal 
        :show="showDetallesModal"
        :expediente="selectedExpediente"
        @close="closeModals"
        :readonly="true" 
    />
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/api/axios'
  
  // Components
  import ExpedientesTable from '../consultas/components/ExpedientesTable.vue'
  import DetallesModal from '../consultas/components/DetallesModal.vue'
  import Encabezado from '../../components/common/encabezado.vue'
  
  // State
  const expedientes = ref<any[]>([])
  const loading = ref(false)
  const pagination = ref<any | null>(null)
  const search = ref('')
  
  const showDetallesModal = ref(false)
  const selectedExpediente = ref<any>(null)
  
  // Debounce helper
  let timeout: any = null
  const debouncedSearch = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
          fetchExpedientes(null)
      }, 500)
  }
  
  // Methods
  const fetchExpedientes = async (url: string | null = null) => {
      loading.value = true
      let endpoint = url || '/nuevos-expedientes/finalizados'
      
      const separator = endpoint.includes('?') ? '&' : '?'
      if(search.value && !endpoint.includes('search=')) {
          endpoint = `${endpoint}${separator}search=${search.value}`
      }
  
      try {
          const response = await api.get(endpoint)
          if (response.data.success) {
              const resData = response.data.data
              expedientes.value = resData.data
              pagination.value = {
                current_page: resData.current_page,
                last_page: resData.last_page,
                from: resData.from,
                to: resData.to,
                total: resData.total
            }
          }
      } catch (error) {
          console.error(error)
      } finally {
          loading.value = false
      }
  }
  
  const resetFetch = () => {
      search.value = ''
      fetchExpedientes(null)
  }
  
  const openDetallesModal = (exp: any) => {
      selectedExpediente.value = exp
      showDetallesModal.value = true
  }
  
  const closeModals = () => {
      showDetallesModal.value = false
      selectedExpediente.value = null
  }
  
  onMounted(() => {
      fetchExpedientes()
  })
  </script>
