<template>
  <div class="inline-flex flex-col gap-3">
    <div 
      class="flex items-center gap-3 border rounded-full p-1.5 pr-5 transition-all duration-300 group
             bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10"
    >
      <span 
        class="text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest transition-transform group-hover:scale-105"
        :class="[indicatorColor, indicatorShadow]"
      >
        {{ labelIndicator }}
      </span>

      <div class="flex items-center gap-2">
        <h1 class="text-lg md:text-xl font-bold text-white tracking-tight">
          {{ title }}
        </h1>
        
        <svg 
          class="size-3 text-blue-300 group-hover:translate-x-1 transition-transform duration-300" 
          viewBox="0 0 6 9" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m1 1 4 3.5L1 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <p 
      v-if="subtitle" 
      class="text-sm text-blue-200/60 dark:text-gray-400 ml-4 flex items-center gap-2 tracking-wide font-medium"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-verde-cope animate-pulse"></span>
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Propiedades dinámicas para reutilizar en todo el sistema
 */
withDefaults(defineProps<{
  title: string
  subtitle?: string
  labelIndicator?: string // Ejemplo: 'NUEVO', 'LIVE', 'INFO'
  indicatorColor?: string
  indicatorShadow?: string
}>(), {
  labelIndicator: '',
  indicatorColor: 'bg-naranja-cope',
  indicatorShadow: 'shadow-[0_0_15px_rgba(50,148,77,0.4)]'
})
</script>