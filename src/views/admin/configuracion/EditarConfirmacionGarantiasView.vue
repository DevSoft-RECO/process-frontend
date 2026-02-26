<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Edición Confirmación Garantías"
          subtitle="Modifica los datos y estados de las confirmaciones de documentos."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchConfirmaciones" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Garantía</label>
          <input
            v-model="searchQuery.numero"
            type="text"
            required
            placeholder="Ingrese el número..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de la Garantía (Opcional)</label>
          <input
            v-model="searchQuery.fecha"
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
            {{ loading ? 'Buscando...' : 'Buscar Confirmación' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Resultados para Selección -->
    <div v-if="results.length > 1 && !selectedConfirmacion" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Se encontraron múltiples solicitudes:</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Número</th>
              <th class="px-6 py-3">Fecha Garantía</th>
              <th class="px-6 py-3">Propietario</th>
              <th class="px-6 py-3">Fecha Creación Solicitud</th>
              <th class="px-6 py-3">Confirmación</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.id }}</td>
              <td class="px-6 py-4">{{ item.numero }}</td>
              <td class="px-6 py-4">{{ item.fecha ? formatDate(item.fecha) : 'N/A' }}</td>
              <td class="px-6 py-4 font-medium">{{ item.propietario || 'N/A' }}</td>
              <td class="px-6 py-4 text-xs">
                {{ item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(item.confirmacion)" class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                  {{ item.confirmacion || 'PENDIENTE' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="selectConfirmacion(item)" class="text-verde-cope hover:text-green-700 font-bold text-xs uppercase tracking-wider">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="selectedConfirmacion" class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">
          Editando Confirmación #{{ selectedConfirmacion.id }} - Doc: {{ selectedConfirmacion.numero }}
        </h3>
        <button @click="resetSearch" class="text-gray-500 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="updateConfirmacion" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Datos Base -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número Documento</label>
              <input v-model="editForm.numero" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha documento</label>
              <input v-model="editForm.fecha" type="date" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Documento (Texto)</label>
              <input v-model="editForm.tipo_documento" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Detalles -->
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario</label>
              <input v-model="editForm.propietario" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autorizador</label>
              <input v-model="editForm.autorizador" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro Propiedad (Texto)</label>
              <input v-model="editForm.registro_propiedad" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Finca</label>
              <input v-model="editForm.no_finca" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folio</label>
              <input v-model="editForm.folio" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libro</label>
              <input v-model="editForm.libro" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Dominio</label>
              <input v-model="editForm.no_dominio" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencia</label>
              <input v-model="editForm.referencia" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Póliza</label>
              <input v-model="editForm.monto_poliza" type="number" step="0.01" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario Solicita</label>
              <select v-model="editForm.user_id" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} ({{ u.username }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmación</label>
              <select v-model="editForm.confirmacion" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">PENDIENTE</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Confirmación</label>
              <input v-model="editForm.fecha_confirmacion" type="datetime-local" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <div class="flex items-center pt-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="editForm.archivado" type="checkbox" class="rounded border-gray-300 text-verde-cope focus:ring-verde-cope" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Archivado</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observación (Solicitud)</label>
            <textarea v-model="editForm.observacion" rows="3" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observación (Confirmación)</label>
            <textarea v-model="editForm.observacion_confirmacion" rows="3" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button type="button" @click="resetSearch" class="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
                Cancelar
             </button>
             <button type="submit" :disabled="saving" class="px-8 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {{ saving ? 'Guardando...' : 'Actualizar Confirmación' }}
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
        <p class="text-gray-500 dark:text-gray-400">No se encontraron confirmaciones de garantías para este criterio.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '@/components/common/encabezado.vue'

const searchQuery = reactive({
  numero: '',
  fecha: ''
})
const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)
const selectedConfirmacion = ref<any>(null)
const saving = ref(false)

const usuarios = ref<any[]>([])

const editForm = reactive({
  documento_id: null as number | null,
  user_id: '',
  numero: '',
  fecha: '',
  propietario: '',
  autorizador: '',
  no_finca: '',
  folio: '',
  libro: '',
  no_dominio: '',
  referencia: '',
  monto_poliza: 0,
  observacion: '',
  tipo_documento: '',
  registro_propiedad: '',
  confirmacion: null as string | null,
  observacion_confirmacion: '',
  fecha_confirmacion: '',
  archivado: false
})

const fetchCatalogs = async () => {
  try {
    const response = await api.get('/confirmacion-garantias-edicion/catalogs')
    usuarios.value = response.data.usuarios
  } catch (error) {
    console.error('Error fetching catalogs:', error)
  }
}

const searchConfirmaciones = async () => {
  loading.value = true
  searched.value = true
  selectedConfirmacion.value = null
  try {
    const params: any = { numero: searchQuery.numero }
    if (searchQuery.fecha) params.fecha = searchQuery.fecha

    const response = await api.get('/confirmacion-garantias-edicion/search', { params })
    results.value = response.data
    
    if (results.value.length === 1) {
      selectConfirmacion(results.value[0])
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo realizar la búsqueda', 'error')
  } finally {
    loading.value = false
  }
}

const selectConfirmacion = (item: any) => {
  selectedConfirmacion.value = item
  editForm.documento_id = item.documento_id
  editForm.user_id = item.user_id
  editForm.numero = item.numero
  editForm.fecha = item.fecha ? item.fecha.substring(0, 10) : ''
  editForm.propietario = item.propietario || ''
  editForm.autorizador = item.autorizador || ''
  editForm.no_finca = item.no_finca || ''
  editForm.folio = item.folio || ''
  editForm.libro = item.libro || ''
  editForm.no_dominio = item.no_dominio || ''
  editForm.referencia = item.referencia || ''
  editForm.monto_poliza = item.monto_poliza || 0
  editForm.observacion = item.observacion || ''
  editForm.tipo_documento = item.tipo_documento || ''
  editForm.registro_propiedad = item.registro_propiedad || ''
  editForm.confirmacion = item.confirmacion
  editForm.observacion_confirmacion = item.observacion_confirmacion || ''
  editForm.fecha_confirmacion = formatDateTime(item.fecha_confirmacion)
  editForm.archivado = item.archivado == 1 || item.archivado === true
}

const formatDateTime = (val: string | null) => {
  if (!val) return ''
  return val.replace(' ', 'T').substring(0, 16)
}

const updateConfirmacion = async () => {
  saving.value = true
  try {
    const payload = { ...editForm }
    await api.put(`/confirmacion-garantias-edicion/${selectedConfirmacion.value.id}`, payload)
    Swal.fire('¡Éxito!', 'La confirmación ha sido actualizada.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al actualizar la confirmación'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const resetSearch = () => {
  selectedConfirmacion.value = null
  results.value = []
  searched.value = false
  searchQuery.numero = ''
  searchQuery.fecha = ''
}

const getStatusClass = (status: string | null) => {
  if (!status) return 'bg-yellow-100 text-yellow-800'
  return status === 'SI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
