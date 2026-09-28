<template>
  <div class="h-full flex flex-col gap-4 p-3 sm:p-5 lg:p-6 overflow-y-auto custom-scrollbar">

    <!-- ═══════════════ HEADER SECTION ═══════════════ -->
    <div class="slide-down shrink-0 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-verde-cope/10 text-verde-cope dark:bg-green-500/20 dark:text-green-300 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Solicitud de Expediente Administrativo
            </h1>
            <span v-if="isSuperAdmin" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              Super Admin (Global)
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ isSuperAdmin 
              ? 'Panel global para supervisar todas las solicitudes administrativas generadas por los usuarios.' 
              : 'Busque un expediente para solicitar su retiro físico y consulte el estado de sus solicitudes.' }}
          </p>
        </div>
      </div>

      <!-- User / Agency Badge -->
      <div v-if="!isSuperAdmin && userAgencyName" class="shrink-0">
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-verde-cope/10 to-verde-cope/20 text-verde-cope dark:from-green-900/30 dark:to-green-800/20 dark:text-green-300 border border-verde-cope/20 shadow-xs">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="truncate max-w-[200px]" :title="userAgencyName">{{ userAgencyName }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════ BUSCADOR CARD ═══════════════ -->
    <div class="bg-white dark:bg-gray-800/90 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-black/20 border border-gray-200/80 dark:border-gray-700/60 p-4 sm:p-5 slide-up shrink-0">
      <form @submit.prevent="buscarExpediente" class="flex flex-col md:flex-row gap-3 items-end">
        <div class="flex-1 w-full">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Criterio de Búsqueda (ID de Expediente o No. Documento / Producto)
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="criterioBusqueda"
              type="text"
              required
              class="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-verde-cope focus:border-verde-cope transition-all shadow-xs"
              placeholder="Ej. 12345 o 1230012475000"
              :disabled="isLoading"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="isLoading || !criterioBusqueda"
          class="w-full md:w-auto px-5 py-2 bg-verde-cope hover:bg-verde-cope/90 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-95 shrink-0"
        >
          <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ isLoading ? 'Buscando...' : 'Buscar Expediente' }}
        </button>
      </form>

      <!-- Mensaje de Error de Búsqueda -->
      <div v-if="mensajeError" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2.5 fade-in">
        <svg class="h-4 w-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h4 class="text-xs font-semibold text-red-800 dark:text-red-400">Atención</h4>
          <p class="text-xs text-red-700 dark:text-red-300">{{ mensajeError }}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════════ RESULTADOS DE BÚSQUEDA ═══════════════ -->
    <div v-if="expedienteEncontrado" class="bg-white dark:bg-gray-800/90 rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700/60 overflow-hidden fade-in shrink-0">
      <div class="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 flex justify-between items-center">
        <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-4 h-4 text-azul-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detalles del Expediente Encontrado
        </h3>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          ● Listo para Retiro
        </span>
      </div>
      
      <div class="p-4 sm:p-5">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">Asociado</p>
            <p class="font-bold text-gray-900 dark:text-white truncate" :title="expedienteEncontrado.nombre_asociado">{{ expedienteEncontrado.nombre_asociado }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">ID Expediente</p>
            <p class="font-bold text-gray-900 dark:text-white">#{{ expedienteEncontrado.id }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">No. Documento</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ expedienteEncontrado.numero_documento || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">Código Cliente</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ expedienteEncontrado.codigo_cliente || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">Agencia Origen</p>
            <p class="font-bold text-gray-900 dark:text-white truncate" :title="expedienteEncontrado.agencia?.nombre">{{ expedienteEncontrado.agencia?.nombre || 'N/A' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
            <p class="text-gray-400 font-medium">Monto</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ expedienteEncontrado.monto_documento || 'N/A' }}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
          <button 
            @click="limpiarBusqueda"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
          >
            Cancelar
          </button>
          <button 
            @click="modalConfirmacion = true"
            class="px-4 py-1.5 text-xs font-semibold text-white bg-azul-cope hover:bg-azul-cope/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Solicitud de Retiro
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ MODAL CONFIRMACIÓN ═══════════════ -->
    <div v-if="modalConfirmacion" class="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity" @click="modalConfirmacion = false"></div>
      
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 flex items-center justify-between shrink-0">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Confirmar Solicitud de Retiro
          </h3>
          <button @click="modalConfirmacion = false" class="text-gray-400 hover:text-gray-500 transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto custom-scrollbar">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 mb-4 text-xs text-blue-800 dark:text-blue-300">
            Está solicitando el retiro administrativo de <strong>{{ expedienteEncontrado?.nombre_asociado }} (ID: #{{ expedienteEncontrado?.id }})</strong>.
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Motivo / Justificación *</label>
            <textarea 
              v-model="observaciones"
              rows="3"
              class="block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-verde-cope focus:border-verde-cope resize-none shadow-xs"
              placeholder="Detalle la razón por la que requiere retirar este expediente..."
              required
            ></textarea>
          </div>
        </div>

        <div class="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 shrink-0 flex justify-end gap-2">
          <button 
            @click="modalConfirmacion = false"
            :disabled="isSubmitting"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-xs"
          >
            Cancelar
          </button>
          <button 
            @click="confirmarYEnviar"
            :disabled="isSubmitting || !observaciones.trim()"
            class="px-3.5 py-1.5 text-xs font-semibold text-white bg-azul-cope rounded-lg shadow-xs hover:bg-azul-cope/90 flex items-center gap-1.5 disabled:opacity-50 transition-colors active:scale-95"
          >
            <svg v-if="isSubmitting" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Enviando...' : 'Confirmar Solicitud' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ BANDEJA DE SOLICITUDES (ACTIVAS / HISTÓRICAS) ═══════════════ -->
    <div class="bg-white dark:bg-gray-800/90 rounded-xl shadow-md border border-gray-200/80 dark:border-gray-700/60 overflow-hidden slide-up flex flex-col flex-1 min-h-[420px]">
      
      <!-- Toolbar: Pestañas + Buscador + Filtro de Agencia (Super Admin) + Actualizar -->
      <div class="px-3 sm:px-4 py-2 border-b border-gray-200/80 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/30 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 shrink-0">
        <!-- Pestañas Activas / Histórico -->
        <div class="flex items-center gap-1.5">
          <button 
            @click="setTab('active')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            :class="activeTab === 'active' 
              ? 'bg-azul-cope text-white shadow-xs dark:bg-blue-600' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:text-gray-200'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ isSuperAdmin ? 'Solicitudes Activas (Global)' : 'Mis Solicitudes Activas' }}
            <span v-if="activePagination.total > 0" class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {{ activePagination.total }}
            </span>
          </button>
          <button 
            @click="setTab('historic')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            :class="activeTab === 'historic' 
              ? 'bg-azul-cope text-white shadow-xs dark:bg-blue-600' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:text-gray-200'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            {{ isSuperAdmin ? 'Historial Finalizados (Global)' : 'Mi Historial' }}
            <span v-if="historicPagination.total > 0" class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {{ historicPagination.total }}
            </span>
          </button>
        </div>

        <!-- Filtros y Acciones -->
        <div class="flex items-center gap-2">
          <!-- Filtro de Agencia para Super Admin -->
          <div v-if="isSuperAdmin" class="relative group w-44 sm:w-52 shrink-0">
            <select 
              v-model="selectedAgencia"
              @change="loadRequests(1)"
              class="w-full pl-2.5 pr-7 py-1.5 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg text-xs focus:ring-1 focus:ring-azul-cope text-gray-700 dark:text-gray-200 appearance-none cursor-pointer shadow-xs"
              title="Filtrar por Agencia"
            >
              <option value="">Todas las Agencias</option>
              <option v-for="ag in agencias" :key="ag.id" :value="ag.id">{{ ag.nombre }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Buscador en Bandeja -->
          <div class="relative group flex-1 sm:w-56">
            <input 
              v-model="searchTerm"
              @input="debouncedSearch"
              @keydown.enter="loadRequests(1)"
              type="text"
              placeholder="Buscar ID o No. Doc..."
              class="w-full pl-7 pr-6 py-1.5 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg text-xs focus:ring-1 focus:ring-azul-cope text-gray-900 dark:text-white placeholder-gray-400 shadow-xs"
            />
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button v-if="searchTerm" @click="clearSearch" class="absolute inset-y-0 right-0 pr-1.5 flex items-center text-gray-400 hover:text-red-500">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Botón Actualizar -->
          <button 
            @click="loadRequests(1)" 
            class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg hover:bg-gray-100 transition-all shadow-xs active:scale-95 shrink-0"
            title="Actualizar listado"
          >
            <svg class="w-3.5 h-3.5" :class="{'animate-spin': loadingRequests}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      <!-- Tabla de Datos -->
      <div class="flex-1 overflow-auto custom-scrollbar p-0">
        <!-- Loading State -->
        <div v-if="loadingRequests" class="flex flex-col items-center justify-center py-12 px-4">
          <div class="relative w-8 h-8">
            <div class="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
            <div class="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-azul-cope animate-spin"></div>
          </div>
          <p class="mt-2 text-xs text-gray-400 font-medium">Cargando solicitudes...</p>
        </div>

        <!-- ══════════ TABLA ACTIVAS ══════════ -->
        <table v-else-if="activeTab === 'active' && activeRequests.length > 0" class="min-w-full divide-y divide-gray-100 dark:divide-gray-700/40">
          <thead class="bg-gray-50/95 dark:bg-gray-900/80 sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/40">
            <tr>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Solicitud</th>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Expediente</th>
              <th v-if="isSuperAdmin" class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Estado Central</th>
              <th class="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
            <tr v-for="req in activeRequests" :key="req.id" class="hover:bg-azul-cope/[0.02] dark:hover:bg-blue-900/10 transition-colors">
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-azul-cope/8 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span class="text-[11px] font-bold text-azul-cope dark:text-blue-300">#{{ req.id }}</span>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ formatDate(req.fecha_solicitud) }}</div>
                    <div class="text-[10px] text-gray-400">{{ req.agencia?.nombre || 'Agencia' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <div v-if="req.expediente">
                  <div class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[200px]" :title="req.expediente.nombre_asociado">{{ req.expediente.nombre_asociado }}</div>
                  <div class="text-[10px] text-gray-400">Doc: {{ req.expediente.numero_documento || 'N/A' }}</div>
                </div>
                <span v-else class="text-xs text-gray-400 italic">No disponible</span>
              </td>
              <td v-if="isSuperAdmin" class="px-3 py-2 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-900 dark:text-white">{{ req.usuario_solicita?.name || 'N/A' }}</div>
                <div class="text-[10px] text-gray-400">{{ req.agencia?.nombre }}</div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="flex flex-col gap-0.5">
                  <span :class="getStatusClass(req.estado_solicitud)" class="w-fit px-2 py-0.5 inline-flex text-[10px] font-bold rounded-full">
                    {{ (req.estado_solicitud || 'N/A').toUpperCase().replace(/_/g, ' ') }}
                  </span>
                  <span v-if="req.estado === 'en_agencia'" class="text-[9px] text-green-600 font-bold">● EN AGENCIA</span>
                  <span v-if="req.estado === 'retornando'" class="text-[9px] text-orange-600 font-bold">● RETORNANDO</span>
                </div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Confirmar Recepción -->
                  <button
                    v-if="req.estado_solicitud === 'despachado' && req.confirmacion_solicitante === 'pendiente'"
                    @click="confirmarRecepcionFisica(req)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200/60 rounded-md hover:bg-green-100 transition-all shadow-xs active:scale-95"
                    title="Confirmar que recibí el expediente físico"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Confirmar Recepción
                  </button>

                  <!-- Iniciar Devolución -->
                  <button
                    v-if="req.confirmacion_solicitante === 'si' && !req.fecha_devolucion_iniciada"
                    @click="iniciarDevolucionExpediente(req)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200/60 rounded-md hover:bg-orange-100 transition-all shadow-xs active:scale-95"
                    title="Devolver el expediente al archivo central"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    Devolver Archivo
                  </button>
                  
                  <span v-if="req.estado_solicitud === 'pendiente' || req.estado_solicitud === 'recibido_por_admin'" class="text-[11px] text-gray-400 italic">En proceso central...</span>
                  <span v-if="req.fecha_devolucion_iniciada" class="text-[11px] text-gray-400 italic">Devolución en curso...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ══════════ TABLA HISTORIAL ══════════ -->
        <table v-else-if="activeTab === 'historic' && historicRequests.length > 0" class="min-w-full divide-y divide-gray-100 dark:divide-gray-700/40">
          <thead class="bg-gray-50/95 dark:bg-gray-900/80 sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/40">
            <tr>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Fecha Fin</th>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Expediente</th>
              <th v-if="isSuperAdmin" class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th class="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
            <tr v-for="req in historicRequests" :key="req.id" class="hover:bg-azul-cope/[0.02] dark:hover:bg-blue-900/10 transition-colors">
              <td class="px-3 py-2 whitespace-nowrap">
                <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ formatDate(req.fecha_finalizacion || req.updated_at) }}</div>
                <div class="text-[10px] text-gray-400">ID: #{{ req.id }}</div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <div v-if="req.expediente">
                  <div class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[200px]" :title="req.expediente.nombre_asociado">{{ req.expediente.nombre_asociado }}</div>
                  <div class="text-[10px] text-gray-400">ID Exp: #{{ req.expediente.id }}</div>
                </div>
                <span v-else class="text-xs text-gray-400 italic">No disponible</span>
              </td>
              <td v-if="isSuperAdmin" class="px-3 py-2 whitespace-nowrap">
                <div class="text-xs font-medium text-gray-900 dark:text-white">{{ req.usuario_solicita?.name || 'N/A' }}</div>
                <div class="text-[10px] text-gray-400">{{ req.agencia?.nombre }}</div>
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                {{ req.expediente?.numero_documento || 'N/A' }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-right">
                <span class="px-2 py-0.5 inline-flex text-[10px] font-bold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  ARCHIVADO
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-10 px-4">
          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {{ searchTerm ? 'No se encontraron resultados para la búsqueda.' : (activeTab === 'active' ? 'No hay solicitudes activas.' : 'No hay solicitudes en el historial.') }}
          </p>
          <button v-if="searchTerm" @click="clearSearch" class="mt-2 text-xs text-azul-cope hover:underline">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Barra de Paginación -->
      <div v-if="currentPagination.lastPage > 1" class="px-3 sm:px-4 py-2 border-t border-gray-200/60 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-between shrink-0">
        <p class="text-[11px] text-gray-500 tabular-nums">
          Pág {{ currentPagination.page }} de {{ currentPagination.lastPage }} · {{ currentPagination.total }} solicitudes
        </p>
        <div class="flex items-center gap-1">
          <button
            @click="loadRequests(currentPagination.page - 1)"
            :disabled="currentPagination.page === 1"
            class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="text-xs font-bold px-2">{{ currentPagination.page }}</span>
          <button
            @click="loadRequests(currentPagination.page + 1)"
            :disabled="currentPagination.page === currentPagination.lastPage"
            class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isSuperAdmin = computed(() => authStore.hasRole('Super Admin'))
const userAgencyName = computed(() => {
    return authStore.user?.agencia?.nombre || authStore.user?.agencia_nombre || authStore.user?.agencia_data?.nombre || authStore.user?.agencia || ''
})

// Estados de Búsqueda de Expediente
const criterioBusqueda = ref('')
const isLoading = ref(false)
const mensajeError = ref('')
const expedienteEncontrado = ref<any>(null)
const modalConfirmacion = ref(false)
const observaciones = ref('')
const isSubmitting = ref(false)

// Estados de Bandeja de Solicitudes
const activeTab = ref<'active' | 'historic'>('active')
const loadingRequests = ref(false)
const activeRequests = ref<any[]>([])
const historicRequests = ref<any[]>([])

const searchTerm = ref('')
const selectedAgencia = ref('')
const agencias = ref<any[]>([])

// Paginación
const activePagination = ref({ page: 1, lastPage: 1, total: 0 })
const historicPagination = ref({ page: 1, lastPage: 1, total: 0 })

const currentPagination = computed(() => {
    return activeTab.value === 'active' ? activePagination.value : historicPagination.value
})

let searchDebounceTimeout: any = null
const debouncedSearch = () => {
    clearTimeout(searchDebounceTimeout)
    searchDebounceTimeout = setTimeout(() => {
        loadRequests(1)
    }, 400)
}

const clearSearch = () => {
    searchTerm.value = ''
    loadRequests(1)
}

const setTab = (tab: 'active' | 'historic') => {
    activeTab.value = tab
    loadRequests(1)
}

const fetchAgencias = async () => {
    try {
        const res = await api.get('/agencias', { params: { all: 1 } })
        if (Array.isArray(res.data)) {
            agencias.value = res.data
        } else if (res.data?.data && Array.isArray(res.data.data)) {
            agencias.value = res.data.data
        }
    } catch (error) {
        console.error('Error al cargar agencias:', error)
    }
}

// Cargar solicitudes según rol y pestaña activa
const loadRequests = async (page = 1) => {
    loadingRequests.value = true
    try {
        const params: Record<string, any> = { page }

        if (searchTerm.value && searchTerm.value.trim() !== '') {
            params.search = searchTerm.value.trim()
        }

        if (isSuperAdmin.value && selectedAgencia.value) {
            params.id_agencia = selectedAgencia.value
        }

        if (activeTab.value === 'active') {
            const res = await api.get('/solicitudes-administrativas', { params })
            if (res.data.success) {
                activeRequests.value = res.data.data.data
                activePagination.value = {
                    page: res.data.data.current_page,
                    lastPage: res.data.data.last_page,
                    total: res.data.data.total
                }
            }
        } else {
            const res = await api.get('/solicitudes-administrativas/historico', { params })
            if (res.data.success) {
                historicRequests.value = res.data.data.data
                historicPagination.value = {
                    page: res.data.data.current_page,
                    lastPage: res.data.data.last_page,
                    total: res.data.data.total
                }
            }
        }
    } catch (error) {
        console.error("Error cargando solicitudes:", error)
    } finally {
        loadingRequests.value = false
    }
}

onMounted(() => {
    if (isSuperAdmin.value) {
        fetchAgencias()
    }
    loadRequests()
})

const confirmarRecepcionFisica = async (req: any) => {
    const { isConfirmed } = await Swal.fire({
        title: 'Confirmar Recepción de Archivo',
        text: `¿Confirma que ha recibido físicamente el archivo administrativo del expediente de ${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id})?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
        try {
            const res = await api.post(`/solicitudes-administrativas/${req.id}/confirmar`)
            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Recepción Confirmada',
                    text: 'El expediente se marcó como recibido en su agencia.',
                    timer: 2000,
                    showConfirmButton: false
                })
                loadRequests(currentPagination.value.page)
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error al confirmar recepción', 'error')
        }
    }
}

const iniciarDevolucionExpediente = async (req: any) => {
    const { isConfirmed } = await Swal.fire({
        title: 'Devolver Archivo Administrativo',
        text: `¿Está seguro de iniciar la devolución del archivo administrativo del expediente ${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id}) al Archivo Central?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, iniciar devolución',
        cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
        try {
            const res = await api.post(`/solicitudes-administrativas/${req.id}/devolver`)
            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Devolución Iniciada',
                    text: 'El expediente se marcó para retorno al Archivo Central.',
                    timer: 2000,
                    showConfirmButton: false
                })
                loadRequests(currentPagination.value.page)
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error al iniciar devolución', 'error')
        }
    }
}

const getStatusClass = (estado: string) => {
    switch (estado?.toLowerCase()) {
        case 'pendiente':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
        case 'recibido_por_admin':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        case 'despachado':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        case 'archivado':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const buscarExpediente = async () => {
    if (!criterioBusqueda.value) return

    isLoading.value = true
    mensajeError.value = ''
    expedienteEncontrado.value = null

    try {
        const response = await api.get('/solicitudes-administrativas/buscar', {
            params: {
                criterio: criterioBusqueda.value
            }
        })

        if (response.data.success) {
            expedienteEncontrado.value = response.data.expediente
        }

    } catch (error: any) {
        if (error.response) {
            mensajeError.value = error.response.data.message || 'Error al validar el expediente.'
        } else {
            mensajeError.value = 'Error de conexión. Intente nuevamente.'
        }
    } finally {
        isLoading.value = false
    }
}

const limpiarBusqueda = () => {
    criterioBusqueda.value = ''
    expedienteEncontrado.value = null
    mensajeError.value = ''
    observaciones.value = ''
}

const confirmarYEnviar = async () => {
    if (!observaciones.value.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe ingresar el motivo de la solicitud.',
            confirmButtonColor: '#04244F'
        })
        return
    }

    const agencyId = authStore.user?.id_agencia || authStore.user?.agencia_id || authStore.user?.agencia?.id

    if (!agencyId && !isSuperAdmin.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Sesión',
            text: 'No se pudo identificar a qué agencia pertenece su usuario.',
            confirmButtonColor: '#04244F'
        })
        return
    }

    isSubmitting.value = true

    try {
        const payload = {
            id_expediente: expedienteEncontrado.value?.id,
            id_agencia: agencyId || expedienteEncontrado.value?.id_agencia,
            observaciones: observaciones.value
        }

        const response = await api.post('/solicitudes-administrativas', payload)

        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Enviada',
                text: 'La solicitud de retiro administrativo se generó correctamente.',
                confirmButtonColor: '#10B981'
            }).then(() => {
                modalConfirmacion.value = false
                limpiarBusqueda()
                loadRequests(1)
            })
        }
    } catch (error: any) {
        let msg = 'Ocurrió un error inesperado al enviar la solicitud.'
        if (error.response?.data?.message) {
            msg = error.response.data.message
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
            confirmButtonColor: '#04244F'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.fade-in { animation: fadeIn 0.3s ease-in-out; }
.slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.5); }
</style>
