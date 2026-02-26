<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Editar Sol Retiro Garantias"
          subtitle="Modifica los estados y datos de las solicitudes de retiro de garantías."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchSolicitudes" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de la garantia</label>
          <input
            v-model="searchQuery.numero_documento"
            type="text"
            required
            placeholder="Ingrese el número..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de la garantia</label>
          <input
            v-model="searchQuery.fecha_documento"
            type="date"
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
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Documento</th>
              <th class="px-6 py-3">Fecha Doc.</th>
              <th class="px-6 py-3">Nombre/Título</th>
              <th class="px-6 py-3">Tipo</th>
              <th class="px-6 py-3">Fecha Solic.</th>
              <th class="px-6 py-3">Estado</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.id }}</td>
              <td class="px-6 py-4">{{ item.numero_documento }}</td>
              <td class="px-6 py-4">{{ item.fecha_documento ? formatDate(item.fecha_documento) : 'N/A' }}</td>
              <td class="px-6 py-4">{{ item.titulo_nombre }}</td>
              <td class="px-6 py-4">{{ item.tipo_retiro }}</td>
              <td class="px-6 py-4">{{ item.fecha_solicitud ? formatDate(item.fecha_solicitud) : 'N/A' }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(item.estado_actual)" class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                  {{ getStatusLabel(item.estado_actual) }}
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
          Editando Solicitud #{{ selectedSolicitud.id }} - Doc: {{ selectedSolicitud.numero_documento }}
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
            <!-- Datos Base -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número Documento</label>
              <input v-model="editForm.numero_documento" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Documento</label>
              <input v-model="editForm.fecha_documento" type="date" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre / Título</label>
              <input v-model="editForm.titulo_nombre" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- IDs Relacionados -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Expediente (Sistema)</label>
              <input v-model="editForm.id_expediente" type="number" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Expediente Histórico</label>
              <input v-model="editForm.id_expediente_historico" type="number" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Retiro</label>
              <select v-model="editForm.tipo_retiro" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="Temporal">Temporal</option>
                <option value="Definitivo">Definitivo</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Agencias -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agencia Solicitante</label>
              <select v-model="editForm.id_agencia" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option v-for="a in agencias" :key="a.id" :value="a.id">{{ a.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agencia Entrega</label>
              <select v-model="editForm.id_agencia_entrega" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">Ninguna</option>
                <option v-for="a in agencias" :key="a.id" :value="a.id">{{ a.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado Actual</label>
              <select v-model="editForm.estado_actual" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option :value="1">1 - Solicitado</option>
                <option :value="2">2 - Despacho Temporal</option>
                <option :value="3">3 - Despacho Definitivo</option>
                <option :value="4">4 - Recibido Agencia</option>
                <option :value="5">5 - Entregado Asociado</option>
                <option :value="6">6 - En Retorno</option>
                <option :value="0">0 - Archivado / Finalizado</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Usuarios -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Solicitante</label>
              <select v-model="editForm.id_usuario_solicitante" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Despacho</label>
              <select v-model="editForm.id_usuario_despacho" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">Ninguno</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Entrega</label>
              <select v-model="editForm.id_usuario_entrega" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">Ninguno</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Fechas Flujo -->
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Solicitud</label>
              <input v-model="editForm.fecha_solicitud" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Envío/Despacho</label>
              <input v-model="editForm.fecha_envio" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <!-- Justificación -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Justificación del Retiro</label>
            <textarea v-model="editForm.justificacion" rows="3" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required></textarea>
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
        <p class="text-gray-500 dark:text-gray-400">No se encontraron solicitudes de retiro para este criterio.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '@/components/common/encabezado.vue'

const searchQuery = reactive({
  numero_documento: '',
  fecha_documento: ''
})
const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)
const selectedSolicitud = ref<any>(null)
const saving = ref(false)

const agencias = ref<any[]>([])
const usuarios = ref<any[]>([])

const editForm = reactive({
  id_expediente: null as number | null,
  id_expediente_historico: null as number | null,
  numero_documento: '',
  fecha_documento: '',
  id_documento: null as number | null,
  titulo_nombre: '',
  id_agencia: '',
  id_usuario_solicitante: '',
  tipo_retiro: 'Temporal',
  justificacion: '',
  fecha_solicitud: '',
  id_usuario_despacho: null as number | null,
  fecha_envio: '',
  id_usuario_entrega: null as number | null,
  id_agencia_entrega: null as number | null,
  estado_actual: 1
})

const fetchCatalogs = async () => {
  try {
    const response = await api.get('/solicitud-retiro-edicion/catalogs')
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
    const params: any = { numero_documento: searchQuery.numero_documento }
    if (searchQuery.fecha_documento) params.fecha_documento = searchQuery.fecha_documento

    const response = await api.get('/solicitud-retiro-edicion/search', { params })
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
  editForm.id_expediente = item.id_expediente
  editForm.id_expediente_historico = item.id_expediente_historico
  editForm.numero_documento = item.numero_documento
  editForm.fecha_documento = item.fecha_documento ? item.fecha_documento.substring(0, 10) : ''
  editForm.id_documento = item.id_documento
  editForm.titulo_nombre = item.titulo_nombre
  editForm.id_agencia = item.id_agencia
  editForm.id_usuario_solicitante = item.id_usuario_solicitante
  editForm.tipo_retiro = item.tipo_retiro
  editForm.justificacion = item.justificacion
  editForm.fecha_solicitud = formatDateTime(item.fecha_solicitud)
  editForm.id_usuario_despacho = item.id_usuario_despacho
  editForm.fecha_envio = formatDateTime(item.fecha_envio)
  editForm.id_usuario_entrega = item.id_usuario_entrega
  editForm.id_agencia_entrega = item.id_agencia_entrega
  editForm.estado_actual = item.estado_actual
}

const formatDateTime = (val: string | null) => {
  if (!val) return ''
  return val.replace(' ', 'T').substring(0, 16)
}

const updateSolicitud = async () => {
  saving.value = true
  try {
    const payload = { ...editForm }
    await api.put(`/solicitud-retiro-edicion/${selectedSolicitud.value.id}`, payload)
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
  searchQuery.numero_documento = ''
  searchQuery.fecha_documento = ''
}

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0: return 'Archivado'
    case 1: return 'Solicitado'
    case 2: return 'Despacho Temporal'
    case 3: return 'Despacho Definitivo'
    case 4: return 'Recibido Agencia'
    case 5: return 'Entregado Asociado'
    case 6: return 'En Retorno'
    default: return 'Desconocido'
  }
}

const getStatusClass = (status: number) => {
  switch (status) {
    case 0: return 'bg-gray-100 text-gray-800'
    case 1: return 'bg-yellow-100 text-yellow-800'
    case 2: return 'bg-blue-100 text-blue-800'
    case 3: return 'bg-purple-100 text-purple-800'
    case 4: return 'bg-indigo-100 text-indigo-800'
    case 5: return 'bg-green-100 text-green-800'
    case 6: return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A'
  const datePart = (dateStr as string).split('T')[0] as string
  const finalDatePart = datePart.split(' ')[0] as string
  const parts = finalDatePart.split('-')
  if (parts.length !== 3) return dateStr
  const y = parseInt(parts[0] as string)
  const m = parseInt(parts[1] as string)
  const d = parseInt(parts[2] as string)
  if (isNaN(y) || isNaN(m) || isNaN(d) || y === 0) return dateStr
  return new Date(y, m - 1, d).toLocaleDateString()
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
