<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <Encabezado
          title="Bufetes"
          subtitle="Administración del catálogo de bufetes."
          labelIndicator="Ajustes Generales"
          indicator-color="bg-informatica"
          />

      <button 
        @click="openModal" 
        class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
           <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nueva Asignación
      </button>
    </div>

    <!-- Main Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agencia</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="loading" class="animate-pulse">
                    <td colspan="4" class="px-6 py-4 text-center">Cargando...</td>
                </tr>
                <tr v-if="!loading && bufetes.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">No hay asignaciones.</td>
                </tr>
                <tr v-for="item in bufetes" :key="item.id">
                    <td class="px-6 py-4">
                        <div class="font-medium dark:text-white">{{ item.user?.name }}</div>
                        <div class="text-xs text-gray-500">{{ item.user?.email }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {{ item.agencia?.nombre }} ({{ item.agencia?.codigo }})
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ item.descripcion }}</td>
                    <td class="px-6 py-4 text-right">
                        <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal Form (Simplified Layout) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
            
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nueva Asignación</h3>
            </div>
            
            <!-- Modal Body (Scrollable) -->
            <div class="p-6 overflow-y-auto">
                <!-- Step 1: Search User -->
                <div class="mb-6 border-b pb-6 dark:border-gray-700">
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">1. Buscar Usuario (App Madre)</label>
                    
                    <div class="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            v-model="searchText" 
                            @keyup.enter="performSearch"
                            placeholder="Ej: Pedro" 
                            class="flex-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                        <button @click="performSearch" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Buscar
                        </button>
                    </div>

                    <!-- Results -->
                    <div v-if="searchResults.length > 0" class="border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                        <div 
                            v-for="u in searchResults" :key="u.id" 
                            @click="selectUser(u)"
                            class="p-3 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer border-b last:border-0 dark:border-gray-700 flex justify-between items-center"
                        >
                            <div>
                                <div class="font-bold text-gray-800 dark:text-white">{{ u.name }}</div>
                                <div class="text-xs text-gray-500">{{ u.email }}</div>
                            </div>
                            <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">Elegir</span>
                        </div>
                    </div>
                    <div v-else-if="searchPerformed" class="text-sm text-red-500">
                        No se encontraron usuarios.
                    </div>

                    <!-- Selected User -->
                    <div v-if="form.user_id" class="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                {{ form._user_data?.name?.charAt(0) }}
                            </div>
                            <div>
                                <div class="font-bold text-gray-900 dark:text-white">{{ form._user_data?.name }}</div>
                                <div class="text-xs text-gray-600 dark:text-gray-400">{{ form._user_data?.email }}</div>
                            </div>
                        </div>
                        <button @click="clearSelection" class="text-xs text-red-500 hover:underline font-medium">Cambiar</button>
                    </div>
                </div>

                <!-- Step 2 & 3 -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">2. Agencia</label>
                        <select v-model="form.agencia_id" class="w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white shadow-sm">
                            <option :value="null" disabled>-- Selecciona una Agencia --</option>
                            <option v-for="ag in agenciasList" :key="ag.id" :value="ag.id">
                                {{ ag.nombre }} ({{ ag.codigo }})
                            </option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">3. Descripción</label>
                        <textarea v-model="form.descripcion" rows="2" class="w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white shadow-sm"></textarea>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between items-center gap-4 rounded-b-lg">
                <div class="text-xs font-mono text-gray-500">
                     Req: {{ form.user_id ? '✅ User' : '❌ User' }} | {{ form.agencia_id ? '✅ Agencia' : '❌ Agencia' }}
                </div>
                <div class="flex gap-3 w-full sm:w-auto">
                    <button @click="closeModal" class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Cancelar
                    </button>
                    <button 
                        @click="save" 
                        :disabled="processing || !form.user_id || !form.agencia_id"
                        class="flex-1 sm:flex-none px-4 py-2 bg-verde-cope text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                    >
                        {{ processing ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import MotherService from '@/services/MotherService';
import Swal from 'sweetalert2';
import Encabezado from '../../components/common/encabezado.vue'

const bufetes = ref<any[]>([]);
const agenciasList = ref<any[]>([]);
const loading = ref(false);
const showModal = ref(false);
const processing = ref(false);

// Search State
const searchText = ref('');
const searchResults = ref<any[]>([]);
const searchPerformed = ref(false);

const form = ref({
    user_id: null,
    agencia_id: null,
    descripcion: '',
    _user_data: null as any
});

const fetchData = async () => {
    loading.value = true;
    try {
        const [resB, resA] = await Promise.all([
            api.get('/bufetes'),
            api.get('/agencias')
        ]);
        bufetes.value = resB.data;
        agenciasList.value = resA.data;
    } catch(e) { console.error(e); }
    finally { loading.value = false; }
};

const openModal = () => {
    form.value = { user_id: null, agencia_id: null, descripcion: '', _user_data: null };
    searchText.value = '';
    searchResults.value = [];
    searchPerformed.value = false;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// Search Logic Direct
const performSearch = async () => {
    if(searchText.value.length < 3) {
        Swal.fire('Atención', 'Escribe al menos 3 letras', 'warning');
        return;
    }
    
    try {
        const { data } = await MotherService.searchUsers(searchText.value);
        searchResults.value = data;
        searchPerformed.value = true;
    } catch(error) {
        console.error("Search Error", error);
        Swal.fire('Error', 'Error buscando usuarios', 'error');
    }
};

const selectUser = (u: any) => {
    form.value.user_id = u.id;
    form.value._user_data = u;
    // Clear search to clean up UI
    searchResults.value = []; 
    searchText.value = '';
};

const clearSelection = () => {
    form.value.user_id = null;
    form.value._user_data = null;
};

const save = async () => {
    if(!form.value.user_id || !form.value.agencia_id) return;

    processing.value = true;
    try {
        await api.post('/bufetes', form.value);
        Swal.fire('Éxito', 'Guardado correctamente', 'success');
        closeModal();
        fetchData();
    } catch(error: any) {
        console.error(error);
        const msg = error.response?.data?.message || 'Error al guardar';
        Swal.fire('Error', msg, 'error');
    } finally {
        processing.value = false;
    }
};

const deleteItem = async (id: number) => {
    // ... same as before
    const res = await Swal.fire({ title:'¿Eliminar?', icon:'warning', showCancelButton:true });
    if(res.isConfirmed) {
        await api.delete(`/bufetes/${id}`);
        fetchData();
    }
};

onMounted(fetchData);
</script>
