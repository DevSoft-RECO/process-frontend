<template>
    <div class="h-full">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ docSearchStep ? 'Buscar Documento Existente' : (existingDocFound ? 'Vincular Documento Existente' : 'Registrar Nuevo Documento') }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
                Expediente: <span class="font-bold text-gray-800 dark:text-gray-300">{{ expediente?.codigo_cliente }} - {{ expediente?.nombre_asociado }}</span>
            </p>
        </div>
        
        <div class="p-6 space-y-6">
            <!-- Linked Documents List -->


            <form @submit.prevent="submitDocumento">
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
                        <button type="button" @click="close" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
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
                
                <!-- Linked Documents List (Clickable for Edit) -->
                    <div v-if="linkedDocs.length > 0 && docSearchStep" class="mb-6 mt-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Documentos Asociados (Clic para ver/editar)
                    </h3>
                    <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
                        <div v-for="ld in linkedDocs" :key="ld.id" 
                             @click="loadLinkedDoc(ld)"
                             class="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition">
                            <div>
                                <p class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ ld.tipo_documento?.nombre || 'Documento' }}</p>
                                <p class="text-xs text-gray-500">No: {{ ld.numero }} | Fecha: {{ ld.fecha }}</p>
                            </div>
                            <button type="button" @click.stop="detachDocumento(ld.id)" class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed" title="Desvincular">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 1.5: Selection List (If matches found) -->
                <div v-if="docSelectionStep" class="animate-fade-in-down mt-6">
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
                                            <span v-else-if="doc.estado !== 'activo'" class="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" title="Retirado temporal o definitivamente">
                                            INACTIVO
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
                                <button type="button" @click="selectExistingDoc(doc)" :disabled="doc.estado !== 'activo'" class="px-3 py-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ doc.estado !== 'activo' ? 'No Disponible' : (doc.already_linked ? 'Vincular de nuevo' : 'Seleccionar') }}
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
                            <button type="button" @click="proceedToCreate" class="px-4 py-2 text-white bg-verde-cope rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Ninguno de estos - Registrar Nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Full Form (If checking passed) -->
                <div v-else-if="!docSearchStep" class="animate-fade-in-down mt-6">
                    
                    <!-- BANNERS DE ESTADO -->
                    <div v-if="existingDocFound">
                         <!-- Banner Edición vs Lectura -->
                         <div v-if="!isEditable" class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6 flex items-start gap-4">
                            <div class="p-2 bg-amber-100 dark:bg-amber-800 rounded-full text-amber-600 dark:text-amber-300 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-amber-800 dark:text-amber-300">Modo Lectura</h3>
                                <p class="text-sm mt-1 text-amber-700 dark:text-amber-400">
                                    Edición restringida. 
                                    <span v-if="selectedDocCount > 1">El documento está vinculado a otros expedientes Contactese con la secretaria Agencia o creditos si su ususario es secretaria de agencia.</span>
                                    <span v-else>El expediente no está en estado editable.</span>
                                </p>
                            </div>
                        </div>

                        <div v-else class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6 flex items-start gap-4">
                            <div class="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-300 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-green-800 dark:text-green-300">Modo Edición</h3>
                                <p class="text-sm mt-1 text-green-700 dark:text-green-400">
                                    Puede actualizar los datos de este documento. Los cambios se guardarán automáticamente.
                                </p>
                            </div>
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


                    <!-- Data Grid Dynamically Configured -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        <!-- Columna 1 -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento *</label>
                                <select v-model="docForm.tipo_documento_id" :disabled="existingDocFound && !isEditable" required class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="t in tiposDocumentoList" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                                </select>
                            </div>
                            <div v-show="isFieldVisible('monto_poliza')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Monto Póliza <span v-if="isFieldRequired('monto_poliza')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.monto_poliza" :disabled="existingDocFound && !isEditable" type="number" step="0.01" :required="isFieldRequired('monto_poliza')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                        </div>

                        <!-- Columna 2 -->
                        <div class="space-y-4">
                            <div v-show="isFieldVisible('registro_propiedad_id')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Registro de Propiedad <span v-if="isFieldRequired('registro_propiedad_id')" class="text-red-500">*</span>
                                </label>
                                <select v-model="docForm.registro_propiedad_id" :disabled="existingDocFound && !isEditable" :required="isFieldRequired('registro_propiedad_id')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800">
                                    <option value="" disabled>Seleccione...</option>
                                    <option v-for="r in registrosList" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                                </select>
                            </div>
                            <div v-show="isFieldVisible('no_finca')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    No. Finca <span v-if="isFieldRequired('no_finca')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.no_finca" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('no_finca')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div v-show="isFieldVisible('folio')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Folio <span v-if="isFieldRequired('folio')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.folio" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('folio')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div v-show="isFieldVisible('libro')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Libro <span v-if="isFieldRequired('libro')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.libro" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('libro')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                        </div>

                        <!-- Columna 3 -->
                        <div class="space-y-4">
                            <div v-show="isFieldVisible('propietario')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Propietario / Titular <span v-if="isFieldRequired('propietario')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.propietario" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('propietario')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div v-show="isFieldVisible('autorizador')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Autorizador / Notario <span v-if="isFieldRequired('autorizador')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.autorizador" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('autorizador')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div v-show="isFieldVisible('no_dominio')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    No. Dominio <span v-if="isFieldRequired('no_dominio')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.no_dominio" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('no_dominio')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                            <div v-show="isFieldVisible('referencia')">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Referencia <span v-if="isFieldRequired('referencia')" class="text-red-500">*</span>
                                </label>
                                <input v-model="docForm.referencia" :disabled="existingDocFound && !isEditable" type="text" :required="isFieldRequired('referencia')" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                            </div>
                        </div>
                    </div>

                    <!-- Observaciones (Full Width) -->
                    <div class="mt-4" v-show="isFieldVisible('observacion')">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Observaciones <span v-if="isFieldRequired('observacion')" class="text-red-500">*</span>
                        </label>
                        <textarea v-model="docForm.observacion" :disabled="existingDocFound && !isEditable" :required="isFieldRequired('observacion')" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"></textarea>
                    </div>
                </div>

                <!-- Step 2 Footer (Form Actions) -->
                <div v-if="!docSearchStep && !docSelectionStep" class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" @click="docSearchStep = true" class="text-sm text-blue-600 hover:underline">
                        &larr; Volver a búsqueda
                    </button>
                    <div class="flex gap-3 ml-auto">
                        <button type="button" @click="close" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="submitting || (existingDocFound && isDuplicate && !isEditable)" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ existingDocFound ? (isEditable ? 'Guardar y Vincular' : (isDuplicate ? 'Referenciado (Lectura)' : 'Vincular (Lectura)')) : 'Registrar y Vincular' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const props = defineProps<{
    expediente: any
    currentState?: number // Prop for parent state (default to 0 if not passed)
}>()

