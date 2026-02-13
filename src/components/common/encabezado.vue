<template>
  <div>
    <div class="flex items-center gap-3">
      <div 
        class="w-1.5 h-8 rounded-full transition-all duration-300"
        :class="[indicatorColor, indicatorShadow]"
      ></div>
      <h1 class="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
        {{ title }}
      </h1>
    </div>
    
    <p v-if="subtitle" class="text-sm text-blue-200/70 dark:text-gray-400 mt-2 ml-4 flex items-center gap-2">
      <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  indicatorColor?: string
  indicatorShadow?: string
}>(), {
  indicatorColor: 'bg-verde-cope',
  indicatorShadow: 'shadow-[0_0_10px_rgba(50,148,77,0.5)]'
})
</script>
