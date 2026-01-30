<template>
  <Transition name="slide-up">
    <div v-if="importStore.isWidgetVisible" 
         class="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300"
         :class="{ 'h-14': importStore.isWidgetMinimized }">
      
      <!-- Header -->
      <div class="h-14 px-4 flex items-center justify-between bg-gray-900 text-white cursor-pointer" 
           @click="importStore.toggleMinimize">
        <div class="flex items-center gap-3">
            <div v-if="importStore.status === 'processing' || importStore.status === 'uploading'" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <div v-else-if="importStore.status === 'completed'" class="text-green-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div v-else-if="importStore.status === 'failed'" class="text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            
            <span class="font-medium text-sm truncate">
                {{ importStore.isWidgetMinimized ? importStore.message : 'Progreso de Importación' }}
            </span>
        </div>
        
        <div class="flex items-center gap-2">
            <button class="p-1 hover:bg-gray-700 rounded transition-colors" @click.stop="importStore.toggleMinimize">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="importStore.isWidgetMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"></path>
                </svg>
            </button>
            <button class="p-1 hover:bg-gray-700 rounded transition-colors" @click.stop="importStore.closeWidget">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
      </div>

      <!-- Body -->
      <div v-if="!importStore.isWidgetMinimized" class="p-4 space-y-4">
        
        <!-- Status Message -->
        <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {{ importStore.message }}
        </p>

        <!-- Progress Bar -->
        <div v-if="importStore.status === 'processing' || importStore.status === 'uploading'" class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 relative overflow-hidden" 
                 :style="{ width: `${importStore.progress}%` }">
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div class="bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                <span class="font-bold text-lg text-gray-800 dark:text-gray-100">{{ importStore.processedCount }}</span>
                <span>Procesados</span>
            </div>
            <div class="bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                <span class="font-bold text-lg text-gray-800 dark:text-gray-100">{{ importStore.skippedCount }}</span>
                <span>Omitidos</span>
            </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useImportStore } from '@/stores/importStore'

const importStore = useImportStore()
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.animate-pulse-fast {
    animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-fast {
  0%, 100% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 0.5; transform: translateX(100%); }
}
</style>
