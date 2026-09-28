<template>
  <div class="h-full flex flex-col gap-3 p-2 sm:p-4 lg:p-5">

    <!-- ═══════════════ HEADER SECTION (COMPACT) ═══════════════ -->
    <div class="slide-down shrink-0 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-azul-cope/10 text-azul-cope dark:bg-blue-500/20 dark:text-blue-300 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Retiros Administrativos
            </h1>
            <span v-if="totalResults > 0" class="px-2 py-0.5 rounded-full bg-azul-cope/10 text-azul-cope dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold tabular-nums">
              {{ totalResults }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Bandeja central para gestionar y despachar expedientes solicitados por las agencias.
          </p>
        </div>
      </div>

      <!-- Agency Badge (non Super Admin) -->
      <div v-if="!isSuperAdmin && userAgencyName" class="shrink-0">
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-azul-cope/5 to-azul-cope/10 text-azul-cope dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-300 border border-azul-cope/20 dark:border-blue-700/50 shadow-sm">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="truncate max-w-[200px]" :title="userAgencyName">{{ userAgencyName }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════ MAIN CARD ═══════════════ -->
    <div class="flex-1 bg-white dark:bg-gray-800/90 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-black/20 border border-gray-200/80 dark:border-gray-700/60 overflow-hidden slide-up flex flex-col min-h-0">

      <!-- ─── Integrated Tabs & Filters Bar (Compact Header) ─── -->
      <div class="border-b border-gray-200/80 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/30 px-3 sm:px-4 py-2 shrink-0 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        <!-- Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="setTab(tab.key)"
            class="relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap"
            :class="activeTab === tab.key
              ? 'bg-azul-cope text-white shadow-sm dark:bg-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
            </svg>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Filters: Agency Selector, Search & Refresh -->
        <div class="flex items-center gap-2">
          <!-- Agency Selector (Super Admin) -->
          <div v-if="isSuperAdmin" class="relative group w-48 sm:w-56 shrink-0">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10 text-gray-400 group-focus-within:text-azul-cope transition-colors">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <select
              v-model="selectedAgencia"
              @change="loadRequests(1)"
              class="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg text-xs focus:ring-1 focus:ring-azul-cope focus:border-azul-cope text-gray-700 dark:text-gray-200 appearance-none transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 shadow-xs"
              title="Filtrar por Agencia"
            >
              <option value="">Todas las Agencias</option>
              <option v-for="ag in agencias" :key="ag.id" :value="ag.id">
                {{ ag.nombre }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative group flex-1 sm:w-64">
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10 text-gray-400 group-focus-within:text-azul-cope transition-colors">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="search"
              @input="debouncedSearch"
              @keydown.enter="loadRequests(1)"
              type="text"
              placeholder="Buscar ID o N° Doc..."
              class="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg text-xs focus:ring-1 focus:ring-azul-cope focus:border-azul-cope text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all hover:border-gray-300 dark:hover:border-gray-500 shadow-xs"
            />
            <button
              v-if="search"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10"
              title="Limpiar búsqueda"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Refresh Button -->
          <button
            @click="loadRequests(1)"
            class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600/60 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 hover:border-gray-300 transition-all shadow-xs active:scale-95 shrink-0"
            title="Actualizar listado"
          >
            <svg class="w-3.5 h-3.5" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      <!-- ─── Data Area ─── -->
      <div class="flex-1 overflow-auto custom-scrollbar min-h-0">

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 px-4">
          <div class="relative">
            <div class="w-12 h-12 rounded-full border-[3px] border-gray-200 dark:border-gray-700"></div>
            <div class="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-azul-cope dark:border-t-blue-400 animate-spin"></div>
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando solicitudes...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="requests.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
          <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">
            {{ search ? 'Sin resultados para esta búsqueda' : 'No hay solicitudes en esta bandeja' }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-center">
            {{ search ? 'Intenta con otro término o limpia el filtro.' : 'Las nuevas solicitudes aparecerán aquí.' }}
          </p>
          <button v-if="search" @click="clearSearch" class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-azul-cope dark:text-blue-400 bg-azul-cope/5 dark:bg-blue-900/20 rounded-lg hover:bg-azul-cope/10 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            Limpiar búsqueda
          </button>
        </div>

        <!-- ─── Desktop Table (hidden on mobile) ─── -->
        <table v-else class="min-w-full hidden md:table">
          <thead class="sticky top-0 z-10">
            <tr class="bg-gray-50/95 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/40">
              <th class="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solicitud</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Origen</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expediente</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Motivo</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/40">
            <tr
              v-for="req in requests"
              :key="req.id"
              class="group hover:bg-azul-cope/[0.02] dark:hover:bg-blue-900/10 transition-colors duration-150"
            >
              <!-- Solicitud -->
              <td class="px-4 py-2.5 whitespace-nowrap">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-azul-cope/8 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-azul-cope dark:text-blue-300">#{{ req.id }}</span>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-gray-900 dark:text-white">Solicitud #{{ req.id }}</div>
                    <div class="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {{ formatDate(req.fecha_solicitud) }}
                    </div>
                  </div>
                </div>
              </td>
              <!-- Origen -->
              <td class="px-4 py-2.5 whitespace-nowrap">
                <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ req.agencia?.nombre || 'Sin agencia' }}</div>
                <div class="text-[11px] text-gray-400 dark:text-gray-500">{{ req.usuario_solicita?.name || 'Sin usuario' }}</div>
              </td>
              <!-- Expediente -->
              <td class="px-4 py-2.5 whitespace-nowrap">
                <div v-if="req.expediente">
                  <div class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[200px]" :title="req.expediente.nombre_asociado">{{ req.expediente.nombre_asociado }}</div>
                  <div class="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                    {{ req.expediente.numero_documento || 'N/A' }}
                  </div>
                </div>
                <span v-else class="text-xs text-gray-400 italic">No disponible</span>
              </td>
              <!-- Motivo -->
              <td class="px-4 py-2.5">
                <p class="text-xs text-gray-600 dark:text-gray-300 max-w-[220px] truncate" :title="req.observaciones">
                  {{ req.observaciones || 'Sin observaciones' }}
                </p>
              </td>
              <!-- Estado -->
              <td class="px-4 py-2.5 whitespace-nowrap">
                <span :class="getStatusClass(req.estado_solicitud)" class="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(req.estado_solicitud)"></span>
                  {{ formatEstado(req.estado_solicitud) }}
                </span>
              </td>
              <!-- Acciones -->
              <td class="px-4 py-2.5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="req.estado_solicitud === 'pendiente'"
                    @click="aceptarSolicitud(req)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-azul-cope dark:text-blue-300 bg-azul-cope/5 dark:bg-blue-900/20 border border-azul-cope/15 dark:border-blue-700/30 rounded-md hover:bg-azul-cope/10 dark:hover:bg-blue-900/30 hover:shadow-xs transition-all active:scale-95"
                    title="Marcar como Recibido"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Aceptar
                  </button>
                  <button
                    v-if="req.estado_solicitud === 'recibido_por_admin'"
                    @click="abrirModalDespacho(req)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-verde-cope hover:bg-verde-cope/90 rounded-md shadow-xs hover:shadow-sm transition-all active:scale-95"
                    title="Despachar Físicamente"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Despachar
                  </button>
                  <button
                    v-if="req.estado_solicitud === 'despachado' && req.estado === 'retornando'"
                    @click="confirmarReingresoExpediente(req)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200/60 dark:border-purple-700/30 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:shadow-xs transition-all active:scale-95"
                    title="Confirmar reingreso al Archivo"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    Reingresar
                  </button>
                  <span v-if="req.estado_solicitud === 'despachado' && req.estado !== 'retornando'" class="text-xs text-gray-400 dark:text-gray-500 italic flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                    En Agencia
                  </span>
                  <span v-if="req.estado_solicitud === 'archivado'" class="text-xs text-gray-400 dark:text-gray-500 italic flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Finalizado
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ─── Mobile Cards (hidden on desktop) ─── -->
        <div v-if="!loading && requests.length > 0" class="md:hidden divide-y divide-gray-100 dark:divide-gray-700/40">
          <div
            v-for="req in requests"
            :key="'m-'+req.id"
            class="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
          >
            <!-- Card Header -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-lg bg-azul-cope/8 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span class="text-xs font-bold text-azul-cope dark:text-blue-300">#{{ req.id }}</span>
                </div>
                <div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ req.agencia?.nombre || 'Sin agencia' }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(req.fecha_solicitud) }}</div>
                </div>
              </div>
              <span :class="getStatusClass(req.estado_solicitud)" class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0">
                <span class="w-1 h-1 rounded-full" :class="getStatusDot(req.estado_solicitud)"></span>
                {{ formatEstado(req.estado_solicitud) }}
              </span>
            </div>
            <!-- Card Body -->
            <div v-if="req.expediente" class="mb-3 pl-[46px]">
              <div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ req.expediente.nombre_asociado }}</div>
              <div class="text-xs text-gray-400 mt-0.5">Doc: {{ req.expediente.numero_documento || 'N/A' }}</div>
            </div>
            <p v-if="req.observaciones" class="text-xs text-gray-500 dark:text-gray-400 mb-3 pl-[46px] line-clamp-2">{{ req.observaciones }}</p>
            <!-- Card Actions -->
            <div class="flex items-center gap-2 pl-[46px]">
              <button
                v-if="req.estado_solicitud === 'pendiente'"
                @click="aceptarSolicitud(req)"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-azul-cope bg-azul-cope/5 border border-azul-cope/15 rounded-lg hover:bg-azul-cope/10 transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Aceptar
              </button>
              <button
                v-if="req.estado_solicitud === 'recibido_por_admin'"
                @click="abrirModalDespacho(req)"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-verde-cope rounded-lg hover:bg-verde-cope/90 transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Despachar
              </button>
              <button
                v-if="req.estado_solicitud === 'despachado' && req.estado === 'retornando'"
                @click="confirmarReingresoExpediente(req)"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 rounded-lg hover:bg-purple-100 transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Reingresar
              </button>
              <span v-if="req.estado_solicitud === 'despachado' && req.estado !== 'retornando'" class="text-xs text-gray-400 italic flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                En Agencia
              </span>
              <span v-if="req.estado_solicitud === 'archivado'" class="text-xs text-gray-400 italic flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Finalizado
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Pagination ─── -->
      <div v-if="lastPage > 1" class="px-3 sm:px-4 py-2 border-t border-gray-200/60 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-900/20 shrink-0">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums order-2 sm:order-1">
            Pág <span class="font-semibold text-gray-700 dark:text-gray-300">{{ currentPage }}</span> de <span class="font-semibold text-gray-700 dark:text-gray-300">{{ lastPage }}</span>
            <span class="mx-1 text-gray-300 dark:text-gray-600">·</span>
            {{ totalResults }} registros
          </p>
          <div class="flex items-center gap-1 order-1 sm:order-2">
            <button
              @click="loadRequests(1)"
              :disabled="currentPage === 1"
              class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Primera página"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button
              @click="loadRequests(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Anterior"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <!-- Page numbers -->
            <template v-for="pg in visiblePages" :key="pg">
              <span v-if="pg === '...'" class="w-7 h-7 flex items-center justify-center text-xs text-gray-400">···</span>
              <button
                v-else
                @click="loadRequests(pg as number)"
                class="w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-all"
                :class="pg === currentPage
                  ? 'bg-azul-cope text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                {{ pg }}
              </button>
            </template>

            <button
              @click="loadRequests(currentPage + 1)"
              :disabled="currentPage === lastPage"
              class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Siguiente"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <button
              @click="loadRequests(lastPage)"
              :disabled="currentPage === lastPage"
              class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
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

