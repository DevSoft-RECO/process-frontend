<template>
  <Transition name="slide-up">
    <div v-if="isVisible" 
         class="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300"
         :class="{ 'h-14': isMinimized }">
      
      <!-- Header -->
      <div class="h-14 px-4 flex items-center justify-between bg-gray-900 text-white cursor-pointer" 
           @click="toggleMinimize">
        <div class="flex items-center gap-3">
             <div v-if="status === 'processing' || status === 'uploading'" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
             <div v-else-if="status === 'completed'" class="text-green-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <div v-else-if="status === 'failed'" class="text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </div>
            
            <span class="font-medium text-sm truncate">
                {{ isMinimized ? message : 'Progreso de Importación' }}
            </span>
        </div>
        
        <div class="flex items-center gap-2">
            <button class="p-1 hover:bg-gray-700 rounded transition-colors" @click.stop="toggleMinimize">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"></path>
                </svg>
            </button>
            <button class="p-1 hover:bg-gray-700 rounded transition-colors" @click.stop="closeWidget">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
      </div>

      <!-- Body -->
      <div v-if="!isMinimized" class="p-4 space-y-4">
        
        <!-- Status Message -->
        <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {{ message }}
        </p>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 relative overflow-hidden" 
                 :style="{ width: `${progress}%` }">
            </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useImportStore } from '@/stores/importStore'
import { useImportNuevosStore } from '@/stores/importNuevosStore'
import { computed } from 'vue'

const importStore = useImportStore()
const importNuevosStore = useImportNuevosStore()

// Determine which store is active
const activeStore = computed(() => {
    if (importNuevosStore.isWidgetVisible) return importNuevosStore
    return importStore
})

const isVisible = computed(() => (activeStore.value as any).isWidgetVisible)
const isMinimized = computed(() => (activeStore.value as any).isWidgetMinimized)
const progress = computed(() => (activeStore.value as any).progress)
// Handle property name differences safely
const message = computed(() => (activeStore.value as any).statusMessage || (activeStore.value as any).message || '')
const status = computed(() => (activeStore.value as any).status)

// Actions
const toggleMinimize = () => activeStore.value.toggleMinimize()
const closeWidget = () => activeStore.value.closeWidget()
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
