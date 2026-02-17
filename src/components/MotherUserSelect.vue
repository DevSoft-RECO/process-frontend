<script setup lang="ts">
import { ref } from 'vue';
import MotherService from '@/services/MotherService';

// Props: v-model (ID)
const props = defineProps(['modelValue']); 
const emit = defineEmits(['update:modelValue', 'user-selected']);

const searchQuery = ref('');
const options = ref<any[]>([]);
const loading = ref(false);
const showDropdown = ref(false);

const search = async () => {
    if (searchQuery.value.length < 3) {
        options.value = [];
        showDropdown.value = false;
        return;
    }
    
    loading.value = true;
    try {
        const { data } = await MotherService.searchUsers(searchQuery.value);
        options.value = data; 
        showDropdown.value = options.value.length > 0;
    } catch (e) {
        console.error("Error searching users", e);
    } finally {
        loading.value = false;
    }
};

const selectUser = (user: any) => {
    console.log('User selected:', user);
    emit('update:modelValue', user.id);
    emit('user-selected', user);
    searchQuery.value = user.name;
    showDropdown.value = false;
};

// Debounce simple
let timeout: any;
const onInput = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        search();
    }, 400);
};

// Close dropdown on outside click (simple implementation)
</script>

<template>
  <div class="relative">
      <div class="relative">
          <input 
              type="text"
              v-model="searchQuery"
              @input="onInput"
              class="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-verde-cope focus:border-verde-cope dark:bg-gray-700 dark:text-white pl-10"
              placeholder="Buscar por nombre (min 3 letras)..."
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
          </div>
      </div>

      <!-- Dropdown -->
      <ul v-if="showDropdown" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <li 
              v-for="user in options" 
              :key="user.id" 
              @mousedown.prevent="selectUser(user)"
              class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
              <div class="flex items-center">
                  <span class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase mr-3">
                      {{ user.name.substring(0,2) }}
                  </span>
                  <div>
                    <span class="font-medium block truncate">
                        {{ user.name }}
                    </span>
                    <span class="text-xs text-gray-500 block">
                        {{ user.email }}
                    </span>
                  </div>
              </div>
          </li>
      </ul>
      <p v-else-if="!loading && searchQuery.length >= 3 && options.length === 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-md p-3 text-sm text-gray-500 text-center rounded-md border border-gray-100 dark:border-gray-700">
        No se encontraron usuarios.
      </p>
  </div>
</template>
