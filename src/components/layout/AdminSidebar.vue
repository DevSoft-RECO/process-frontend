<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="layoutStore.isSidebarOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
      @click="layoutStore.closeSidebar"
    ></div>
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 shadow-2xl
           h-full md:h-[calc(100vh-2rem)]
           md:m-4 md:rounded-2xl
           bg-azul-cope/95 dark:bg-gray-900/90 backdrop-blur-xl
           border border-white/10 dark:border-gray-700/50"
    :class="[
      layoutStore.isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      layoutStore.isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <div class="h-16 flex items-center justify-between px-6 shrink-0 bg-black/10 dark:bg-black/20 border-b border-white/5 dark:border-gray-800">

      <div v-if="!layoutStore.isCollapsed" class="flex items-center justify-center w-full fade-in">
        <img src="@/assets/logoyk1.svg" alt="YK" class="h-14 w-auto object-contain transition-all" />
      </div>

      <div v-else class="w-full flex justify-center fade-in">
        <img src="@/assets/yk.png" alt="YK" class="h-8 w-8 object-contain" />
      </div>

    </div>

    <nav
      class="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar"
      :class="{ 'scrollbar-hide': layoutStore.isCollapsed }"
    >
      <template v-for="item in menuItems" :key="item.id || item.label">
        
        <!-- DIVIDER ITEM -->
        <div v-if="item.isDivider" class="px-3 py-2 mt-4">
           <div v-show="!layoutStore.isCollapsed" class="text-[9px] font-black text-verde-cope uppercase tracking-widest mb-1 shadow-sm">
               {{ item.label }}
           </div>
           <div v-show="layoutStore.isCollapsed" class="h-px bg-white/10 dark:bg-gray-800 my-2"></div>
        </div>

        <!-- SINGLE LINK ITEM -->
        <div v-else-if="!item.children" 
             class="relative group"
             @mouseenter="handleMouseEnter(item, $event)"
             @mouseleave="handleMouseLeave"
        >
            <RouterLink
            :to="item.route || ''"
            @click="handleItemClick"
            class="flex items-center px-3 py-3 rounded-lg transition-all duration-200 group border-l-4"
            :class="[
                isActive(item.route || '')
                ? 'bg-white/10 dark:bg-gray-800 border-verde-cope text-white dark:text-verde-cope shadow-lg'
                : 'border-transparent text-gray-300 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-gray-800 hover:text-white dark:hover:text-gray-100',
                layoutStore.isCollapsed ? 'justify-center pl-0 border-l-0' : ''
            ]"
            >
                <span class="shrink-0 transition-colors duration-200"
                      :class="isActive(item.route || '') ? 'text-verde-cope' : 'group-hover:text-verde-cope'">
                    <svg v-html="item.iconSvg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
                </span>

                <span v-if="!layoutStore.isCollapsed" class="ml-3 font-medium text-sm truncate">
                    {{ item.label }}
                </span>
            </RouterLink>
        </div>

        <!-- GROUP ROUTE ITEM -->
        <div v-else 
             class="relative group"
             @mouseenter="handleMouseEnter(item, $event)"
             @mouseleave="handleMouseLeave"
        >
            <button
                @click="handleGroupClick(item.id || '')"
                class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group border-l-4 border-transparent"
                :class="[
                    openGroups.includes(item.id || '') && !layoutStore.isCollapsed
                    ? 'bg-black/20 dark:bg-black/40 text-white dark:text-gray-100'
                    : 'text-gray-300 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-gray-800 hover:text-white',
                    layoutStore.isCollapsed ? 'justify-center pl-0' : 'justify-between'
                ]"
            >
                <div class="flex items-center">
                    <span class="shrink-0 transition-colors" :class="openGroups.includes(item.id || '') ? 'text-verde-cope' : 'group-hover:text-verde-cope'">
                        <svg v-html="item.iconSvg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
                    </span>
                    <span v-if="!layoutStore.isCollapsed" class="ml-3 font-medium text-sm truncate">{{ item.label }}</span>
                </div>

                <svg
                    v-if="!layoutStore.isCollapsed"
                    class="w-4 h-4 transition-transform duration-300"
                    :class="openGroups.includes(item.id || '') ? 'text-verde-cope rotate-180' : 'text-gray-400'"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <!-- ACORDEÓN EXPANDIDO (SOLO CUANDO ESTÁ ABIERTO) -->
            <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
            >
                <div
                    v-if="openGroups.includes(item.id || '') && !layoutStore.isCollapsed"
                    class="mt-2 ml-3 space-y-1 relative"
                >
                    <RouterLink
                        v-for="child in item.children"
                        :key="child.route"
                        :to="child.route"
                        @click="handleItemClick"
                        class="relative group/child flex items-center gap-3 px-3 py-2 rounded-r-lg rounded-bl-lg ml-2 text-sm transition-all duration-200"
                        :class="isActive(child.route)
                            ? 'bg-verde-cope/10 text-verde-cope font-bold translate-x-1'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'"
                    >
                         <span
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300 ring-2"
                            :class="isActive(child.route)
                                ? 'bg-verde-cope ring-verde-cope/30 scale-110'
                                : 'bg-gray-600 ring-transparent group-hover/child:bg-gray-300'"
                         ></span>

                         {{ child.label }}
                    </RouterLink>
                </div>
            </transition>
        </div>
      </template>

      <!-- TELEPORT OVERLAY -->
      <Teleport to="body">
          <transition 
            enter-active-class="transition ease-out duration-200" 
            enter-from-class="opacity-0 translate-x-2" 
            enter-to-class="opacity-100 translate-x-0" 
            leave-active-class="transition ease-in duration-150" 
            leave-from-class="opacity-100 translate-x-0" 
            leave-to-class="opacity-0 translate-x-2"
          >
            <div
                v-if="hoveredItem && layoutStore.isCollapsed"
                :style="popoverStyle"
                class="fixed z-[9999] ml-2"
                @mouseenter="handlePopoverEnter"
                @mouseleave="handleMouseLeave"
            >
                 <!-- Simple Label -->
                 <div v-if="!hoveredItem.children" 
                      class="px-3 py-2 bg-verde-cope text-white text-sm font-bold rounded-md shadow-xl whitespace-nowrap relative"
                 >
                    {{ hoveredItem.label }}
                     <div 
                        class="absolute -left-1 w-2 h-2 bg-verde-cope transform rotate-45"
                        :class="isBottomAligned ? 'bottom-3' : 'top-3'"
                    ></div>
                 </div>

                 <!-- Expanded Menu -->
                 <div v-else
                      class="w-64 bg-azul-cope dark:bg-gray-800 border-l-4 border-verde-cope rounded-xl shadow-2xl relative"
                 >
                      <div class="px-3 py-2 text-xs font-semibold text-verde-cope uppercase tracking-wider border-b border-white/10 dark:border-gray-700 mb-1">
                        {{ hoveredItem.label }}
                      </div>
                      
                      <RouterLink
                          v-for="child in hoveredItem.children"
                          :key="child.route"
                          :to="child.route"
                          class="block px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                          active-class="bg-white/10 text-white font-medium shadow-sm"
                      >
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            {{ child.label }}
                      </RouterLink>

                      <div 
                        class="absolute -left-2 w-4 h-4 bg-azul-cope dark:bg-gray-800 border-l border-b border-verde-cope transform rotate-45"
                        :class="isBottomAligned ? 'bottom-4' : 'top-4'"
                      ></div>
                 </div>
            </div>
          </transition>
      </Teleport>
    </nav>

    <div class="p-4 mt-auto border-t border-white/10 dark:border-gray-800 shrink-0">
        <div v-if="!layoutStore.isCollapsed" class="fade-in text-center">
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Dev R.E.C.O</p>
            <p class="text-xs font-bold text-white dark:text-gray-300 tracking-wide">
                Process v2.0 <span class="text-verde-cope">2026</span>
            </p>
        </div>
        <div v-else class="flex justify-center fade-in">
            <svg class="w-5 h-5 text-gray-400 dark:text-gray-600 hover:text-verde-cope cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const openGroups = ref<string[]>([])