const emit = defineEmits(['close', 'saved'])

// State
const docSearchStep = ref(true)
const docSelectionStep = ref(false)
const checkingDoc = ref(false)
const submitting = ref(false)
const foundDocs = ref<any[]>([]) 
const linkedDocs = ref<any[]>([])

const existingDocFound = ref(false)
const existingDocId = ref<number | null>(null)
const isDuplicate = ref(false)
const selectedDocCount = ref<number>(0) // Store the usage count

const tiposDocumentoList = ref<any[]>([])
const registrosList = ref<any[]>([])

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

// Validation Logic for Editing
const isEditable = computed(() => {
    // If it's a new document (not found in system), it's always editable
    if (!existingDocFound.value) return true
    
    // If existing document found:
    // 1. Check Parent State: Must be State 2 (or state passed via props)
    // We try to get state from prop OR from expediente object if available
    const state = props.currentState || props.expediente?.id_estado || props.expediente?.seguimientos?.[0]?.id_estado || 0
    
    // 2. Check Unique Link: Count must be <= 1 (Only this expediente or none)
    // If count > 1, it means it's shared, so editing is restricted to avoid domino effect
    const isUnique = selectedDocCount.value <= 1
    
    // Allow if Retornado (2) OR No Tracking/Initial (0)
    return (state === 2 || state === 0 || !props.expediente?.seguimientos?.length) && isUnique
})

