<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Garantías
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administración del catálogo de tipos de garantías.
        </p>
      </div>
      <div class="flex gap-2">
         <button @click="openModal()" class="px-4 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Garantía
         </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3 w-20">ID</th>
                        <th scope="col" class="px-6 py-3">Nombre</th>
                        <th scope="col" class="px-6 py-3 text-center">Desplegables</th>
                        <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && garantias.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="garantias.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                            No hay garantías registradas.
                        </td>
                    </tr>
                    <tr v-for="item in garantias" :key="item.id" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-mono text-gray-500 text-xs">
                            {{ item.id }}
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {{ item.nombre }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span v-if="item.desplegables" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <span v-else class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right flex justify-end gap-2">
                            <button @click="openModal(item)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button @click="deleteGarantia(item.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Simple Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-center">
            <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                {{ editingItem ? 'Editar Garantía' : 'Nueva Garantía' }}
            </h2>
            
            <form @submit.prevent="saveGarantia">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input 
                        v-model="form.nombre" 
                        type="text" 
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                
                 <div class="mb-6 flex items-center">
                    <input 
                        id="desplegables-check"
                        v-model="form.desplegables" 
                        type="checkbox" 
                        class="h-4 w-4 text-verde-cope focus:ring-verde-cope border-gray-300 rounded"
                    />
                    <label for="desplegables-check" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Tiene Desplegables <span class="text-xs text-gray-500">(Codeudores y Observaciones)</span>
                    </label>
                </div>
                
                <div class="flex justify-end gap-2">
                    <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 text-white bg-verde-cope rounded-lg hover:bg-green-700">
                        Guardar
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

interface Garantia {
    id: number
    nombre: string
    desplegables: boolean
}

const garantias = ref<Garantia[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)

const showModal = ref(false)
const editingItem = ref<Garantia | null>(null)
const form = reactive({ nombre: '', desplegables: true })

const fetchGarantias = async (url: string | null = null) => {
    loading.value = true
    try {
         // Si trae URL completa (paginación), la usamos tal cual (axios local la interceptará igual si es del mismo dominio)
         // PERO: nuestra instancia 'api' tiene baseURL. Si pagination devuelve Full URL, axios puede duplicar si no tenemos cuidado.
         // La paginación de Laravel devuelve http://localhost...
         // Lo mejor es pasar la URL relativa si es posible, o usar la instancia.
         // Para simplificar: Si es URL completa, extraemos la parte relativa o usamos axios(url) con headers manuales?
         // Mejor: usamos api.get(url) si 'url' es absoluta, axios maneja baseURL inteligentemente (lo ignora si url es absoluta).
         
         const endpoint = url || '/garantias'
         const response = await api.get(endpoint)
         if (response.data.success) {
            if (!url) {
                garantias.value = response.data.data.data
            } else {
                garantias.value = [...garantias.value, ...response.data.data.data]
            }
            nextPageUrl.value = response.data.data.next_page_url
         }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchGarantias(nextPageUrl.value)
}

const openModal = (item: Garantia | null = null) => {
    editingItem.value = item
    form.nombre = item ? item.nombre : ''
    form.desplegables = item ? Boolean(item.desplegables) : true
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingItem.value = null
    form.nombre = ''
    form.desplegables = true
}

const saveGarantia = async () => {
    try {
        if (editingItem.value) {
            await api.put(`/garantias/${editingItem.value.id}`, form)
            Swal.fire('Actualizado', 'Garantía actualizada correctamente', 'success')
        } else {
            await api.post('/garantias', form)
            Swal.fire('Guardado', 'Garantía creada correctamente', 'success')
        }
        closeModal()
        fetchGarantias() // Refresh list
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo guardar la garantía', 'error')
    }
}

const deleteGarantia = async (id: number) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    })

    if (result.isConfirmed) {
        try {
            await api.delete(`/garantias/${id}`)
            Swal.fire('Eliminado', 'La garantía ha sido eliminada.', 'success')
            fetchGarantias()
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar', 'error')
        }
    }
}

onMounted(() => {
    fetchGarantias()
})
</script>