// --- NUEVA FUNCIÓN PARA CERRAR EN MÓVIL ---
const handleItemClick = () => {
  if (window.innerWidth < 768) {
      layoutStore.closeSidebar()
  }
}



// Helper para verificar roles administrativos
// (Se usa dentro del computed para lógica dinámica)

const menuItems = computed(() => {

    /**
     * --- EJEMPLO DE GRUPO DINÁMICO (COMENTADO) ---
     * Este patrón asegura que el botón "Padre" del sidebar SOLO se muestre
     * si el usuario tiene permiso para ver al menos uno de sus hijos.
     */
    /*
    const ventasChildren = [
        // Hijo 1: Requiere permiso 'ver_reportes_ventas'
        ...(authStore.hasPermission('ver_reportes_ventas') ? [{
            label: 'Reportes de Ventas',
            route: '/admin/ventas/reportes'
        }] : []),

        // Hijo 2: Requiere Rol 'Gerente'
        ...(authStore.hasRole('Gerente') ? [{
            label: 'Configuración de Caja',
            route: '/admin/ventas/config'
        }] : [])
    ];
    */

    const items: any[] = [
        {
            id: 'home',
            label: 'Dashboard',
            route: '/admin/dashboard',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3m-4 0h4" />',
            show: true
        },

        {
            id: 'asesores-creditos',
            label: 'Asesores de Créditos',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
            permission: 'asesores_credito',
            children: [
                {
                    label: 'Cargados / Pendientes',
                    route: '/admin/asesores/nuevos'
                },
                {
                    label: 'En Seguimiento',
                    route: '/admin/asesores/seguimiento'
                },
                {
                    label: 'Retornados',
                    route: '/admin/asesores/retornados'
                },
                {
                    label: 'Finalizados (Histórico)',
                    route: '/admin/asesores/finalizados'
                },
                {
                    label: 'Listado Histórico',
                    route: '/admin/consultas/expedientes'
                }
            ]
        },
        
        {
            id: 'tracking',
            label: 'Buzón Secre. Agencia',
            // Office Building Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />',
            permission: 'secretaria_agencia',
            children: [
                {
                    label: 'Bandeja Principal',
                    route: '/admin/tracking/secretaria-agencia'
                },
                {
                    label: 'Edición de Expedientes',
                    route: '/admin/tracking/secretaria-edicion'
                },
                {
                    label: 'Archivados Administrativamente',
                    route: '/admin/tracking/secretaria-agencia/archivados'
                }
            ]
        },
        {
            id: 'secretaria-creditos',
            label: 'Buzón Secre. Créditos',
            // Clipboard List Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
            permission: 'secretaria_credito',
            children: [
                {
                    label: 'Buzón Entrantes',
                    route: '/admin/secretaria-credito/buzon-entrantes'
                },
                {
                    label: 'Buzón Aceptados',
                    route: '/admin/secretaria-credito/buzon-aceptados'
                },
                {
                    label: 'Enviado a Abogados',
                    route: '/admin/secretaria-credito/buzon-abogados'
                },
                {
                    label: 'Escanear y Finalizar',
                    route: '/admin/secretaria-credito/escanear-documentos'
                },
                {
                    label: 'Buzón Completados',
                    route: '/admin/secretaria-credito/buzon-completados'
                },
                {
                    label: 'Edición de Expedientes',
                    route: '/admin/secretaria-credito/edicion'
                }
            ]
        },
        // Abogado Workspace
        {
            id: 'abogado-workspace',
            label: 'Buzón Abogado',
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>`,
            permission: 'abogado',
            children: [
                {
                    label: 'Bandeja de Entrada',
                    route: '/admin/abogado/buzon'
                },
                {
                    label: 'Devueltos a Secretaría',
                    route: '/admin/abogado/devueltos'
                }
            ]
        },
        {
            id: 'archivo',
            label: 'Archivo',
            // Archive Box Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />',
            permission: 'archivo',
            children: [
                {
                    label: 'Buzón Recibidos',
                    route: '/admin/archivo/buzon-recibidos'
                },
                {
                    label: 'Archivo Sistema',
                    route: '/admin/archivo/sistema'
                },
                {
                    label: 'Archivo Histórico',
                    route: '/admin/archivo/historico'
                },
                {
                    label: 'Edición de Expedientes',
                    route: '/admin/archivo/edicion'
                }
            ]
        },



        // Role: Requester (Solicitante)
        {
            isDivider: true,
            label: 'Confirmacion Documentos',
            permission: 'confirmar_documentos || archivo'
        },
        {
            id: 'solicitudes-confirmacion',
            label: 'Solicitudes Confirmación',
            // Search Circle Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />',
            permission: 'confirmar_documentos ',
            children: [
                {
                    label: 'Nueva Solicitud',
                    route: '/admin/confirmacion-documentos/solicitud'
                },
                {
                    label: 'Mis Solicitudes / Resultados',
                    route: '/admin/confirmacion-documentos/resultados'
                }
            ]
        },

        // Role: Validator (Validador)
        {
            id: 'validacion-documentos',
            label: 'Validación Documentos',
            // Badge Check Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />',
            permission: 'archivo',
            children: [
                {
                    label: 'Buzón Entrantes',
                    route: '/admin/confirmacion-documentos/buzon'
                },
                {
                    label: 'Histórico Respuestas',
                    route: '/admin/confirmacion-documentos/historico'
                }
            ]
        },
        
        {
            isDivider: true,
            label: 'Retiro de Garantías',
            permission: 'retiro_garantias || archivo'
        },
        {
            id: 'validacion-garantias',
            label: 'Validación Garantías',
            // Shield Check Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
            permission: 'retiro_garantias',
            children: [
                {
                    label: 'Buzón Archivo',
                    route: '/admin/retiro-garantias/buzon'
                },
                {
                    label: 'Histórico General',
                    route: '/admin/retiro-garantias/historico-general'
                }
            ]
        },
        
        {
            id: 'retiro-garantias',
            label: 'Retiro de Garantías',
            // External Link / Logout Icon (symbolizing removal)
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />',
            permission: 'archivo',
            children: [
                {
                    label: 'Solicitar Retiro',
                    route: '/admin/retiro-garantias/solicitar'
                },
                {
                    label: 'Entrega de Garantías',
                    route: '/admin/retiro-garantias/entrega'
                },
                {
                    label: 'Buzón Entregas',
                    route: '/admin/retiro-garantias/entregadas'
                },
                {
                    label: 'Histórico Realizadas',
                    route: '/admin/retiro-garantias/historico-cliente'
                }
            ]
        },

        {
            isDivider: true,
            label: 'Retiro doc Administrativo',
            permission: 'retiro_doc_administrativo || secretaria_agencia'
        },
        {
            id: 'retiro-administrativo-agencia',
            label: 'Agencia (Solicita)',
            // Document Arrow Up Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2z" />',
            permission: 'retiro_doc_administrativo',
            children: [
                {
                    label: 'Solicitar Retiro',
                    route: '/admin/retiro-administrativo/usuario/solicitar'
                }
            ]
        },
        {
            id: 'gestion-central-archivo',
            label: 'Central (Despacha)',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />',
            permission: 'secretaria_agencia',
            children: [
                {
                    label: 'Buzón de Solicitudes',
                    route: '/admin/retiro-administrativo/admin/despacho'
                }
            ]
        },

        {
            isDivider: true,
            label: 'Ajustes',
            permission: 'ajustes',
           
        },
        {
            id: 'carga-datos',
            label: 'Carga de Datos',
            // Cloud Upload Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />',
            show: true,
            children: [
                {
                    label: 'Expedientes Históricos', // Antes Clientes
                    route: '/admin/carga-datos/clientes'
                },
                {
                    label: 'Cargar Expedientes',
                    route: '/admin/carga-datos/nuevos-expedientes'
                }
            ]
        },
        
        {
            id: 'catalogos',
            label: 'Configuraciones',
            // Cog Icon
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />',
            show: true,
            children: [
                {
                    label: 'Garantías',
                    route: '/admin/catalogos/garantias',
                    permission: 'ajustes',
                },
                {
                    label: 'Tipo Documentos',
                    route: '/admin/catalogos/tipo-documentos',
                    permission: 'ajustes',
                },
                {
                    label: 'Agencias',
                    route: '/admin/catalogos/agencias'
                },
                {
                    label: 'Bufetes',
                    route: '/admin/catalogos/bufetes',
                    permission: 'ajustes',
                },
                {
                    label: 'Registros Propiedad',
                    route: '/admin/catalogos/registros-propiedad',
                    permission: 'ajustes',
                },
                {
                    label: 'Tipos de Estado',
                    route: '/admin/catalogos/tipo-estados'
                },
                {
                    label: 'Traslado de Expedientes',
                    route: '/admin/configuracion/traslado-expedientes'
                },
                {
                    label: 'Editar Seguimiento',
                    route: '/admin/configuracion/editar-seguimiento'
                },
                {
                    label: 'Editar Garantías',
                    route: '/admin/configuracion/editar-garantias'
                }
            ]
        },
        

        {
            isDivider: true,
            label: 'Reportes y Analítica',
            permission: 'Seguimiento_Principal || Consolidado_Agencias || Rendimiento_Personal || Estado_Garantías_Reales || Archivos_Administrativos || Retiro_Garantías || Confirmación_Física',
        },
        {
            id: 'reportes-gerencia',
            label: 'Reportes CSV',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />',
            permission: 'Seguimiento_Principal || Consolidado_Agencias || Rendimiento_Personal || Estado_Garantías_Reales || Archivos_Administrativos || Retiro_Garantías_Fisica || Confirmación_Física',
            route: '/admin/reportes'
        },

        /*
        // --- CONTINUACIÓN EJEMPLO GRUPO DINÁMICO ---
        {
            id: 'modulo-ventas',
            label: 'Módulo de Ventas',
            iconSvg: '<path ... />', // Tu SVG aquí
            // MAGIA AQUÍ: show depende de si `ventasChildren` tiene elementos
            show: ventasChildren.length > 0,
            children: ventasChildren
        }
        */
    ]

    const isSuperAdmin = authStore.hasRole('Super Admin')

    const hasRequiredPermission = (permStr: string) => {
        if (!permStr) return false
        if (permStr.includes('||')) {
            return permStr.split('||').some(p => authStore.hasPermission(p.trim()))
        }
        return authStore.hasPermission(permStr)
    }

    return items.map(item => {
        if (isSuperAdmin || item.id === 'home') return item;

        // Determinamos si el usuario tiene el permiso general del nivel "Padre"
        const hasParentPerm = item.permission ? hasRequiredPermission(item.permission) : false;

        if (item.children) {
            const visibleChildren = item.children.filter((child: any) => {
                // Si el hijo exige un permiso propio específico evaluamos eso, o si el papá tiene el acceso general
                if (child.permission) {
                    return hasRequiredPermission(child.permission) || hasParentPerm;
                }
                // Si el hijo NO tiene permiso explícito, se rige si el usuario tiene el permiso general del papá
                return hasParentPerm;
            });
            return { ...item, children: visibleChildren };
        }

        return item;
    }).filter(item => {
        if (isSuperAdmin || item.id === 'home') return true;

        // Los divisores se muestran si se tiene el permiso respectivo
        if (item.isDivider) {
            return item.permission ? hasRequiredPermission(item.permission) : false;
        }

        // Si es un menú desplegable (Padre), se muestra siempre y cuando al menos 1 hijo haya sobrevivido el map
        if (item.children) {
            return item.children.length > 0;
        }

        // Elementos individuales que no son grupos ni divisores
        return item.permission ? hasRequiredPermission(item.permission) : false;
    })
})

const isActive = (path: string) => route.path === path

const handleGroupClick = (id: string) => {
    if (layoutStore.isCollapsed) return
    if (openGroups.value.includes(id)) {
        openGroups.value = []
    } else {
        openGroups.value = [id]
    }
}

// --- TELEPORT / POPOVER LOGIC ---
const hoveredItem = ref<any>(null)
const popoverStyle = ref<any>({})
const isBottomAligned = ref(false)
let hoverTimeout: any = null

const handleMouseEnter = (item: any, event: MouseEvent) => {
  if (!layoutStore.isCollapsed) return
  
  if (hoverTimeout) clearTimeout(hoverTimeout)
  
  // Find the group container
  const target = (event.target as HTMLElement).closest('.group')
  if (!target) return

  const rect = target.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  // Check if item is in the lower half of the screen
  // If so, align the popover to the bottom of the item
  const isLowerHalf = rect.top > (windowHeight / 2)
  isBottomAligned.value = isLowerHalf

  hoveredItem.value = item
  
  if (isLowerHalf) {
      popoverStyle.value = {
        bottom: `${windowHeight - rect.bottom}px`,
        left: `${rect.right}px`,
        top: 'auto'
      }
  } else {
      popoverStyle.value = {
        top: `${rect.top}px`,
        left: `${rect.right}px`,
        bottom: 'auto'
      }
  }
}

const handleMouseLeave = () => {
  if (!layoutStore.isCollapsed) return
  
  hoverTimeout = setTimeout(() => {
    hoveredItem.value = null
  }, 300) // Delay to reach the popover
}

const handlePopoverEnter = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout)
}
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 20px; }

.scrollbar-hide {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
}
</style>
