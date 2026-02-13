<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <Encabezado
          title="Sincronizar Agencias"
          subtitle="Administración para la sincronización de agencias desde la App Madre."
          labelIndicator="Ajustes Generales"
          indicator-color="bg-informatica"
          />

      <div class="flex gap-3">
        <button 
          @click="fetchData" 
          :disabled="loading"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" :class="{'animate-spin': loading}">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refrescar Lista
        </button>

        <button 
          @click="saveChanges" 
          :disabled="saving || agencias.length === 0"
          class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
            <svg v-if="saving" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Sincronizar Todo</span>
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p>Esta lista proviene de la App Madre. Al sincronizar, se duplicarán localmente usando el <strong>Código de Madre</strong> como referencia.</p>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">ID Madre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre Agencia</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código (Madre)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Estado</th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="loading">
                    <td colspan="4" class="px-6 py-10 text-center text-gray-500 animate-pulse">Cargando agencias...</td>
                </tr>
                <tr v-else-if="agencias.length === 0">
                    <td colspan="4" class="px-6 py-10 text-center text-gray-500">No se encontraron agencias.</td>
                </tr>
                <tr v-for="agencia in agencias" :key="agencia.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {{ agencia.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {{ agencia.nombre }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {{ agencia.codigo_madre }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                        <span 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="agencia.is_synced ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'"
                        >
                            {{ agencia.is_synced ? 'Sincronizado' : 'Pendiente' }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import Encabezado from '../../components/common/encabezado.vue'

interface AgenciaSync {
    id: number;
    nombre: string;
    codigo_madre: number;
    is_synced: boolean;
}

const agencias = ref<AgenciaSync[]>([]);
const loading = ref(false);
const saving = ref(false);

const fetchData = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/agencias/sync-preview');
        agencias.value = data;
    } catch (error) {
        console.error('Error fetching agencias:', error);
        Swal.fire('Error', 'No se pudo obtener la lista de agencias de la App Madre', 'error');
    } finally {
        loading.value = false;
    }
};

const saveChanges = async () => {
    saving.value = true;
    try {
        // Al no haber inputs manuales, enviamos toda la lista
        await api.post('/agencias/sync', { agencias: agencias.value });
        
        Swal.fire('Guardado', 'Sincronización completada exitosamente', 'success');
        fetchData(); // Recargar para ver status actualizado

    } catch (error) {
        console.error('Error saving agencias:', error);
        Swal.fire('Error', 'Hubo un problema al sincronizar', 'error');
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>