const currentTipoConfig = computed(() => {
    const tipo = tiposDocumentoList.value.find(t => t.id === docForm.tipo_documento_id)
    return tipo?.config_campos || null
})

const isFieldVisible = (fieldName: string) => {
    // Si estamos en modo lectura (documento ya existente y no editable), 
    // mostramos los campos que TENGAN VALOR, incluso si están ocultos en la config actual,
    // para que la secretaria vea qué se registró originalmente.
    if (existingDocFound.value && !isEditable.value) {
        return !!docForm[fieldName as keyof typeof docForm]
    }

    // Si no se ha seleccionado un tipo de documento, ocultamos los campos opcionales
    // para obligar al usuario a elegir un tipo primero y ver qué se requiere.
    if (!docForm.tipo_documento_id) return false

    // Si no hay config definida para el tipo (ej. tipo antiguo), mostramos todo por defecto
    if (!currentTipoConfig.value) return true 
    
    const config = currentTipoConfig.value[fieldName]
    // Visible si no está marcado como '0' (oculto)
    return config !== '0' && config !== 0 && config !== false && config !== 'hidden'
}

const isFieldRequired = (fieldName: string) => {
    if (!currentTipoConfig.value) return false
    const config = currentTipoConfig.value[fieldName]
    return config === '1' || config === 1 || config === true || config === 'required'
}

// Initialize logic
async function initModal() {
    resetForm()
    linkedDocs.value = props.expediente?.documentos || []
    
    // Fetch catalogs non-blocking
    if (tiposDocumentoList.value.length === 0) fetchTiposDocumento()
    if (registrosList.value.length === 0) fetchRegistros()
}

async function fetchTiposDocumento() {
    try {
        const res = await api.get('/tipo-documentos')
        if (res.data.success) tiposDocumentoList.value = res.data.data.data || res.data.data
    } catch (e) { console.error(e) }
}

async function fetchRegistros() {
    try {
        const res = await api.get('/registros-propiedad')
        if (res.data.success) registrosList.value = res.data.data.data || res.data.data
    } catch (e) { console.error(e) }
}

async function fetchUpdatedDocuments() {
    if (!props.expediente?.id) return
    try {
        const res = await api.get(`/nuevos-expedientes/${props.expediente.id}/detalles`)
        if (res.data.success && res.data.data) {
           linkedDocs.value = res.data.data.documentos || []
        }
    } catch (e) {
        console.error('Error refreshing documents', e)
    }
}

