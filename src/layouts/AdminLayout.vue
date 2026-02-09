<template>
  <div class="h-screen bg-gradient-to-br from-slate-200 to-blue-300 dark:from-slate-950 dark:to-slate-900 text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">

    <AdminSidebar />

    <div
      class="flex flex-col flex-1 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
      :class="[layoutStore.isCollapsed ? 'md:ml-28' : 'md:ml-[18rem]']"
    >

      <AdminHeader />

      <main class="flex-1 w-full min-w-0 overflow-x-auto overflow-y-auto p-6 relative custom-scrollbar">
        <RouterView v-slot="{ Component }">
            <component :is="Component" />
        </RouterView>
      </main>
    </div>

    <UploadWidget /> 
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue' // Agregamos onUnmounted
import AdminSidebar from "../components/layout/AdminSidebar.vue"
import AdminHeader from "../components/layout/AdminHeader.vue"
import UploadWidget from "../components/common/UploadWidget.vue" // Import Widget
import { useLayoutStore } from "@/stores/layout"

const layoutStore = useLayoutStore()

onMounted(() => {
  layoutStore.initTheme()

  // Agregamos el "Listener" para detectar cuando el usuario divide la pantalla
  window.addEventListener('resize', layoutStore.handleResize)
})

// Buena práctica: Limpiar el listener cuando sales del componente
onUnmounted(() => {
  window.removeEventListener('resize', layoutStore.handleResize)
})
</script>

<style>
/* SCROLLBAR OPTIMIZADO PARA TAILWIND 4
   Usamos variables CSS nativas que TW4 expone automáticamente.
*/
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-400);
}

/* Soporte Dark Mode */
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-700);
}
:root.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-600);
}
</style>
