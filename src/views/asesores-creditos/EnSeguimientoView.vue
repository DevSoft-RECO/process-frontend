<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Encabezado
              labelIndicator="Asesor de Creditos"
              title="En Seguimiento"
              subtitle="Expedientes que se encuentran en proceso de seguimiento."
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
    </div>

    <ExpedientesTable 
        :expedientes="expedientes"
        :loading="loading"
        :pagination="pagination"
        @open-adjuntar="openAdjuntarModal"
        @open-detalles="openDetallesModal"
        @open-tracking="openTrackingModal"
        @change-page="(page) => fetchExpedientes(`/nuevos-expedientes?page=${page}`)"
    />

    <AdjuntarModal 
        :show="showAdjuntarModal"
        :expediente="selectedExpediente"
        @close="closeModals"
        @saved="handleSaved"
    />

    <DetallesModal 
        :show="showDetallesModal"
        :expediente="selectedExpediente"
        @close="closeModals"
        @saved="handleSaved"
    />

    <TrackingModal
        :show="showTrackingModal"
        :expediente="selectedExpediente"
        @close="closeModals"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

import ExpedientesTable from '../consultas/components/ExpedientesTable.vue'
import AdjuntarModal from '../consultas/components/AdjuntarModal.vue'
import DetallesModal from '../consultas/components/DetallesModal.vue'
import TrackingModal from '../consultas/components/TrackingModal.vue'
import Encabezado from '../../components/common/encabezado.vue'

const expedientes = ref<any[]>([])
const loading = ref(false)
const pagination = ref<any | null>(null)

const showAdjuntarModal = ref(false)
const showDetallesModal = ref(false)
const showTrackingModal = ref(false)
const selectedExpediente = ref<any>(null)

const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    let endpoint = url || '/nuevos-expedientes'
    
    // Filter by 'seguimiento'
    const separator = endpoint.includes('?') ? '&' : '?'
    if (!endpoint.includes('tab=')) {
        endpoint = `${endpoint}${separator}tab=seguimiento`
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

const resetFetch = () => fetchExpedientes(null)

const handleSaved = () => {
    fetchExpedientes()
}

const openAdjuntarModal = (exp: any) => {
    selectedExpediente.value = exp
    showAdjuntarModal.value = true
}

const openDetallesModal = (exp: any) => {
    selectedExpediente.value = exp
    showDetallesModal.value = true
}

const openTrackingModal = (exp: any) => {
    selectedExpediente.value = exp
    showTrackingModal.value = true
}

const closeModals = () => {
    showAdjuntarModal.value = false
    showDetallesModal.value = false
    showTrackingModal.value = false
    selectedExpediente.value = null
}

onMounted(() => {
    fetchExpedientes()
})
</script>
