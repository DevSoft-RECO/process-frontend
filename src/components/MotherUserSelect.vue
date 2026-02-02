<template>
  <div class="relative w-full">
    <div class="relative">
        <input 
          type="text" 
          v-model="query" 
          @input="onInput"
          placeholder="Buscar persona..." 
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-cope focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :class="{'opacity-50': loading}"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <svg v-else class="animate-spin h-5 w-5 text-verde-cope" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    </div>

    <!-- Dropdown Results -->
    <ul v-if="options.length > 0 && showOptions" class="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
        <li 
            v-for="user in options" 
            :key="user.id" 
            @click="selectUser(user)"
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
        >
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                {{ getInitials(user.name) }}
            </div>
            <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                <p v-if="user.puesto" class="text-xs text-blue-500">{{ user.puesto.nombre }}</p>
            </div>
        </li>
    </ul>
    
    <div v-if="noResults" class="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 p-4 text-center text-sm text-gray-500">
        No se encontraron resultados
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MotherService from '@/services/MotherService';

const props = defineProps(['modelValue']); 
const emit = defineEmits(['update:modelValue', 'user-selected']);

const query = ref('');
const options = ref<any[]>([]);
const loading = ref(false);
const showOptions = ref(false);
const noResults = ref(false);
let debounceTimer: any = null;

const onInput = () => {
    clearTimeout(debounceTimer);
    if (query.value.length < 3) {
        options.value = [];
        showOptions.value = false;
        noResults.value = false;
        return;
    }

    debounceTimer = setTimeout(() => {
        search();
    }, 400); // Debounce de 400ms
};

const search = async () => {
    loading.value = true;
    noResults.value = false;
    try {
        const response = await MotherService.searchUsers(query.value);
        options.value = response.data;
        showOptions.value = true;
        if (options.value.length === 0) noResults.value = true;
    } catch (error) {
        console.error('Error buscando usuarios:', error);
        options.value = [];
    } finally {
        loading.value = false;
    }
};

const selectUser = (user: any) => {
    query.value = user.name;
    showOptions.value = false;
    options.value = [];
    
    // El núcleo de la lógica JIT:
    emit('update:modelValue', user.id);
    emit('user-selected', user); 
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2);
};
</script>
