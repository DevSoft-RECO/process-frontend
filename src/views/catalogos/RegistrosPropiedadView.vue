<template>
 <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Encabezado
          title="Registros de Propiedad"
          subtitle="Administración del catálogo de registros de propiedad."
          labelIndicator="Ajustes Generales"
          indicator-color="bg-informatica"
          />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="mb-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">Listado</h2>
        <button @click="openModal" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Registro
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading" class="animate-pulse">
                <td colspan="3" class="px-6 py-4 text-center text-gray-400">Cargando...</td>
            </tr>
            <tr v-if="!loading && items.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay registros creados.</td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ item.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editItem(item)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">Editar</button>
                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Simplificado -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col">
            <div class="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Editar Registro' : 'Nuevo Registro' }}</h3>
            </div>
            
            <div class="p-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Registro</label>
                <input 
                    v-model="form.nombre" 
                    type="text" 
                    class="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Ej. Segundo Registro de la Propiedad"
                    @keyup.enter="save"
                    ref="nameInput"
                >
            </div>

            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end gap-3 rounded-b-lg">
                <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancelar</button>
                <button 
                    @click="save" 
                    :disabled="processing || !form.nombre"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {{ processing ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import Encabezado from '../../components/common/encabezado.vue'

const items = ref<any[]>([]);
const loading = ref(false);
const showModal = ref(false);
const processing = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);

const form = ref({
  nombre: ''
});

const fetchItems = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/registros-propiedad');
    items.value = data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { nombre: '' };
  showModal.value = true;
  nextTick(() => nameInput.value?.focus());
};

const editItem = (item: any) => {
  isEditing.value = true;
  editingId.value = item.id;
  form.value = { nombre: item.nombre };
  showModal.value = true;
  nextTick(() => nameInput.value?.focus());
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  if (!form.value.nombre) return;
  processing.value = true;
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/registros-propiedad/${editingId.value}`, form.value);
    } else {
      await api.post('/registros-propiedad', form.value);
    }
    closeModal();
    fetchItems();
    Swal.fire('Éxito', 'Guardado correctamente', 'success');
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo guardar', 'error');
  } finally {
    processing.value = false;
  }
};

const deleteItem = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esto",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/registros-propiedad/${id}`);
      fetchItems();
      Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar', 'error');
    }
  }
};

onMounted(() => {
  fetchItems();
});
</script>
