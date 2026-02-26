<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Editar Nuevo Expediente"
          subtitle="Modifica la información principal de los expedientes creados."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchExpedientes" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar por Número de Documento (Garantía)</label>
          <input
            v-model="searchQuery"
            type="text"
            required
            placeholder="Ingrese el número de documento..."
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
            {{ loading ? 'Buscando...' : 'Buscar Expediente' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Resultados para Selección -->
    <div v-if="results.length > 1 && !selectedExpediente" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Se encontraron múltiples expedientes:</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">Código Cliente</th>
              <th class="px-6 py-3">Asociado</th>
              <th class="px-6 py-3">Documento</th>
              <th class="px-6 py-3">Agencia</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.codigo_cliente }}</td>
              <td class="px-6 py-4">{{ item.nombre_asociado }}</td>
              <td class="px-6 py-4">{{ item.numero_documento }}</td>
              <td class="px-6 py-4">{{ item.agencia?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="selectExpediente(item)" class="text-verde-cope hover:text-green-700 font-bold text-xs uppercase tracking-wider">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="selectedExpediente" class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">
          Editando Expediente: {{ selectedExpediente.nombre_asociado }}
        </h3>
        <button @click="resetSearch" class="text-gray-500 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="updateExpediente" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Código Cliente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Cliente</label>
              <input v-model="editForm.codigo_cliente" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- Numero Documento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número Documento</label>
              <input v-model="editForm.numero_documento" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- CUI -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CUI</label>
              <input v-model="editForm.cui" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre Asociado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Asociado</label>
              <input v-model="editForm.nombre_asociado" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- Agencia -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agencia</label>
              <select v-model="editForm.id_agencia" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="" disabled>Seleccione una agencia</option>
                <option v-for="a in agencias" :key="a.id" :value="a.id">{{ a.nombre }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <!-- Asesor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asesor</label>
              <select v-model="editForm.usuario_asesor" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="" disabled>Seleccione un asesor</option>
                <option v-for="u in asesores" :key="u.username" :value="u.username">{{ u.username }} ({{ u.name }})</option>
              </select>
            </div>
            <!-- Tasa Interés -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tasa Interés (%)</label>
              <input v-model.number="editForm.tasa_interes" type="number" step="0.01" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- Monto Documento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Documento</label>
              <input v-model.number="editForm.monto_documento" type="number" step="0.01" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Tipo Garantía -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Garantía</label>
              <input v-model="editForm.tipo_garantia" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- Fecha Inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Inicio</label>
              <input v-model="editForm.fecha_inicio" type="date" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <input v-model="editForm.estado" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button type="button" @click="resetSearch" class="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
                Cancelar
             </button>
             <button type="submit" :disabled="saving" class="px-8 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {{ saving ? 'Guardando...' : 'Actualizar Expediente' }}
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
        <p class="text-gray-500 dark:text-gray-400">No se encontraron expedientes con ese número de documento.</p>
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
const selectedExpediente = ref<any>(null)
const saving = ref(false)

const agencias = ref<any[]>([])
const asesores = ref<any[]>([])

const editForm = reactive({
  codigo_cliente: '',
  id_agencia: '',
  numero_documento: '',
  usuario_asesor: '',
  tasa_interes: 0,
  monto_documento: 0,
  tipo_garantia: '',
  fecha_inicio: '',
  cui: '',
  nombre_asociado: '',
  estado: '',
})

const fetchCatalogs = async () => {
  try {
    const response = await api.get('/nuevo-expediente-edicion/catalogs')
    agencias.value = response.data.agencias
    asesores.value = response.data.asesores
  } catch (error) {
    console.error('Error fetching catalogs:', error)
  }
}

const searchExpedientes = async () => {
  loading.value = true
  searched.value = true
  selectedExpediente.value = null
  try {
    const response = await api.get('/nuevo-expediente-edicion/search', { params: { numero_documento: searchQuery.value } })
    results.value = response.data
    
    if (results.value.length === 1) {
      selectExpediente(results.value[0])
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo realizar la búsqueda', 'error')
  } finally {
    loading.value = false
  }
}

const selectExpediente = (item: any) => {
  selectedExpediente.value = item
  editForm.codigo_cliente = String(item.codigo_cliente || '')
  editForm.id_agencia = item.id_agencia
  editForm.numero_documento = item.numero_documento
  editForm.usuario_asesor = item.usuario_asesor
  editForm.tasa_interes = item.tasa_interes
  editForm.monto_documento = item.monto_documento
  editForm.tipo_garantia = item.tipo_garantia
  editForm.fecha_inicio = item.fecha_inicio ? item.fecha_inicio.substring(0, 10) : ''
  editForm.cui = item.cui
  editForm.nombre_asociado = item.nombre_asociado
  editForm.estado = item.estado
}

const updateExpediente = async () => {
  saving.value = true
  try {
    const payload = { ...editForm, codigo_cliente: String(editForm.codigo_cliente) }
    await api.put(`/nuevo-expediente-edicion/${selectedExpediente.value.id}`, payload)
    Swal.fire('¡Éxito!', 'El expediente ha sido actualizado.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al actualizar el expediente'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const resetSearch = () => {
  selectedExpediente.value = null
  results.value = []
  searched.value = false
  searchQuery.value = ''
}

onMounted(() => {
  fetchCatalogs()
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
