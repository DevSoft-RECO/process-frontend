<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </span>
                    Edición de Expedientes de Secretaría Agencia 
                </h1>
                <p class="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                    Búsqueda y modificación de garantías y documentos.
                </p>
            </div>

            <!-- Search Box -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-grow">
                        <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar Expediente</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                v-model="searchQuery"
                                type="text"
                                @keyup.enter="search"
                                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
                                placeholder="Ingrese numero de producto"
                            />
                        </div>
                    </div>
                    <div class="flex items-end">
                        <button
                            @click="search"
                            :disabled="searching || !searchQuery"
                            class="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            <svg v-if="searching" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ searching ? 'Buscando...' : 'Buscar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div v-if="detallesData" class="space-y-8 animate-fade-in-up">
                
                <!-- Expediente Info -->
                 <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div class="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Información del Expediente</h2>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <span class="block text-sm text-gray-500 dark:text-gray-400">Código Cliente/ Producto</span>
                            <span class="text-lg font-medium text-gray-900 dark:text-white">{{ detallesData.expediente.codigo_cliente }} / {{ detallesData.expediente.numero_documento }}</span>
                        </div>
                        <div>
                            <span class="block text-sm text-gray-500 dark:text-gray-400">Nombre Asociado</span>
                            <span class="text-lg font-medium text-gray-900 dark:text-white">{{ detallesData.expediente.nombre_asociado }}</span>
                        </div>
                    </div>
                </div>

                <!-- Garantías -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div class="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-verde-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Garantías
                        </h2>
                    </div>
                    <div class="p-6">
                        <div v-if="detallesData.garantias.length === 0" class="text-center text-gray-500 py-4">
                            No hay garantías asociadas.
                        </div>
                        <div v-else class="grid gap-6">
                            <div v-for="g in detallesData.garantias" :key="g.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition bg-gray-50 dark:bg-gray-700/20">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ g.nombre }}</h4>
                                        <span class="text-xs text-gray-500">ID: {{ g.id }}</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <button @click="openEditGarantia(g)" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition">
                                            Editar Detalles
                                        </button>
                                        <button @click="openChangeType(g)" class="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-200 transition">
                                            Cambiar Tipo
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-600" v-if="g.pivot">
                                    <div>
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Codeudores</h5>
                                        <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                                            <li v-if="g.pivot.codeudor1">1. {{ g.pivot.codeudor1 }}</li>
                                            <li v-if="g.pivot.codeudor2">2. {{ g.pivot.codeudor2 }}</li>
                                            <li v-if="g.pivot.codeudor3">3. {{ g.pivot.codeudor3 }}</li>
                                            <li v-if="g.pivot.codeudor4">4. {{ g.pivot.codeudor4 }}</li>
                                        </ul>
                                    </div>
                                     <div>
                                        <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Observaciones</h5>
                                        <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                                            <li v-if="g.pivot.observacion1">1. {{ g.pivot.observacion1 }}</li>
                                            <li v-if="g.pivot.observacion2">2. {{ g.pivot.observacion2 }}</li>
                                            <li v-if="g.pivot.observacion3">3. {{ g.pivot.observacion3 }}</li>
                                            <li v-if="g.pivot.observacion4">4. {{ g.pivot.observacion4 }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Documentos -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                     <div class="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Documentos
                        </h2>
                    </div>
                    <div class="p-6">
                        <div v-if="detallesData.documentos.length === 0" class="text-center text-gray-500 py-4">
                            No hay documentos vinculados.
                        </div>
                         <div v-else class="grid grid-cols-1 gap-4">
                             <div v-for="d in detallesData.documentos" :key="d.id" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                 <div class="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 flex justify-between items-center">
                                     <div class="flex items-center gap-3">
                                         <span class="font-bold text-gray-800 dark:text-white">{{ d.tipo_documento?.nombre || 'Documento' }}</span>
                                         <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">No: {{ d.numero }}</span>
                                        <div v-if="d.expedientes_asociados_count > 0" class="flex items-center gap-2">
                                            <span class="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                {{ d.expedientes_asociados_count === 1 ? 'Compartido con otro 1' : `Compartido con otros ${d.expedientes_asociados_count}` }}
                                            </span>
                                             <button @click="showSharedExpedientes(d.id)" class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100 transition-colors">
                                                 <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                 Ver Lista
                                             </button>
                                         </div>
                                     </div>
                                     <button @click="openEditDocumento(d)" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition">
                                         Editar
                                     </button>
                                 </div>
                                 <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                     <div>
                                         <span class="block text-xs uppercase text-gray-400">Registro</span>
                                         {{ d.registro_propiedad?.nombre }}
                                     </div>
                                     <div>
                                         <span class="block text-xs uppercase text-gray-400">Fecha</span>
                                         {{ d.fecha }}
                                     </div>
                                     <div>
                                         <span class="block text-xs uppercase text-gray-400">Monto Poliza</span>
                                         {{ formatCurrency(d.monto_poliza) }}
                                     </div>
                                     <div class="md:col-span-3">
                                         <span class="block text-xs uppercase text-gray-400">Finca / Folio / Libro / No Dominio</span>
                                         {{ d.no_finca }} / {{ d.folio }} / {{ d.libro }} / {{ d.no_dominio }}
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

            </div>

            <!-- Empty State -->
            <div v-if="!detallesData && !searching && hasSearched" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No se encontró el expediente</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Verifique el código ingresado e intente nuevamente.</p>
            </div>

        </div>

        <!-- Modals -->
        <EditGarantiaModal 
            v-if="showEditGarantia"
            :show="showEditGarantia"
            :expedienteId="currentExpedienteId"
            :garantia="selectedGarantia"
            @close="showEditGarantia = false"
            @refresh="search"
        />

        <ChangeGarantiaTypeModal
            v-if="showChangeType"
            :show="showChangeType"
            :expedienteId="currentExpedienteId"
            :garantia="selectedGarantia"
            @close="showChangeType = false"
            @refresh="search"
        />

        <EditDocumentModal
            v-if="showEditDocumento"
            :show="showEditDocumento"
            :documento="selectedDocumento"
            @close="showEditDocumento = false"
            @refresh="search"
        />

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import api from '@/api/axios'
import Swal from 'sweetalert2'
import EditGarantiaModal from '../tracking/components/EditGarantiaModal.vue'
import EditDocumentModal from '../tracking/components/EditDocumentModal.vue'
import ChangeGarantiaTypeModal from '../tracking/components/ChangeGarantiaTypeModal.vue'

const searchQuery = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const detallesData = ref<any>(null)

// Modals State
const showEditGarantia = ref(false)
const showChangeType = ref(false)
const showEditDocumento = ref(false)
const selectedGarantia = ref<any>(null)
const selectedDocumento = ref<any>(null)
const currentExpedienteId = ref<string | null>(null)

const search = async () => {
    if (!searchQuery.value) return
    searching.value = true
    hasSearched.value = true
    detallesData.value = null
    
    try {
        // Llamada directa a la nueva función optimizada
        const res = await api.get('/expedientes/search-edit', {
            params: { search: searchQuery.value }
        })

        if (res.data.success) {
            const exp = res.data.data.expediente
            const userStore = useAuthStore()

            // Validación de estado: Solo se permiten ediciones en estados 1, 2 y 3.
            // Si el estado es mayor a 3 y el usuario NO es Super Admin, se bloquea.
            if (exp.id_estado > 3 && !userStore.hasRole('Super Admin')) {
                Swal.fire({
                    icon: 'info',
                    title: 'Expediente Avanzado',
                    text: 'El expediente ha avanzado a la siguiente estación. Si requiere modificaciones, por favor escale el problema con la Secretaría de Créditos.',
                    confirmButtonText: 'Entendido'
                })
                // No asignamos detallesData para no mostrar la información
                return
            }

            // Validación de documentos compartidos:
            // Si algún documento tiene expedientes_asociados_count > 0, se bloquea la edición.
            // (A menos que sea Super Admin)
            const hasSharedDocuments = res.data.data.documentos.some((doc: any) => doc.expedientes_asociados_count > 0)
            
            if (hasSharedDocuments && !userStore.hasRole('Super Admin')) {
                Swal.fire({
                    icon: 'info',
                    title: 'Documentos Compartidos',
                    text: 'Este expediente contiene documentos compartidos con otros expedientes. Por seguridad, la edición está restringida. Por favor escale el caso a Secretaría de Créditos.',
                    confirmButtonText: 'Entendido'
                })
                return
            }

            // Seteamos detallesData y los modales ya tendrán qué listar y editar
            detallesData.value = res.data.data
            currentExpedienteId.value = res.data.data.expediente.id
        } else {
             Swal.fire({
                icon: 'warning',
                title: 'Expediente no encontrado o no autorizado',
                text: 'El expediente que buscas no pertenece a tu agencia. Verifica el número de producto o de expediente correcto.',
                confirmButtonText: 'Entendido'
            })
        }
    } catch (error: any) {
        console.error(error)
        Swal.fire('Error', 'Error al procesar la búsqueda.', 'error')
    } finally {
        searching.value = false
    }
}

const openEditGarantia = (g: any) => {
    selectedGarantia.value = g
    showEditGarantia.value = true
}

const openChangeType = (g: any) => {
    selectedGarantia.value = g
    showChangeType.value = true
}

const openEditDocumento = (doc: any) => {
    // La restricción de agencia ya se maneja en el backend.
    // Se elimina la restricción de documentos compartidos para esta vista.
    selectedDocumento.value = doc
    showEditDocumento.value = true
}

const showSharedExpedientes = async (docId: number) => {
    Swal.fire({
        title: 'Cargando expedientes...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })

    try {
        const res = await api.get(`/expedientes/documentos/${docId}/asociados`)
        if (res.data.success) {
            const expedientes = res.data.data
            
            // Filter out the current expediente's number
            const currentNum = detallesData.value?.expediente?.numero_documento
            const filteredExpedientes = currentNum 
                ? expedientes.filter((num: string) => String(num) !== String(currentNum)) 
                : expedientes

            if (filteredExpedientes.length === 0) {
                 Swal.fire({
                    title: 'Información',
                    text: 'No se encontraron otros productos vinculados.',
                    icon: 'info',
                    confirmButtonText: 'Entendido'
                })
                return
            }
            
            let htmlList = '<ul style="text-align: left; max-height: 200px; overflow-y: auto; list-style-type: none; padding: 0;">'
            filteredExpedientes.forEach((num: string) => {
                htmlList += `<li style="padding: 5px 10px; border-bottom: 1px solid #eee;">• ${num}</li>`
            })
            htmlList += '</ul>'

            Swal.fire({
                title: `Otros Productos Vinculados`,
                html: htmlList,
                confirmButtonText: 'Cerrar'
            })
        } else {
            Swal.fire('Error', 'No se pudieron cargar los detalles.', 'error')
        }
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'Ocurrió un error al cargar la información.', 'error')
    }
}

const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
}
</script>
