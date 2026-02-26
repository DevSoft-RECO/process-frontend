<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Editar Detalles de Garantía"
          subtitle="Busca y edita codeudores y observaciones de las garantías."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchDetalles" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar por ID de Expediente o Garantía</label>
          <input
            v-model="searchQuery"
            type="text"
            required
            placeholder="Ingrese el ID..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full md:w-auto px-6 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50"
          >
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Buscando...' : 'Buscar Detalles' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Resultados para Selección -->
    <div v-if="results.length > 1 && !selectedDetalle" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Se encontraron múltiples registros:</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">ID Expediente</th>
              <th class="px-6 py-3">Nombre Asociado</th>
              <th class="px-6 py-3">Garantía</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.nuevo_expediente_id }}</td>
              <td class="px-6 py-4">{{ item.nuevo_expediente?.nombre_asociado || 'N/A' }}</td>
              <td class="px-6 py-4">{{ item.garantia?.nombre || `ID: ${item.garantia_id}` }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="selectDetalle(item)" class="text-verde-cope hover:text-green-700 font-bold text-xs uppercase tracking-wider">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="selectedDetalle" class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">
          Editando Detalles para: {{ selectedDetalle.nuevo_expediente?.nombre_asociado || selectedDetalle.nuevo_expediente_id }}
        </h3>
        <button @click="resetSearch" class="text-gray-500 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="updateDetalle" class="space-y-6">
          <!-- Garantía -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bold">Tipo de Garantía</label>
            <select v-model="editForm.garantia_id" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="" disabled>Seleccione una garantía</option>
                <option v-for="g in garantias" :key="g.id" :value="g.id">{{ g.nombre }}</option>
            </select>
          </div>

          <!-- Codeudores y Observaciones en Paralelo -->
          <div class="space-y-4">
            <div v-for="i in 4" :key="`row-${i}`" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bold">Codeudor {{ i }}</label>
                <input v-model="editForm[`codeudor${i}` as keyof typeof editForm]" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bold">Observación {{ i }}</label>
                <textarea v-model="editForm[`observacion${i}` as keyof typeof editForm]" rows="1" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white shadow-sm"></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button type="button" @click="resetSearch" class="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
                Cancelar
             </button>
             <button type="submit" :disabled="saving" class="px-8 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {{ saving ? 'Guardando...' : 'Actualizar Detalles' }}
             </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="searched && results.length === 0 && !loading" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-gray-400 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">No se encontraron registros con el ID ingresado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '@/components/common/encabezado.vue'

const searchQuery = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)
const selectedDetalle = ref<any>(null)
const saving = ref(false)
const garantias = ref<any[]>([])

const editForm = reactive({
  garantia_id: '',
  codeudor1: '',
  codeudor2: '',
  codeudor3: '',
  codeudor4: '',
  observacion1: '',
  observacion2: '',
  observacion3: '',
  observacion4: '',
})

const fetchGarantias = async () => {
  try {
    const response = await api.get('/garantias', { params: { all: 1 } })
    garantias.value = response.data.data
  } catch (error) {
    console.error('Error fetching garantias:', error)
  }
}

const searchDetalles = async () => {
  loading.value = true
  searched.value = true
  selectedDetalle.value = null
  try {
    const response = await api.get('/detalle-garantia-edicion/search', { params: { search: searchQuery.value } })
    results.value = response.data
    
    if (results.value.length === 1) {
      selectDetalle(results.value[0])
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo realizar la búsqueda', 'error')
  } finally {
    loading.value = false
  }
}

const selectDetalle = (item: any) => {
  selectedDetalle.value = item
  editForm.garantia_id = item.garantia_id
  editForm.codeudor1 = item.codeudor1 || ''
  editForm.codeudor2 = item.codeudor2 || ''
  editForm.codeudor3 = item.codeudor3 || ''
  editForm.codeudor4 = item.codeudor4 || ''
  editForm.observacion1 = item.observacion1 || ''
  editForm.observacion2 = item.observacion2 || ''
  editForm.observacion3 = item.observacion3 || ''
  editForm.observacion4 = item.observacion4 || ''
}

const updateDetalle = async () => {
  saving.value = true
  try {
    await api.put(`/detalle-garantia-edicion/${selectedDetalle.value.id}`, editForm)
    Swal.fire('¡Éxito!', 'Los detalles han sido actualizados.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al actualizar los detalles'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const resetSearch = () => {
  selectedDetalle.value = null
  results.value = []
  searched.value = false
  searchQuery.value = ''
}

onMounted(() => {
  fetchGarantias()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