// ── Tab Configuration ──
const tabs = [
    { key: 'pendientes', label: 'Buzón Entrantes', shortLabel: 'Entrantes', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'despachados', label: 'Despachados / En Ruta', shortLabel: 'En Ruta', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7' },
    { key: 'historico', label: 'Historial Finalizados', shortLabel: 'Historial', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
]

const activeTab = ref('pendientes')
const loading = ref(false)
const requests = ref<any[]>([])

const search = ref('')
const selectedAgencia = ref('')
const agencias = ref<any[]>([])

const currentPage = ref(1)
const lastPage = ref(1)
const totalResults = ref(0)

// ── Computed: visible page numbers ──
const visiblePages = computed(() => {
    const total = lastPage.value
    const current = currentPage.value
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages: (number | string)[] = []
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
    return pages
})

let searchTimeout: any = null
const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        loadRequests(1)
    }, 400)
}

const clearSearch = () => {
    search.value = ''
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
        console.error('Error al cargar catálogo de agencias:', error)
    }
}

const setTab = (tab: string) => {
    activeTab.value = tab
    loadRequests(1)
}

const loadRequests = async (page = 1) => {
    loading.value = true
    try {
        const params: Record<string, any> = {
            estado: activeTab.value,
            page: page
        }

        if (search.value && search.value.trim() !== '') {
            params.search = search.value.trim()
        }

        if (isSuperAdmin.value && selectedAgencia.value) {
            params.id_agencia = selectedAgencia.value
        }

        const response = await api.get('/solicitudes-administrativas/admin', { params });

        if (response.data.success) {
            requests.value = response.data.data.data;
            currentPage.value = response.data.data.current_page;
            lastPage.value = response.data.data.last_page;
            totalResults.value = response.data.data.total;
        }
    } catch (error) {
        console.error("Error cargando solicitudes admin:", error);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    } finally {
        loading.value = false;
    }
}

