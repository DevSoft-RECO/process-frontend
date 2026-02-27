<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8 h-auto max-h-[90vh] flex flex-col">
            <!-- Header with Close Button -->
            <div class="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Adjuntar Garantias
                </h2>
                <button @click="close" class="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Tabs Header -->
            <div class="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
                <button 
                    @click="activeTab = 'garantia'"
                    class="flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="activeTab === 'garantia' ? 'border-verde-cope text-verde-cope' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
                >
                    <div class="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                       Tipos de Garantías
                    </div>
                </button>
                <button 
                    @click="activeTab = 'documento'"
                    class="flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="activeTab === 'documento' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
                >
                    <div class="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Garantías
                    </div>
                </button>
            </div>

            <!-- Content Area -->
            <div class="overflow-y-auto flex-1 p-1">
                <div v-if="activeTab === 'garantia'">
                    <GarantiaPanel 
                        :expediente="expediente"
                        @close="close"
                        @saved="$emit('saved')"
                    />
                </div>
                <div v-if="activeTab === 'documento'">
                    <DocumentoPanel 
                        :expediente="expediente"
                        @close="close"
                        @saved="$emit('saved')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GarantiaPanel from './GarantiaPanel.vue'
import DocumentoPanel from './DocumentoPanel.vue'

const props = defineProps<{
    show: boolean
    expediente: any
    initialTab?: 'garantia' | 'documento'
}>()

const emit = defineEmits(['close', 'saved'])

const activeTab = ref<'garantia' | 'documento'>('garantia')

watch(() => props.show, (newVal) => {
    if (newVal) {
        if (props.initialTab) {
            activeTab.value = props.initialTab
        } else {
             // Default to garantia or keep last? Let's default to garantia each time opened if not specified
             activeTab.value = 'garantia'
        }
    }
})

const close = () => {
    emit('close')
}
</script>
