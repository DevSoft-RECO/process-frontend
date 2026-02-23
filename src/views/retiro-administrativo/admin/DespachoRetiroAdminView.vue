<template>
  <div class="px-6 py-8">
    <div class="mb-8 fade-in">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <svg class="w-8 h-8 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Despacho y Reingreso de Expedientes
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11">
        Bandeja de solicitudes para entrega y control de reingreso al archivo.
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center fade-in">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vista en Construcción</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Próximamente se implementará el listado de solicitudes pendientes de despacho.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