function resetForm() {
    docSearchStep.value = true
    docSelectionStep.value = false
    existingDocFound.value = false
    existingDocId.value = null
    foundDocs.value = []
    isDuplicate.value = false
    selectedDocCount.value = 0
    
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

async function checkDocumento() {
    if (!docForm.numero || !docForm.fecha) return
    checkingDoc.value = true
    isDuplicate.value = false 
    foundDocs.value = []
    
    try {
        const res = await api.post('/documentos/check', {
            numero: docForm.numero,
            fecha: docForm.fecha,
            nuevo_expediente_id: props.expediente?.id
        })
        
        if (res.data.found && Array.isArray(res.data.data) && res.data.data.length > 0) {
            foundDocs.value = res.data.data
            docSearchStep.value = false
            docSelectionStep.value = true // Go to selection list
        } else {
            proceedToCreate()
        }
    } catch (e: any) {
        console.error(e)
        // Swal.fire('Error', 'No se pudo verificar el documento', 'error')
    } finally {
        checkingDoc.value = false
    }
}

function selectExistingDoc(doc: any) {
    existingDocFound.value = true
    existingDocId.value = doc.id
    isDuplicate.value = doc.already_linked
    selectedDocCount.value = doc.nuevos_expedientes_count || (doc.already_linked ? 1 : 0) // Capture count from backend

    docForm.tipo_documento_id = doc.tipo_documento_id
    docForm.registro_propiedad_id = doc.registro_propiedad_id
    docForm.propietario = doc.propietario
    docForm.autorizador = doc.autorizador
    docForm.no_finca = doc.no_finca
    docForm.folio = doc.folio
    docForm.libro = doc.libro
    docForm.no_dominio = doc.no_dominio
    docForm.referencia = doc.referencia
    // Ensure monto_poliza is treated as string/number correctly for input
    docForm.monto_poliza = doc.monto_poliza
    docForm.observacion = doc.observacion

    docSelectionStep.value = false 
}

// Handler for clicking a linked doc to edit/view
async function loadLinkedDoc(doc: any) {
    // Populate form basics
    docForm.numero = doc.numero
    docForm.fecha = doc.fecha
    
    // We trigger a check to get fresh metadata (like global usage count)
    // This allows robust "isEditable" logic even for already linked docs
    checkingDoc.value = true
    try {
        const res = await api.post('/documentos/check', {
            numero: doc.numero,
            fecha: doc.fecha,
            nuevo_expediente_id: props.expediente?.id
        })
        
        if (res.data.found && Array.isArray(res.data.data)) {
            // Find the specific matching doc ID
            const match = res.data.data.find((d: any) => d.id === doc.id)
            if (match) {
                selectExistingDoc(match)
                // Bypass search steps since we selected directly
                docSearchStep.value = false
                docSelectionStep.value = false
            }
        }
    } catch (e) {
        console.error("Error loading linked doc details", e)
    } finally {
        checkingDoc.value = false
    }
}

function proceedToCreate() {
    existingDocFound.value = false
    existingDocId.value = null
    isDuplicate.value = false
    selectedDocCount.value = 0
    docSearchStep.value = false
    docSelectionStep.value = false
}

const detachDocumento = async (docId: number) => {
    if (!props.expediente) return

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Desvincularás este documento del expediente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, desvincular',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            const res = await api.delete(`/nuevos-expedientes/${props.expediente.id}/documentos/${docId}`)
            if (res.data.success) {
                linkedDocs.value = linkedDocs.value.filter(d => d.id !== docId)
                emit('saved') // Trigger refresh on parent
                Swal.fire('Desvinculado', 'El documento ha sido quitado.', 'success')
            }
        } catch (error) {
             console.error(error)
            Swal.fire('Error', 'No se pudo desvincular el documento.', 'error')
        }
    }
}

const submitDocumento = async () => {
    if (!props.expediente) return
    
    submitting.value = true

    const payload: any = { ...docForm }
    if (existingDocFound.value && existingDocId.value) {
        payload.documento_id = existingDocId.value
    }

    try {
        await api.post(`/nuevos-expedientes/${props.expediente.id}/documentos`, payload)
        
        Swal.fire({
            icon: 'success',
            title: existingDocFound.value ? (isEditable.value ? 'Documento Actualizado y Vinculado' : 'Documento Vinculado') : 'Documento Registrado',
            text: 'El documento se ha asociado correctamente al expediente.',
            timer: 2000,
            showConfirmButton: false
        })
        emit('saved')
        
        // Refresh local list and reset form
        resetForm()
        await fetchUpdatedDocuments()
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el documento.', 'error')
    } finally {
        submitting.value = false
    }
}

watch(() => docForm.tipo_documento_id, (newTypeId) => {
    if (!newTypeId) return
    
    // Al cambiar el tipo, limpiamos los campos que NO son visibles para el nuevo tipo.
    // Esto evita que se queden datos "basura" de un tipo anterior.
    const fieldsToCheck = [
        'propietario', 'autorizador', 'no_finca', 'folio', 'libro', 
        'no_dominio', 'referencia', 'monto_poliza', 'observacion', 
        'registro_propiedad_id'
    ]

    fieldsToCheck.forEach(field => {
        if (!isFieldVisible(field)) {
            // @ts-ignore
            docForm[field] = field === 'registro_propiedad_id' ? '' : (field === 'monto_poliza' ? '' : '')
            if (field === 'monto_poliza') docForm.monto_poliza = ''
            else if (field === 'registro_propiedad_id') docForm.registro_propiedad_id = ''
            else (docForm as any)[field] = ''
        }
    })
})

// Initialize logic moved to end to ensures access to initModal
watch(() => props.expediente, (newVal) => {
    if (newVal) {
        initModal()
    }
}, { immediate: true })

const close = () => {
    emit('close')
}
</script>
