<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Mis Expedientes
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de expedientes nuevos y asignación de garantías.
        </p>
      </div>
      <div class="flex gap-2">
         <button @click="resetFetch" class="px-4 py-2 bg-verde-cope text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refrescar
         </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Código</th>
                        <th scope="col" class="px-6 py-3">Nombre Asociado</th>
                        <th scope="col" class="px-6 py-3">CUI</th>
                        <th scope="col" class="px-6 py-3 text-right">Monto</th>
                        <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="loading && expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                            Cargando...
                        </td>
                    </tr>
                    <tr v-else-if="expedientes.length === 0" class="bg-white dark:bg-gray-800">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            No hay expedientes nuevos.
                        </td>
                    </tr>
                    <tr v-for="exp in expedientes" :key="exp.codigo_cliente" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            {{ exp.codigo_cliente }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ exp.nombre_asociado }}
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                            {{ exp.cui }}
                        </td>
                        <td class="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                            {{ formatCurrency(exp.monto_documento) }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <!-- Old Buttons -->
                                <button 
                                    @click="openGarantiaModal(exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-verde-cope bg-verde-cope/10 hover:bg-verde-cope/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope transition-colors"
                                    title="Agregar Garantía"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Garantía
                                </button>
                                <button 
                                    @click="openDocModal(exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    title="Agregar Documento"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documento
                                </button>
                                <!-- New Buttons -->
                                <button 
                                    @click="openDetallesModal(exp)"
                                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    title="Ver Detalles"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Detalles
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div v-if="nextPageUrl" class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-center">
            <button @click="loadMore" :disabled="loading" class="text-sm text-verde-cope font-bold hover:underline">
                {{ loading ? 'Cargando...' : 'Cargar más' }}
            </button>
        </div>
    </div>

    <!-- Modal Detalles -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        Detalles del Expediente
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ selectedExpediente?.codigo_cliente }} - {{ selectedExpediente?.nombre_asociado }}</span>
                    </p>
                </div>
                <button @click="closeDetallesModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[70vh]">
                <div v-if="loadingDetalles" class="flex justify-center p-8">
                     <svg class="animate-spin h-8 w-8 text-verde-cope" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <div v-else class="space-y-8">
                    
                    <!-- Garantías (Expanded) -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Garantías Asociadas
                        </h3>
                         <div v-if="detallesData.garantias && detallesData.garantias.length > 0" class="grid gap-4">
                             <div v-for="g in detallesData.garantias" :key="g.id" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="flex items-start justify-between">
                                    <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {{ g.nombre }}
                                        <span class="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">ID: {{ g.id }}</span>
                                    </h4>
                                </div>
                                
                                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" v-if="g.pivot">
                                    <!-- Codeudores -->
                                    <div class="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b dark:border-gray-600 pb-1">Codeudores</h5>
                                        <ul class="space-y-1">
                                            <li v-if="g.pivot.codeudor1"><span class="text-gray-500 dark:text-gray-400">1.</span> {{ g.pivot.codeudor1 }}</li>
                                            <li v-if="g.pivot.codeudor2"><span class="text-gray-500 dark:text-gray-400">2.</span> {{ g.pivot.codeudor2 }}</li>
                                            <li v-if="g.pivot.codeudor3"><span class="text-gray-500 dark:text-gray-400">3.</span> {{ g.pivot.codeudor3 }}</li>
                                            <li v-if="g.pivot.codeudor4"><span class="text-gray-500 dark:text-gray-400">4.</span> {{ g.pivot.codeudor4 }}</li>
                                            <li v-if="!g.pivot.codeudor1 && !g.pivot.codeudor2 && !g.pivot.codeudor3 && !g.pivot.codeudor4" class="italic text-gray-400">Sin codeudores registrados</li>
                                        </ul>
                                    </div>
                                    <!-- Observaciones -->
                                    <div class="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b dark:border-gray-600 pb-1">Observaciones</h5>
                                         <ul class="space-y-1">
                                            <li v-if="g.pivot.observacion1"><span class="text-gray-500 dark:text-gray-400">1.</span> {{ g.pivot.observacion1 }}</li>
                                            <li v-if="g.pivot.observacion2"><span class="text-gray-500 dark:text-gray-400">2.</span> {{ g.pivot.observacion2 }}</li>
                                            <li v-if="g.pivot.observacion3"><span class="text-gray-500 dark:text-gray-400">3.</span> {{ g.pivot.observacion3 }}</li>
                                            <li v-if="g.pivot.observacion4"><span class="text-gray-500 dark:text-gray-400">4.</span> {{ g.pivot.observacion4 }}</li>
                                            <li v-if="!g.pivot.observacion1 && !g.pivot.observacion2 && !g.pivot.observacion3 && !g.pivot.observacion4" class="italic text-gray-400">Sin observaciones registradas</li>
                                        </ul>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <p v-else class="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded">No hay garantías asociadas.</p>
                    </div>

                    <!-- Documentos (Expanded) -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Documentos Vinculados
                        </h3>
                         <div v-if="detallesData.documentos && detallesData.documentos.length > 0" class="space-y-4">
                             <div v-for="d in detallesData.documentos" :key="d.id" class="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold text-gray-700 dark:text-gray-200">{{ d.tipo_documento?.nombre || 'Documento' }}</span>
                                        <span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">No: {{ d.numero }}</span>
                                    </div>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ d.fecha }}</span>
                                </div>
                                <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                                    
                                    <div class="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                                         <div>
                                            <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Registro de Propiedad</span>
                                            <span class="font-medium text-gray-900 dark:text-white">{{ d.registro_propiedad?.nombre || 'N/A' }}</span>
                                        </div>
                                        <div>
                                            <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Monto Póliza</span>
                                            <span class="font-medium text-gray-900 dark:text-white font-mono">{{ d.monto_poliza ? formatCurrency(d.monto_poliza) : 'N/A' }}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Finca / Folio / Libro</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.no_finca || '-' }} / {{ d.folio || '-' }} / {{ d.libro || '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">No. Dominio</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.no_dominio || 'N/A' }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Referencia</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.referencia || 'N/A' }}</span>
                                    </div>
                                    <div class="md:col-span-2 lg:col-span-1">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Propietario / Titular</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.propietario || 'N/A' }}</span>
                                    </div>
                                     <div class="md:col-span-2 lg:col-span-1">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Autorizador / Notario</span>
                                        <span class="text-gray-800 dark:text-gray-300">{{ d.autorizador || 'N/A' }}</span>
                                    </div>
                                     <div class="col-span-1 md:col-span-2 lg:col-span-3 pt-2 border-t border-gray-100 dark:border-gray-700" v-if="d.observacion">
                                        <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase">Observaciones</span>
                                        <p class="text-gray-700 dark:text-gray-300 italic">{{ d.observacion }}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                         <p v-else class="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded">No hay documentos vinculados.</p>
                    </div>

                </div>
            </div>
            <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                 <button @click="closeDetallesModal" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                    Cerrar
                </button>
                 <button 
                    @click="sendExpediente(selectedExpediente!)"
                    class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Enviar Expediente
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Agregar Garantía -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    Agregar Garantía
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ selectedExpediente?.codigo_cliente }} - {{ selectedExpediente?.nombre_asociado }}</span>
                </p>
            </div>
            
            <form @submit.prevent="submitGarantia" class="p-6 space-y-6">
                <!-- Selección de Garantía -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Garantía *</label>
                    <select v-model="form.garantia_id" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="" disabled>Seleccione una garantía...</option>
                        <option v-for="g in garantiasList" :key="g.id" :value="g.id">{{ g.nombre }}</option>
                    </select>
                </div>

                <!-- Codeudores -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <h3 class="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Codeudores</h3>
                    <div v-for="i in 4" :key="'co'+i">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Codeudor {{ i }}</label>
                        <input v-model="form[`codeudor${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <!-- Observaciones -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                     <h3 class="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Observaciones</h3>
                    <div v-for="i in 4" :key="'obs'+i">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Observación {{ i }}</label>
                        <input v-model="form[`observacion${i}` as keyof typeof form]" type="text" class="w-full text-sm rounded-md border-gray-300 focus:border-verde-cope focus:ring-verde-cope dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="submitting" class="px-5 py-2.5 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30 transition flex items-center gap-2">
                        <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ submitting ? 'Guardando...' : 'Guardar Garantía' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Agregar Documento (Smart Workflow) -->
    <div v-if="showDocModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ docSearchStep ? 'Buscar Documento Existente' : (existingDocFound ? 'Vincular Documento Existente' : 'Registrar Nuevo Documento') }}
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ selectedExpediente?.codigo_cliente }} - {{ selectedExpediente?.nombre_asociado }}</span>
                </p>
            </div>
            
            <form @submit.prevent="submitDocumento" class="p-6 space-y-6">
                
                <!-- Step 1: Search Inputs -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Documento *</label>
                        <input v-model="docForm.numero" type="text" :readonly="!docSearchStep && existingDocFound" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white readonly:bg-gray-100 dark:readonly:bg-gray-800" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Documento *</label>
                        <input v-model="docForm.fecha" type="date" :readonly="!docSearchStep && existingDocFound" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white readonly:bg-gray-100 dark:readonly:bg-gray-800" required />
                    </div>
                    
                    <!-- Search Button -->
                    <div class="md:col-span-2 flex justify-end gap-3" v-if="docSearchStep">
                        <button type="button" @click="closeDocModal" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="button" @click="checkDocumento" :disabled="checkingDoc || !docForm.numero || !docForm.fecha" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
                             <svg v-if="checkingDoc" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificar Existencia
                        </button>
                    </div>
                </div>

                <!-- Step 1.5: Selection List (If matches found) -->
                <div v-if="docSelectionStep" class="animate-fade-in-down">
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                        <div class="flex items-start gap-3">
                            <div class="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full text-yellow-600 dark:text-yellow-300 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-yellow-800 dark:text-yellow-300">Coincidencias Encontradas</h3>
                                <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                    Se encontraron uno o más documentos con el número <strong>{{ docForm.numero }}</strong> y fecha <strong>{{ docForm.fecha }}</strong>.
                                    <br>Seleccione uno de la lista para vincularlo, o registre uno nuevo si ninguno coincide.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- List of Matches -->
                    <div class="grid gap-4 mb-6 max-h-[400px] overflow-y-auto p-1">
                        <div v-for="doc in foundDocs" :key="doc.id" class="relative group p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-sm hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" :class="doc.already_linked ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center gap-2">
                                         <h4 class="font-bold text-gray-900 dark:text-white">{{ doc.tipo_documento?.nombre || 'Sin Tipo' }}</h4>
                                         <span v-if="doc.already_linked" class="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                            YA VINCULADO
                                         </span>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        <span class="font-semibold">Finca:</span> {{ doc.no_finca }} | 
                                        <span class="font-semibold">Folio:</span> {{ doc.folio }} | 
                                        <span class="font-semibold">Libro:</span> {{ doc.libro }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Propietario: {{ doc.propietario || 'N/A' }} | Registro: {{ doc.registro_propiedad?.nombre || 'N/A' }}
                                    </p>
                                </div>
                                <button type="button" @click="selectExistingDoc(doc)" class="px-3 py-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition">
                                    {{ doc.already_linked ? 'Vincular de nuevo' : 'Seleccionar' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 sticky bottom-0">
                         <button type="button" @click="docSearchStep = true; docSelectionStep = false" class="text-sm text-blue-600 hover:underline">
                            &larr; Volver a búsqueda
                        </button>
                        <div class="flex gap-3 ml-auto">
                            <!-- Option to create NEW despite matches -->
                            <button type="button" @click="proceedToCreate" class="px-4 py-2 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Ninguno de estos - Registrar Nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Full Form (If checking passed) -->
                <div v-else-if="!docSearchStep" class="animate-fade-in-down">
                    
                    <div v-if="existingDocFound" :class="isDuplicate ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'" class="p-4 rounded-lg border mb-6 flex items-start gap-4">
                        <div :class="isDuplicate ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' : 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300'" class="p-2 rounded-full shrink-0">
                            <svg v-if="!isDuplicate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold" :class="isDuplicate ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'">
                                {{ isDuplicate ? 'Documento YA Asociado' : 'Documento Encontrado' }}
                            </h3>
                            <p class="text-sm mt-1" :class="isDuplicate ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">
                                {{ isDuplicate ? 'Este documento ya se encuentra vinculado a este expediente. Volver a vincularlo no creará duplicados, pero es redundante.' : 'Este documento ya existe en el sistema. Se vinculará al expediente actual sin crear duplicados.' }}
                            </p>
                        </div>
                    </div>

                     <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6 flex items-start gap-4">
                        <div class="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full text-yellow-600 dark:text-yellow-300 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-yellow-800 dark:text-yellow-300">Documento Nuevo</h3>
                            <p class="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                No se encontró el documento. Por favor complete los detalles para registrarlo.
                            </p>
                        </div>
                    </div>


                    <!-- Data Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <!-- Columna 1 -->
                         <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento *</label>
                                <select v-model="docForm.tipo_documento_id" :disabled="existingDocFound" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="t in tiposDocumentoList" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                                </select>
                            </div>
                            <!-- Removed repeated fields contained in step 1 -->
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Póliza</label>
                                <input v-model="docForm.monto_poliza" :disabled="existingDocFound" type="number" step="0.01" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                         </div>

                         <!-- Columna 2 -->
                         <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registro de Propiedad *</label>
                                <select v-model="docForm.registro_propiedad_id" :disabled="existingDocFound" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="r in registrosList" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Finca</label>
                                <input v-model="docForm.no_finca" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folio</label>
                                <input v-model="docForm.folio" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libro</label>
                                <input v-model="docForm.libro" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                         </div>

                         <!-- Columna 3 -->
                         <div class="space-y-4">
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario / Titular</label>
                                <input v-model="docForm.propietario" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autorizador / Notario</label>
                                <input v-model="docForm.autorizador" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Dominio</label>
                                <input v-model="docForm.no_dominio" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencia</label>
                                <input v-model="docForm.referencia" :disabled="existingDocFound" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                         </div>
                    </div>

                    <!-- Observaciones (Full Width) -->
                    <div class="mt-4">
                         <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                         <textarea v-model="docForm.observacion" :disabled="existingDocFound" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"></textarea>
                    </div>
                </div>

                <!-- Step 2 Footer (Form Actions) -->
                <div v-if="!docSearchStep && !docSelectionStep" class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                     <button type="button" @click="docSearchStep = true" class="text-sm text-blue-600 hover:underline">
                        &larr; Volver a búsqueda
                    </button>
                    <div class="flex gap-3 ml-auto">
                        <button type="button" @click="closeDocModal" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="submitting" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition flex items-center gap-2">
                            <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ existingDocFound ? 'Vincular Documento' : 'Registrar y Vincular' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

interface NuevoExpediente {
    codigo_cliente: number
    nombre_asociado: string
    cui: string
    monto_documento: number
    id_agencia: string
}

interface CatalogItem {
    id: number
    nombre: string
}

const expedientes = ref<NuevoExpediente[]>([])
const loading = ref(false)
const nextPageUrl = ref<string | null>(null)

// --- Garantia Modal State ---
const showModal = ref(false)
const selectedExpediente = ref<NuevoExpediente | null>(null)
const garantiasList = ref<CatalogItem[]>([])
const submitting = ref(false)

const form = reactive({
    garantia_id: '',
    codeudor1: '', codeudor2: '', codeudor3: '', codeudor4: '',
    observacion1: '', observacion2: '', observacion3: '', observacion4: ''
})

// --- Documento Modal State ---
const showDocModal = ref(false)
const docSearchStep = ref(true) // Step 1: Search
const docSelectionStep = ref(false) // Step 1.5: Select from list
const checkingDoc = ref(false)
const foundDocs = ref<any[]>([]) 

// Valid types for existingDocFound and ID
const existingDocFound = ref(false)
const existingDocId = ref<number | null>(null)

const tiposDocumentoList = ref<CatalogItem[]>([])
const registrosList = ref<CatalogItem[]>([])

const docForm = reactive({
    tipo_documento_id: '',
    registro_propiedad_id: '',
    numero: '',
    fecha: '',
    propietario: '',
    autorizador: '',
    no_finca: '',
    folio: '',
    libro: '',
    no_dominio: '',
    referencia: '',
    monto_poliza: '',
    observacion: ''
})

// Fetch Expedientes
const fetchExpedientes = async (url: string | null = null) => {
    loading.value = true
    const endpoint = url || '/nuevos-expedientes'
    try {
        const response = await api.get(endpoint)
        if (response.data.success) {
            const pagination = response.data.data
            if (!url) {
                expedientes.value = pagination.data
            } else {
                expedientes.value = [...expedientes.value, ...pagination.data]
            }
            nextPageUrl.value = pagination.next_page_url
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadMore = () => {
    if (nextPageUrl.value) fetchExpedientes(nextPageUrl.value)
}

const resetFetch = () => fetchExpedientes(null)

// Formatters
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}

// --- Garantia Logic ---
const openGarantiaModal = async (exp: NuevoExpediente) => {
    selectedExpediente.value = exp
    resetForm()
    
    // Fetch guarantees list if empty
    if (garantiasList.value.length === 0) {
        try {
            const res = await api.get('/garantias')
            if (res.data.success) {
                garantiasList.value = res.data.data.data || res.data.data 
            }
        } catch (e) { console.error(e) }
    }
    
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedExpediente.value = null
}

const resetForm = () => {
    form.garantia_id = ''
    form.codeudor1 = ''; form.codeudor2 = ''; form.codeudor3 = ''; form.codeudor4 = ''
    form.observacion1 = ''; form.observacion2 = ''; form.observacion3 = ''; form.observacion4 = ''
}

const submitGarantia = async () => {
    if (!selectedExpediente.value) return
    submitting.value = true
    
    try {
        await api.post(`/nuevos-expedientes/${selectedExpediente.value.codigo_cliente}/garantias`, form)
        
        Swal.fire({
            icon: 'success',
            title: 'Garantía Agregada',
            text: 'La garantía se ha vinculado correctamente.',
            timer: 2000,
            showConfirmButton: false
        })
        closeModal()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar.', 'error')
    } finally {
        submitting.value = false
    }
}

// --- Documento Logic ---
const openDocModal = async (exp: NuevoExpediente) => {
    selectedExpediente.value = exp
    resetDocForm()
    docSearchStep.value = true
    docSelectionStep.value = false
    existingDocFound.value = false
    existingDocId.value = null
    foundDocs.value = []

    // Show immediately
    showDocModal.value = true

    // Fetch catalogs in background (non-blocking)
    if (tiposDocumentoList.value.length === 0) {
        api.get('/tipo-documentos').then(res => {
            if (res.data.success) tiposDocumentoList.value = res.data.data.data || res.data.data
        }).catch(e => console.error(e))
    }
    if (registrosList.value.length === 0) {
        api.get('/registros-propiedad').then(res => {
            if (res.data.success) registrosList.value = res.data.data.data || res.data.data
        }).catch(e => console.error(e))
    }
}

const closeDocModal = () => {
    showDocModal.value = false
    selectedExpediente.value = null
}

const resetDocForm = () => {
    docForm.tipo_documento_id = ''
    docForm.registro_propiedad_id = ''
    docForm.numero = ''
    docForm.fecha = ''
    docForm.propietario = ''
    docForm.autorizador = ''
    docForm.no_finca = ''
    docForm.folio = ''
    docForm.libro = ''
    docForm.no_dominio = ''
    docForm.referencia = ''
    docForm.monto_poliza = ''
    docForm.observacion = ''
}

const isDuplicate = ref(false)

const checkDocumento = async () => {
    if (!docForm.numero || !docForm.fecha) return
    checkingDoc.value = true
    isDuplicate.value = false // Although no longer used for single warning, keeping state clean
    foundDocs.value = []
    
    try {
        const res = await api.post('/documentos/check', {
            numero: docForm.numero,
            fecha: docForm.fecha,
            nuevo_expediente_id: selectedExpediente.value?.codigo_cliente
        })
        
        if (res.data.found && Array.isArray(res.data.data) && res.data.data.length > 0) {
            foundDocs.value = res.data.data
            docSearchStep.value = false
            docSelectionStep.value = true // Go to selection list
        } else {
            // No docs found, go directly to creation
            proceedToCreate()
        }
    } catch (e: any) {
        console.error(e)
        Swal.fire('Error', 'No se pudo verificar el documento', 'error')
    } finally {
        checkingDoc.value = false
    }
}

const selectExistingDoc = (doc: any) => {
    existingDocFound.value = true
    existingDocId.value = doc.id
    
    // Check if it's a duplicate (though backend sends flag, we can also check UI side if needed, but let's trust the item flag for UI hints)
    isDuplicate.value = doc.already_linked

    // Populate form
    docForm.tipo_documento_id = doc.tipo_documento_id
    docForm.registro_propiedad_id = doc.registro_propiedad_id
    docForm.propietario = doc.propietario
    docForm.autorizador = doc.autorizador
    docForm.no_finca = doc.no_finca
    docForm.folio = doc.folio
    docForm.libro = doc.libro
    docForm.no_dominio = doc.no_dominio
    docForm.referencia = doc.referencia
    docForm.monto_poliza = doc.monto_poliza
    docForm.observacion = doc.observacion

    docSelectionStep.value = false // Done selecting, show form (readonly)
}

const proceedToCreate = () => {
    existingDocFound.value = false
    existingDocId.value = null
    isDuplicate.value = false
    // Keep numero and fecha
    docSearchStep.value = false
    docSelectionStep.value = false
}



const submitDocumento = async () => {
    if (!selectedExpediente.value) return
    submitting.value = true

    const payload: any = { ...docForm }
    // If linking existing, send document_id
    if (existingDocFound.value && existingDocId.value) {
        payload.documento_id = existingDocId.value
    }

    try {
         await api.post(`/nuevos-expedientes/${selectedExpediente.value.codigo_cliente}/documentos`, payload)
         
         Swal.fire({
            icon: 'success',
            title: existingDocFound.value ? 'Documento Vinculado' : 'Documento Registrado',
            text: 'El documento se ha asociado correctamente al expediente.',
            timer: 2000,
            showConfirmButton: false
        })
        closeDocModal()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el documento.', 'error')
    } finally {
        submitting.value = false
    }
}

// --- Detalles Modal Logic ---
const showDetallesModal = ref(false)
const loadingDetalles = ref(false)
const detallesData = ref<any>({})

const openDetallesModal = async (exp: NuevoExpediente) => {
    selectedExpediente.value = exp
    showDetallesModal.value = true
    loadingDetalles.value = true
    detallesData.value = {}

    try {
        const res = await api.get(`/nuevos-expedientes/${exp.codigo_cliente}/detalles`)
        if (res.data.success) {
            detallesData.value = res.data.data
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los detalles.', 'error')
    } finally {
        loadingDetalles.value = false
    }
}

const closeDetallesModal = () => {
    showDetallesModal.value = false
    selectedExpediente.value = null
    detallesData.value = {}
}

const sendExpediente = (exp: NuevoExpediente) => {
    console.log('Enviar expediente:', exp)
    Swal.fire({
        icon: 'info',
        title: 'Próximamente',
        text: 'Esta funcionalidad de envío estará disponible pronto.',
    })
}

onMounted(() => {
    fetchExpedientes()
})
</script>
