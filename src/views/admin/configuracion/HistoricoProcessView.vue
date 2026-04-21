<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Historico Process"
          subtitle="Administración manual de expedientes históricos."
          labelIndicator="Configuración"
          indicator-color="bg-verde-cope"
          />
      </div>
      <div class="flex gap-2">
         <button @click="openModal()" class="px-4 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Registro
         </button>
      </div>
    </div>

    <!-- Filters and Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Search bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="relative max-w-md">
                <input 
                    v-model="searchQuery" 
                    @keyup.enter="handleSearch"
                    type="text" 
                    placeholder="Buscar por código, documento o asociado..." 
                    class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope focus:border-transparent outline-none transition-all"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-4 py-3">Código</th>
                        <th scope="col" class="px-4 py-3">Asociado</th>
                        <th scope="col" class="px-4 py-3">Agencia</th>
                        <th scope="col" class="px-4 py-3">No. Doc</th>
                        <th scope="col" class="px-4 py-3">Monto</th>
                        <th scope="col" class="px-4 py-3">Localización</th>
                        <th scope="col" class="px-4 py-3 text-center">Estado</th>
                        <th scope="col" class="px-4 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && items.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="items.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                            No se encontraron registros.
                        </td>
                    </tr>
                    <tr v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">
                            {{ item.codigo_cliente }}
                        </td>
                        <td class="px-4 py-3">
                            {{ item.asociado }}
                        </td>
                        <td class="px-4 py-3">
                            {{ item.agencia }}
                        </td>
                        <td class="px-4 py-3 font-mono text-xs">
                            {{ item.numero_documento }}
                        </td>
                        <td class="px-4 py-3 font-mono">
                            {{ formatCurrency(item.monto) }}
                        </td>
                        <td class="px-4 py-3">
                            <span :class="[
                                'px-2 py-1 rounded text-[10px] font-bold uppercase',
                                getLocationClass(item.localizacion)
                            ]">
                                {{ item.localizacion || 'No Definido' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <span :class="[
                                'px-2 py-1 rounded text-[10px] font-bold uppercase',
                                getStatusClass(item.estado)
                            ]">
                                {{ item.estado || 'No Definido' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-right flex justify-end gap-2">
                            <button @click="openModal(item)" class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button @click="deleteItem(item.id)" class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-center border-t border-gray-200 dark:border-gray-600">
            <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold hover:underline">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ editingItem ? 'Editar Expediente Histórico' : 'Nuevo Expediente Histórico' }}
                </h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <form @submit.prevent="saveItem" class="p-6">
                <!-- Three column grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <h3 class="text-xs font-black text-verde-cope uppercase tracking-widest border-b border-verde-cope/20 pb-1 mb-3">Información Básica</h3>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Código Cliente</label>
                            <input v-model="form.codigo_cliente" type="number" step="1" required class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">CIF</label>
                            <input v-model="form.cif" type="text" class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Asociado (Nombre Completo)</label>
                            <input v-model="form.asociado" type="text" class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Agencia</label>
                            <input v-model="form.agencia" type="text" class="form-input-yk" />
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Monto</label>
                            <input v-model="form.monto" type="number" step="0.01" class="form-input-yk" />
                        </div>
                    </div>

                    <!-- Process Info -->
                    <div class="space-y-4">
                        <h3 class="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-blue-600/20 pb-1 mb-3">Detalle del Proceso</h3>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">No. Documento (Crédito/Garantía)</label>
                            <input v-model="form.numero_documento" type="text" class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">CTA BW</label>
                            <input v-model="form.cta_bw" type="text" class="form-input-yk" />
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Inicio</label>
                            <input v-model="form.fecha_inicio" type="date" class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contrato</label>
                            <input v-model="form.contrato" type="text" class="form-input-yk" />
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo Garantía</label>
                            <input v-model="form.tipo_garantia" type="text" class="form-input-yk" />
                        </div>
                    </div>

                    <!-- Advanced / Status -->
                    <div class="space-y-4">
                        <h3 class="text-xs font-black text-orange-600 uppercase tracking-widest border-b border-orange-600/20 pb-1 mb-3">Control y Seguimiento</h3>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Localización</label>
                            <select v-model="form.localizacion" class="form-input-yk">
                                <option value="">Seleccione...</option>
                                <option v-for="opt in locOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                            <select v-model="form.estado" class="form-input-yk">
                                <option value="">Seleccione...</option>
                                <option v-for="opt in estadoOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Ingreso</label>
                            <input v-model="form.ingreso" type="text" class="form-input-yk" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Inventario</label>
                            <input v-model="form.inventario" type="text" class="form-input-yk" />
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Salida</label>
                            <input v-model="form.salida" type="text" class="form-input-yk" />
                        </div>
                    </div>
                </div>

                <!-- Textareas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Datos Garantía</label>
                        <textarea v-model="form.datos_garantia" rows="3" class="form-input-yk text-xs"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Inscripción Otros Contratos</label>
                        <textarea v-model="form.inscripcion_otros_contratos" rows="3" class="form-input-yk text-xs"></textarea>
                    </div>
                </div>
                
                <div class="mb-8">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Observación General</label>
                    <textarea v-model="form.observacion" rows="3" class="form-input-yk text-xs"></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" @click="closeModal" class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="saving" class="px-8 py-2.5 text-sm font-bold text-white bg-azul-cope rounded-xl hover:bg-blue-900 shadow-lg shadow-blue-900/20 disabled:opacity-50 transition flex items-center gap-2">
                        <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full font-mono"></span>
                        {{ saving ? 'Guardando...' : 'Guardar Registro' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import Encabezado from '@/components/common/encabezado.vue'
import { formatCurrency } from '@/utils/formatters'

interface Expediente {
    id: number
    codigo_cliente: number
    agencia: string
    fecha_inicio: string
    cta_bw: string
    numero_documento: string
    cif: string
    asociado: string
    monto: number
    tipo_garantia: string
    datos_garantia: string
    contrato: string
    inscripcion_otros_contratos: string
    ingreso: string
    inventario: string
    salida: string
    observacion: string
    estado: string
    localizacion: string
}

// Data
const items = ref<Expediente[]>([])
const loading = ref(false)
const saving = ref(false)
const nextPageUrl = ref<string | null>(null)
const searchQuery = ref('')
const showModal = ref(false)
const editingItem = ref<Expediente | null>(null)

// Static Options
const locOptions = ['EN ARCHIVO', 'RETIRADO', 'FALTANTE']
const estadoOptions = ['COMPLETO SADEC', 'INCOMPLETO', 'FALTANTE']

// Typed initial form for resetting
const getInitialForm = () => ({
    codigo_cliente: null as number | null,
    agencia: '',
    fecha_inicio: null as string | null,
    cta_bw: '',
    numero_documento: '',
    cif: '',
    asociado: '',
    monto: null as number | null,
    tipo_garantia: '',
    datos_garantia: '',
    contrato: '',
    inscripcion_otros_contratos: '',
    ingreso: '',
    inventario: '',
    salida: '',
    observacion: '',
    estado: '',
    localizacion: ''
})

// Form
const form = reactive(getInitialForm())

// Methods
const fetchItems = async (url: string | null = null) => {
    loading.value = true
    try {
        const response = await api.get(url || '/expedientes')
        if (response.data.success) {
            if (!url) {
                items.value = response.data.data.data
            } else {
                items.value = [...items.value, ...response.data.data.data]
            }
            nextPageUrl.value = response.data.data.next_page_url
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error')
    } finally {
        loading.value = false
    }
}

const handleSearch = async () => {
    if (!searchQuery.value) {
        fetchItems()
        return
    }
    
    loading.value = true
    try {
        const response = await api.post('/expedientes/search-by-codigo', {
            contrato: searchQuery.value
        })
        if (response.data.success) {
            // Search returns an array according to api.php handler
            items.value = response.data.data
            nextPageUrl.value = null
        }
    } catch (error) {
        items.value = []
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchItems(nextPageUrl.value)
}

const openModal = (item: Expediente | null = null) => {
    editingItem.value = item
    if (item) {
        Object.assign(form, item)
        // Format date for the input
        if (item.fecha_inicio) {
            form.fecha_inicio = new Date(item.fecha_inicio).toISOString().split('T')[0] ?? null
        }
    } else {
        Object.assign(form, getInitialForm())
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingItem.value = null
}

const saveItem = async () => {
    saving.value = true
    try {
        if (editingItem.value) {
            await api.put(`/expedientes/${editingItem.value.id}`, form)
            Swal.fire('¡Éxito!', 'Registro actualizado correctamente', 'success')
        } else {
            await api.post('/expedientes', form)
            Swal.fire('¡Éxito!', 'Registro creado correctamente', 'success')
        }
        closeModal()
        fetchItems()
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo guardar el registro. Verifique los datos.', 'error')
    } finally {
        saving.value = false
    }
}

const deleteItem = async (id: number) => {
    const result = await Swal.fire({
        title: '¿Está seguro de eliminar?',
        text: "Esta acción no se puede deshacer y el registro desaparecerá del histórico.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003366',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await api.delete(`/expedientes/${id}`)
            Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success')
            fetchItems()
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        }
    }
}

// Helpers
const getLocationClass = (loc: string) => {
    if (loc === 'EN ARCHIVO') return 'bg-green-100 text-green-800'
    if (loc === 'RETIRADO') return 'bg-orange-100 text-orange-800'
    if (loc === 'FALTANTE') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
    if (status === 'COMPLETO SADEC') return 'bg-blue-100 text-blue-800'
    if (status === 'INCOMPLETO') return 'bg-yellow-100 text-yellow-800'
    if (status === 'FALTANTE') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
}

onMounted(() => {
    fetchItems()
})
</script>

<style scoped>
@reference "../../../assets/main.css";

.form-input-yk {
    @apply w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-verde-cope transition-all py-2 px-3 text-sm;
}
</style>
