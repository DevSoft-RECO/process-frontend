<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tipos de Documentos
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administración del catálogo de tipos de documentos.
        </p>
      </div>
      <div class="flex gap-2">
         <button @click="openModal()" class="px-4 py-2 bg-azul-cope text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Tipo
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
                        <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && items.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="items.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                            No hay registros.
                        </td>
                    </tr>
                    <tr v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-mono text-gray-500 text-xs">
                            {{ item.id }}
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {{ item.nombre }}
                        </td>
                        <td class="px-6 py-4 text-right flex justify-end gap-2">
                            <button @click="openModal(item)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
                {{ editingItem ? 'Editar Tipo Documento' : 'Nuevo Tipo Documento' }}
            </h2>
            
            <form @submit.prevent="saveItem">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input 
                        v-model="form.nombre" 
                        type="text" 
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
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

interface TipoDocumento {
    id: number
    nombre: string
}

const items = ref<TipoDocumento[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)

const showModal = ref(false)
const editingItem = ref<TipoDocumento | null>(null)
const form = reactive({ nombre: '' })

const fetchItems = async (url: string | null = null) => {
    loading.value = true
    try {
         const endpoint = url || '/tipo-documentos'
         const response = await api.get(endpoint)
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
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchItems(nextPageUrl.value)
}

const openModal = (item: TipoDocumento | null = null) => {
    editingItem.value = item
    form.nombre = item ? item.nombre : ''
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingItem.value = null
    form.nombre = ''
}

const saveItem = async () => {
    try {
        if (editingItem.value) {
            await api.put(`/tipo-documentos/${editingItem.value.id}`, form)
            Swal.fire('Actualizado', 'Registro actualizado correctamente', 'success')
        } else {
            await api.post('/tipo-documentos', form)
            Swal.fire('Guardado', 'Registro creado correctamente', 'success')
        }
        closeModal()
        fetchItems() 
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo guardar', 'error')
    }
}

const deleteItem = async (id: number) => {
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
            await api.delete(`/tipo-documentos/${id}`)
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
            fetchItems()
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar', 'error')
        }
    }
}

onMounted(() => {
    fetchItems()
})
</script>