const aceptarSolicitud = async (req: any) => {
    try {
        const response = await api.post(`/solicitudes-administrativas/${req.id}/aceptar`);
        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitud Aceptada',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            loadRequests(currentPage.value);
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Error al aceptar la solicitud', 'error');
    }
}

const abrirModalDespacho = async (req: any) => {
    const { value: observacionesAdicionales, isConfirmed } = await Swal.fire({
        title: 'Despachar Archivo Administrativo',
        html: `¿Confirmar salida física del archivo administrativo del expediente <b>${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id})</b> hacia ${req.agencia?.nombre}?<br><br>Puede agregar una nota de despacho (opcional):`,
        input: 'textarea',
        inputPlaceholder: 'Observaciones de envío...',
        showCancelButton: true,
        confirmButtonText: 'Despachar Archivo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
    });

    if (isConfirmed) {
        despacharExpediente(req.id, observacionesAdicionales);
    }
}

const despacharExpediente = async (id: number, notas: string) => {
    try {
        const response = await api.post(`/solicitudes-administrativas/${id}/despachar`, {
            observacion_despacho: notas
        });

        if (response.data.success) {
            Swal.fire('Despachado', 'El expediente ha sido registrado como enviado.', 'success');
            loadRequests(currentPage.value);
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Error al despachar el expediente', 'error');
    }
}

const confirmarReingresoExpediente = async (req: any) => {
    const { isConfirmed } = await Swal.fire({
        title: 'Reingresar Archivo Administrativo',
        text: `¿Confirma que el archivo administrativo del expediente ${req.expediente?.nombre_asociado} (ID: ${req.expediente?.id}) está físicamente de vuelta y quiere archivar esta solicitud?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reingresar y cerrar',
        cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
        try {
            const response = await api.post(`/solicitudes-administrativas/${req.id}/reingreso`);
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Finalizado',
                    text: 'El expediente fue reingresado y la solicitud archivada.',
                    timer: 2500,
                    showConfirmButton: false
                });
                loadRequests(currentPage.value);
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error al reingresar el expediente', 'error');
        }
    }
}

const getStatusClass = (estado: string) => {
    switch (estado?.toLowerCase()) {
        case 'pendiente':
            return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
        case 'recibido_por_admin':
            return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
        case 'despachado':
            return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
        case 'archivado':
            return 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400'
        default:
            return 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400'
    }
}

const getStatusDot = (estado: string) => {
    switch (estado?.toLowerCase()) {
        case 'pendiente': return 'bg-amber-500'
        case 'recibido_por_admin': return 'bg-blue-500'
        case 'despachado': return 'bg-purple-500'
        case 'archivado': return 'bg-gray-400'
        default: return 'bg-gray-400'
    }
}

const formatEstado = (estado: string) => {
    if (!estado) return 'Desconocido';
    const clean = estado.replace(/_/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
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

onMounted(async () => {
    if (isSuperAdmin.value) {
        fetchAgencias()
    }
    loadRequests()
})
</script>

<style scoped>
/* ── Entrance Animations ── */
.slide-down {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Custom Scrollbar ── */
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.5); }

/* ── Hide Horizontal Scrollbar on Tabs ── */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* ── Line Clamp Utility ── */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
