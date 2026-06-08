<template>
  <div class="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
    <div class="flex items-center space-x-3">
      <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
        <i class="fas fa-search text-lg"></i>
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">Buscar Garantía</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Ingrese el número de producto o cuenta BW si el expediente es antiguo</p>
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          type="text" 
          placeholder="Ej. 12345678" 
          class="w-full pl-4 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-550 font-medium text-gray-700 dark:text-gray-200 shadow-inner"
        >
      </div>
      <button 
        @click="$emit('search')" 
        :disabled="loading"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center space-x-2 min-w-[120px]"
      >
        <span v-if="loading" class="flex items-center space-x-2">
          <i class="fas fa-circle-notch animate-spin text-sm"></i>
          <span>Buscando</span>
        </span>
        <span v-else class="flex items-center space-x-2">
          <i class="fas fa-search text-sm"></i>
          <span>Buscar</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'search']);
</script>
