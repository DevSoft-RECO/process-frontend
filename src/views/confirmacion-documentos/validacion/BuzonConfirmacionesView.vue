<template>
  <div class="h-full flex flex-col space-y-4">
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Buzón de Confirmaciones</h1>
        <p class="text-sm text-gray-500">Administre las solicitudes de validación física de documentos</p>
      </div>
      <div>
        <button 
          @click="loadRequests" 
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <i :class="['fas fa-sync-alt', loading ? 'fa-spin' : '']"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden flex-1">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo / Registro</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td>
            </tr>
            <tr v-else-if="requests.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No hay solicitudes pendientes.</td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ req.numero }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(req.fecha) }}</div>
                <div v-if="req.documento_id" class="text-xs text-green-600 font-bold mt-1">
                    <i class="fas fa-check-circle"></i> Existente
                </div>
                <div v-else class="text-xs text-yellow-600 font-bold mt-1">
                    <i class="fas fa-edit"></i> Manual
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ req.tipo_documento || 'No especificado' }}</div>
                <div class="text-sm text-gray-500">{{ req.registro_propiedad || 'No especificado' }}</div>
              </td>
               <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate" :title="req.observacion">
                    {{ req.observacion || '-' }}
                </div>
                 <div class="mt-1 text-xs">
                    Finca: {{ req.no_finca || '-' }} | Folio: {{ req.folio || '-' }} | Libro: {{ req.libro || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(req.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openValidationModal(req)" 
                  class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                >
                  <i class="fas fa-clipboard-check mr-1"></i> Validar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Validation Modal replaced by SweetAlert -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const requests = ref([]);
const loading = ref(false);

const loadRequests = async () => {
    loading.value = true;
    try {
        const response = await api.get('/confirmacion-documentos');
        requests.value = response.data.data;
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al cargar solicitudes', 'error');
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const openValidationModal = async (req) => {
    const htmlContent = `
        <div class="text-left text-sm bg-gray-50 p-3 rounded mb-4 border">
            <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2 border-b pb-2 mb-2">
                    <strong>Tipo Documento:</strong> ${req.tipo_documento || '-'}<br>
                    <strong>Registro Propiedad:</strong> ${req.registro_propiedad || '-'}
                </div>

                <div><strong>No. Documento:</strong> <br>${req.numero}</div>
                <div><strong>Fecha Doc:</strong> <br>${formatDate(req.fecha)}</div>
                
                <div><strong>Monto Póliza:</strong> <br>${req.monto_poliza ? 'Q ' + req.monto_poliza : '-'}</div>
                <div><strong>Referencia:</strong> <br>${req.referencia || '-'}</div>

                <div class="col-span-2"><strong>Propietario:</strong> <br>${req.propietario || '-'}</div>
                <div class="col-span-2"><strong>Autorizador:</strong> <br>${req.autorizador || '-'}</div>
                
                <div class="col-span-2 mt-2 pt-2 border-t border-gray-200 grid grid-cols-4 gap-2 text-center">
                    <div><strong>Finca</strong><br>${req.no_finca || '-'}</div>
                    <div><strong>Folio</strong><br>${req.folio || '-'}</div>
                    <div><strong>Libro</strong><br>${req.libro || '-'}</div>
                    <div><strong>Dominio</strong><br>${req.no_dominio || '-'}</div>
                </div>
                
                <div class="col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <strong>Observación del Documento:</strong> <br>
                    <span class="italic text-gray-600">${req.observacion || '(Sin observación)'}</span>
                </div>
            </div>
        </div>
        
        <div class="text-center mb-4">
            <h3 class="font-bold text-gray-800 mb-2">¿Existe el documento físico en archivo?</h3>
            <div class="flex justify-center gap-4">
                <label class="cursor-pointer border p-2 rounded hover:bg-green-50 has-[:checked]:bg-green-100 has-[:checked]:border-green-500 transition-colors">
                    <input type="radio" name="swal-confirmacion" value="SI" class="mr-2">
                    <span class="font-bold text-green-700">SÍ EXISTE</span>
                </label>
                <label class="cursor-pointer border p-2 rounded hover:bg-red-50 has-[:checked]:bg-red-100 has-[:checked]:border-red-500 transition-colors">
                    <input type="radio" name="swal-confirmacion" value="NO" class="mr-2">
                    <span class="font-bold text-red-700">NO EXISTE</span>
                </label>
            </div>
        </div>

        <div class="text-left">
            <label class="block text-sm font-medium text-gray-700 mb-1">Observación de Confirmación</label>
            <textarea id="swal-observacion" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="2" placeholder="Detalles extra..."></textarea>
        </div>
    `;

    const { value: formValues } = await Swal.fire({
        title: 'Validación Física',
        html: htmlContent,
        showCancelButton: true,
        confirmButtonText: 'Guardar Validación',
        cancelButtonText: 'Cancelar',
        width: '600px',
        focusConfirm: false,
        preConfirm: () => {
            const confirmacion = document.querySelector('input[name="swal-confirmacion"]:checked')?.value;
            const observacion = document.getElementById('swal-observacion').value;

            if (!confirmacion) {
                Swal.showValidationMessage('Debe seleccionar SI o NO');
                return false;
            }

            return {
                confirmacion: confirmacion,
                observacion_confirmacion: observacion
            };
        }
    });

    if (formValues) {
        await submitValidation(req.id, formValues);
    }
};

const submitValidation = async (id, data) => {
    try {
        await api.put(`/confirmacion-documentos/${id}`, data);
        
        await Swal.fire('Éxito', 'Documento validado correctamente', 'success');
        loadRequests();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar la validación', 'error');
    }
};

onMounted(() => {
    loadRequests();
});
</script>
