<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tiempos Promedio de Procesamiento</h3>
        <p class="text-xs text-gray-500 mb-6">Promedio de días transcurridos entre etapas clave. para identificar cuellos de botella.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card 1: Inicio -> Secretaria -->
            <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Asesores de Crédito</span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white pl-12">
                    {{ times.creation_to_secretary }} <span class="text-xs font-normal text-gray-500">días</span>
                </div>
            </div>

            <!-- Card 2: Secretaria Interno -->
            <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-600 dark:text-purple-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Secretaría de Agecnias</span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white pl-12">
                    {{ times.secretary_internal }} <span class="text-xs font-normal text-gray-500">días</span>
                </div>
            </div>

            <!-- Card 3: Secretaria -> Abogado -->
            <div class="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-orange-100 dark:bg-orange-800 rounded-full text-orange-600 dark:text-orange-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Secretaría de Créditos</span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white pl-12">
                    {{ times.secretary_to_lawyer }} <span class="text-xs font-normal text-gray-500">días</span>
                </div>
            </div>

            <!-- Card 4: Retorno Abogado -->
            <div class="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50">
                 <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-teal-100 dark:bg-teal-800 rounded-full text-teal-600 dark:text-teal-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Abogado</span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white pl-12">
                    {{ times.lawyer_return }} <span class="text-xs font-normal text-gray-500">días</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    times: {
        creation_to_secretary: number
        secretary_internal: number
        secretary_to_lawyer: number
        lawyer_return: number
    }
}>()
</script>
