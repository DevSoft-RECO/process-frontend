<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Editar Solicitud Administrativa"
          subtitle="Modifica el flujo y los estados de las solicitudes de retiro."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchSolicitudes" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar por Número de Producto</label>
          <input
            v-model="searchQuery"
            type="text"
            required
            placeholder="Ingrese el ID o número de documento..."
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
            {{ loading ? 'Buscando...' : 'Buscar Solicitud' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Resultados para Selección -->
    <div v-if="results.length > 1 && !selectedSolicitud" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Se encontraron múltiples solicitudes:</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">ID Solic.</th>
              <th class="px-6 py-3">Expediente</th>
              <th class="px-6 py-3">Asociado</th>
              <th class="px-6 py-3">Fecha Solic.</th>
              <th class="px-6 py-3">Estado Solic.</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.id }}</td>
              <td class="px-6 py-4">{{ item.expediente?.numero_documento || 'ID: ' + item.id_expediente }}</td>
              <td class="px-6 py-4">{{ item.expediente?.nombre_asociado || 'N/A' }}</td>
              <td class="px-6 py-4">{{ item.fecha_solicitud ? new Date(item.fecha_solicitud).toLocaleDateString() : 'N/A' }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(item.estado_solicitud)" class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                  {{ item.estado_solicitud || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="selectSolicitud(item)" class="text-verde-cope hover:text-green-700 font-bold text-xs uppercase tracking-wider">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="selectedSolicitud" class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">
          Editando Solicitud #{{ selectedSolicitud.id }} - Exp: {{ selectedSolicitud.expediente?.numero_documento }}
        </h3>
        <button @click="resetSearch" class="text-gray-500 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="updateSolicitud" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Agencia -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agencia Solicitante</label>
              <select v-model="editForm.id_agencia" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option v-for="a in agencias" :key="a.id" :value="a.id">{{ a.nombre }}</option>
              </select>
            </div>
            <!-- Fecha Solicitud -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Solicitud</label>
              <input v-model="editForm.fecha_solicitud" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
             <!-- Usuario Solicita -->
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Solicita</label>
              <select v-model="editForm.id_usuario_solicita" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <!-- Estado Solicitud -->
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado Flujo (Interno)</label>
              <select v-model="editForm.estado_solicitud" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="pendiente">Pendiente</option>
                <option value="recibido_por_admin">Recibido por Admin</option>
                <option value="despachado">Despachado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
            <!-- Usuario Despacho -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Despacho</label>
              <select v-model="editForm.id_usuario_despacho" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">Ninguno</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
            <!-- Fecha Despacho -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Despacho</label>
              <input v-model="editForm.fecha_despacho" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Confirmación Solicitante -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmación Recepción Agencia</label>
              <select v-model="editForm.confirmacion_solicitante" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="pendiente">Pendiente</option>
                <option value="si">Confirmado (SI)</option>
              </select>
            </div>
             <!-- Fecha Devolución Iniciada -->
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Devolución Iniciada</label>
              <input v-model="editForm.fecha_devolucion_iniciada" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <!-- Confirmación Reingreso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmación Reingreso Central</label>
              <select v-model="editForm.confirmacion_reingreso" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="pendiente">Pendiente</option>
                <option value="si">Confirmado (SI)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Fecha Finalización -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Finalización</label>
              <input v-model="editForm.fecha_finalizacion" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <!-- Observaciones -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-verde-cope font-bold">Observaciones Solicitud</label>
              <textarea v-model="editForm.observaciones" rows="3" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-azul-cope font-bold">Observación Despacho</label>
              <textarea v-model="editForm.observacion_despacho" rows="3" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button type="button" @click="resetSearch" class="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
                Cancelar
             </button>
             <button type="submit" :disabled="saving" class="px-8 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {{ saving ? 'Guardando...' : 'Actualizar Solicitud' }}
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
        <p class="text-gray-500 dark:text-gray-400">No se encontraron solicitudes administrativas para este criterio.</p>
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
const selectedSolicitud = ref<any>(null)
const saving = ref(false)

const agencias = ref<any[]>([])
const usuarios = ref<any[]>([])

const editForm = reactive({
  id_agencia: '',
  id_usuario_solicita: '',
  fecha_solicitud: '',
  estado_solicitud: '',
  id_usuario_despacho: null as number | null,
  fecha_despacho: '',
  confirmacion_solicitante: '',
  fecha_devolucion_iniciada: '',
  confirmacion_reingreso: '',
  fecha_finalizacion: '',
  observaciones: '',
  observacion_despacho: '',
})

const fetchCatalogs = async () => {
  try {
    const response = await api.get('/solicitud-administrativa-edicion/catalogs')
    agencias.value = response.data.agencias
    usuarios.value = response.data.usuarios
  } catch (error) {
    console.error('Error fetching catalogs:', error)
  }
}

const searchSolicitudes = async () => {
  loading.value = true
  searched.value = true
  selectedSolicitud.value = null
  try {
    const response = await api.get('/solicitud-administrativa-edicion/search', { params: { search: searchQuery.value } })
    results.value = response.data
    
    if (results.value.length === 1) {
      selectSolicitud(results.value[0])
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo realizar la búsqueda', 'error')
  } finally {
    loading.value = false
  }
}

const selectSolicitud = (item: any) => {
  selectedSolicitud.value = item
  editForm.id_agencia = item.id_agencia
  editForm.id_usuario_solicita = item.id_usuario_solicita
  editForm.fecha_solicitud = formatDateTime(item.fecha_solicitud)
  editForm.estado_solicitud = item.estado_solicitud || 'pendiente'
  editForm.id_usuario_despacho = item.id_usuario_despacho
  editForm.fecha_despacho = formatDateTime(item.fecha_despacho)
  editForm.confirmacion_solicitante = item.confirmacion_solicitante || 'pendiente'
  editForm.fecha_devolucion_iniciada = formatDateTime(item.fecha_devolucion_iniciada)
  editForm.confirmacion_reingreso = item.confirmacion_reingreso || 'pendiente'
  editForm.fecha_finalizacion = formatDateTime(item.fecha_finalizacion)
  editForm.observaciones = item.observaciones || ''
  editForm.observacion_despacho = item.observacion_despacho || ''
}

const formatDateTime = (val: string | null) => {
  if (!val) return ''
  // Laravel returns YYYY-MM-DD HH:mm:ss. input[type=datetime-local] wants YYYY-MM-DDTHH:mm
  return val.replace(' ', 'T').substring(0, 16)
}

const updateSolicitud = async () => {
  saving.value = true
  try {
    // Convert T back to space if needed by Laravel (it usually handles both)
    const payload = { ...editForm }
    await api.put(`/solicitud-administrativa-edicion/${selectedSolicitud.value.id}`, payload)
    Swal.fire('¡Éxito!', 'La solicitud ha sido actualizada.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al actualizar la solicitud'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const resetSearch = () => {
  selectedSolicitud.value = null
  results.value = []
  searched.value = false
  searchQuery.value = ''
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800'
    case 'recibido_por_admin': return 'bg-blue-100 text-blue-800'
    case 'despachado': return 'bg-purple-100 text-purple-800'
    case 'archivado': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
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
