<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Editar Garantías"
          subtitle="Busca y edita información de documentos por número y fecha."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
        />
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <form @submit.prevent="searchDocuments" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Documento</label>
          <input
            v-model="searchFields.numero"
            type="text"
            required
            placeholder="Ej. 123456"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha del Documento</label>
          <input
            v-model="searchFields.fecha"
            type="date"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50"
          >
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Buscando...' : 'Buscar Documento' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Resultados para Selección (si hay más de uno) -->
    <div v-if="results.length > 1 && !selectedDocument" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Se encontraron múltiples coincidencias. Seleccione una:</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">Propietario</th>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Número</th>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3">Tipo</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="doc in results" :key="doc.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ doc.propietario }}</td>
              <td class="px-6 py-4"><span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs font-mono">{{ doc.id }}</span></td>
              <td class="px-6 py-4">{{ doc.numero }}</td>
              <td class="px-6 py-4">{{ doc.fecha }}</td>
              <td class="px-6 py-4">{{ doc.tipo_documento?.nombre || 'N/A' }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="selectDocument(doc)" class="text-verde-cope hover:text-green-700 font-bold text-xs uppercase tracking-wider">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="selectedDocument" class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase flex items-center gap-2">
          <span>Editando Documento: {{ selectedDocument.numero }}</span>
          <span class="px-2 py-0.5 bg-verde-cope/10 text-verde-cope rounded text-xs font-mono ml-2">ID: {{ selectedDocument.id }}</span>
        </h3>
        <button @click="resetSearch" class="text-gray-500 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="updateDocument" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
            <input v-model="editForm.numero" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
            <input v-model="editForm.fecha" type="date" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento</label>
            <select v-model="editForm.tipo_documento_id" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option value="" disabled>Seleccione un tipo</option>
                <option v-for="t in tipoDocumentos" :key="t.id" :value="t.id">{{ t.nombre }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario</label>
            <input v-model="editForm.propietario" type="text" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro de Propiedad</label>
            <select v-model="editForm.registro_propiedad_id" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white">
                <option :value="null">N/A</option>
                <option v-for="r in registrosPropiedad" :key="r.id" :value="r.id">{{ r.nombre }}</option>
            </select>
          </div>
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
            <select v-model="editForm.estado" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white" required>
                <option :value="originalEstado">{{ originalEstado }} (Actual)</option>
                <option value="activo">activo</option>
                <option value="temporal">temporal</option>
                <option value="definitivo">definitivo</option>
            </select>
          </div>
          <div class="lg:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observación</label>
            <textarea v-model="editForm.observacion" rows="2" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <div class="lg:col-span-3 flex flex-col md:flex-row justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
             <div>
                <button type="button" @click="confirmDelete" :disabled="saving || deleting" class="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition font-medium flex items-center gap-2">
                    <svg v-if="!deleting" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span v-else class="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></span>
                    {{ deleting ? 'Eliminando...' : 'Eliminar Documento' }}
                </button>
             </div>
             <div class="flex gap-3">
                <button type="button" @click="resetSearch" class="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
                    Cancelar
                </button>
                <button type="submit" :disabled="saving || deleting" class="px-8 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                    <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    {{ saving ? 'Guardando...' : 'Actualizar Información' }}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="searched && results.length === 0 && !loading" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-gray-400 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">No se encontraron documentos con los criterios ingresados.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '@/components/common/encabezado.vue'

const searchFields = reactive({
  numero: '',
  fecha: ''
})

const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)
const selectedDocument = ref<any>(null)
const saving = ref(false)
const deleting = ref(false)

const tipoDocumentos = ref<any[]>([])
const registrosPropiedad = ref<any[]>([])
const originalEstado = ref('')

const editForm = reactive({
  numero: '',
  fecha: '',
  propietario: '',
  no_finca: '',
  folio: '',
  libro: '',
  observacion: '',
  estado: '',
  tipo_documento_id: '',
  registro_propiedad_id: null as number | null
})

const fetchCatalogs = async () => {
  try {
    const [tiposRes, registrosRes] = await Promise.all([
      api.get('/tipo-documentos', { params: { all: 1 } }),
      api.get('/registros-propiedad', { params: { all: 1 } })
    ])
    tipoDocumentos.value = tiposRes.data.data
    registrosPropiedad.value = registrosRes.data.data
  } catch (error) {
    console.error('Error fetching catalogs:', error)
  }
}

const searchDocuments = async () => {
  loading.value = true
  searched.value = true
  selectedDocument.value = null
  try {
    const response = await api.get('/documentos-edicion/search', { params: searchFields })
    results.value = response.data
    
    if (results.value.length === 1) {
      selectDocument(results.value[0])
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo realizar la búsqueda', 'error')
  } finally {
    loading.value = false
  }
}

const selectDocument = (doc: any) => {
  selectedDocument.value = doc
  originalEstado.value = doc.estado
  
  editForm.numero = doc.numero
  editForm.fecha = doc.fecha ? doc.fecha.substring(0, 10) : ''
  editForm.propietario = doc.propietario
  editForm.no_finca = doc.no_finca || ''
  editForm.folio = doc.folio || ''
  editForm.libro = doc.libro || ''
  editForm.observacion = doc.observacion || ''
  editForm.estado = doc.estado
  editForm.tipo_documento_id = doc.tipo_documento_id
  editForm.registro_propiedad_id = doc.registro_propiedad_id
}

const updateDocument = async () => {
  saving.value = true
  try {
    await api.put(`/documentos-edicion/${selectedDocument.value.id}`, editForm)
    Swal.fire('¡Éxito!', 'La información del documento ha sido actualizada.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al actualizar el documento'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Se eliminará el documento ${selectedDocument.value.numero} con ID ${selectedDocument.value.id}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      deleteDocument()
    }
  })
}

const deleteDocument = async () => {
  deleting.value = true
  try {
    await api.delete(`/documentos-edicion/${selectedDocument.value.id}`)
    Swal.fire('¡Eliminado!', 'El documento ha sido eliminado con éxito.', 'success')
    resetSearch()
  } catch (error: any) {
    console.error(error)
    const msg = error.response?.data?.message || 'Error al eliminar el documento'
    Swal.fire('Error', msg, 'error')
  } finally {
    deleting.value = false
  }
}

const resetSearch = () => {
  selectedDocument.value = null
  results.value = []
  searched.value = false
  searchFields.numero = ''
  searchFields.fecha = ''
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
