<template>
  <div class="h-full flex flex-col items-center justify-start py-10 px-4 bg-gray-50 overflow-y-auto">
    
    <!-- Logo / Title Section -->
    <div class="text-center mb-8 transition-all duration-500 ease-in-out" :class="{ 'mt-20': !hasSearched, 'mt-0': hasSearched }">
      <h1 class="text-4xl font-extrabold text-gray-800 tracking-tight">
        <span class="text-blue-600">Busca</span>dor de <span class="text-indigo-600">Documentos</span>
      </h1>
      <p class="mt-2 text-gray-500 text-lg" v-if="!hasSearched">Ingrese los datos para verificar la existencia del documento.</p>
    </div>

    <!-- Search Bar Section -->
    <div class="w-full max-w-3xl transition-all duration-500 ease-in-out z-10" :class="{ 'mb-12': !hasSearched, 'mb-8': hasSearched }">
      <div class="bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 p-2 flex flex-col md:flex-row items-center border border-gray-200">
        <div class="flex-1 w-full md:w-auto px-6 py-2 md:py-0 border-b md:border-b-0 md:border-r border-gray-200">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Número de Documento</label>
          <input 
            v-model="searchForm.numero" 
            type="text" 
            class="w-full border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg p-0 bg-transparent focus:outline-none"
            placeholder="Ej. 12345678"
            @keyup.enter="searchDocument"
          >
        </div>
        <div class="flex-1 w-full md:w-auto px-6 py-2 md:py-0">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Fecha de Emisión</label>
          <input 
            v-model="searchForm.fecha" 
            type="date" 
            class="w-full border-none focus:ring-0 text-gray-800 text-lg p-0 bg-transparent focus:outline-none"
             @keyup.enter="searchDocument"
          >
        </div>
        <button 
          @click="searchDocument" 
          :disabled="loading || !searchForm.numero || !searchForm.fecha"
          class="bg-blue-600 text-white rounded-full px-8 h-12 mt-2 md:mt-0 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200 shadow-md font-bold text-lg"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i v-else class="fas fa-search mr-2"></i>
          <span>Buscar</span>
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <transition name="fade">
      <div v-if="hasSearched" class="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start animate-fade-in-up">
        
        <!-- Status Card (Left Side) -->
        <div class="w-full lg:w-1/3">
             <div 
              class="rounded-3xl shadow-xl p-8 text-center border transition-all duration-300 transform hover:-translate-y-1 bg-white"
              :class="found ? 'border-green-100 ring-4 ring-green-50' : 'border-yellow-100 ring-4 ring-yellow-50'"
            >
                <div class="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner"
                     :class="found ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                    <i :class="['fas text-4xl', found ? 'fa-check-circle' : 'fa-search-minus']"></i>
                </div>
                
                <h2 class="text-2xl font-bold mb-3" :class="found ? 'text-green-800' : 'text-yellow-800'">
                    {{ found ? '¡Documento Encontrado!' : 'No Encontrado' }}
                </h2>
                
                <p class="text-gray-600 mb-8 leading-relaxed">
                    {{ found 
                        ? 'El documento existe en nuestros registros. Por favor, verifique los detalles a la derecha antes de confirmar.' 
                        : 'No encontramos registros con estos datos. Si tiene el documento físico, puede solicitar una validación manual llenando el formulario con los datos que poseea del documento.' 
                    }}
                </p>

                <div v-if="!found" class="bg-yellow-50 rounded-xl p-5 text-left text-sm text-yellow-800 border-l-4 border-yellow-400 shadow-sm">
                    <div class="flex items-start">
                         <i class="fas fa-info-circle mr-3 mt-1 text-yellow-600"></i>
                         <p>Asegúrese de que el número y la fecha sean correctos. Si el error persiste, ingrese los datos manualmente. Depende del tipo de docuemnto algunos campos quedaran vacios.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Details / Form Card (Right Side) -->
        <div class="w-full lg:w-2/3">
            <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                <!-- Decorative background blob -->
                <div class="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-50 opacity-50 blur-xl"></div>

                <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 relative z-10">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-file-alt mr-3 text-blue-500"></i>
                        {{ found ? 'Detalles del Documento' : 'Solicitud de Validación Manual' }}
                    </h3>
                    <span v-if="found" class="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Solo Lectura</span>
                    <span v-else class="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Edición Habilitada</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <!-- Read Only Fields (Found) or Inputs (Not Found) -->
                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
                         <div class="group">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Número</label>
                            <input v-model="form.numero" type="text" disabled class="block w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-gray-700 font-bold shadow-sm transition-all text-center">
                        </div>
                        <div class="group">
                             <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Fecha</label>
                            <input v-model="form.fecha" type="date" disabled class="block w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-gray-700 font-bold shadow-sm transition-all text-center">
                        </div>
                        <div class="group">
                             <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Monto Póliza</label>
                             <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold">Q</span>
                                <input v-model="form.monto_poliza" type="number" :disabled="found" 
                                    class="block w-full pl-8 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 font-semibold"
                                    :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                                    placeholder="0.00"
                                >
                             </div>
                        </div>
                    </div>

                    <!-- Owner & Authorizer -->
                    <div class="group">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Propietario</label>
                        <div class="relative">
                            <i class="fas fa-user absolute top-4 left-4 text-gray-300"></i>
                            <input v-model="form.propietario" type="text" :disabled="found" 
                                class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 font-medium"
                                :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                                placeholder="Nombre completo"
                            >
                        </div>
                    </div>
                    <div class="group">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Autorizador</label>
                        <div class="relative">
                             <i class="fas fa-user-tie absolute top-4 left-4 text-gray-300"></i>
                             <input v-model="form.autorizador" type="text" :disabled="found" 
                                class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 font-medium"
                                :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                                placeholder="Nombre del autorizador"
                            >
                        </div>
                    </div>

                    <!-- Location Data Grid -->
                    <div class="md:col-span-2 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <h4 class="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center">
                            <i class="fas fa-map-marker-alt mr-2"></i> Datos Registrales
                        </h4>
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div v-for="field in ['finca', 'folio', 'libro', 'no_dominio', 'referencia']" :key="field">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1 truncate">{{ field.replace('no_', '').replace('_', '. ') }}</label>
                                <input v-model="form[field === 'finca' ? 'no_finca' : field]" type="text" :disabled="found" 
                                    class="block w-full px-3 py-2 text-sm rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    :class="found ? 'bg-slate-100 text-slate-500 border-transparent' : 'bg-white shadow-sm'"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Document Type & Registry -->
                     <div class="group">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Tipo Documento</label>
                        <input v-model="form.tipo_documento" type="text" :disabled="found" 
                             class="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 font-medium"
                             :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                             placeholder="Escritura, Acta, etc."
                        >
                    </div>
                     <div class="group">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Registro Propiedad</label>
                        <input v-model="form.registro_propiedad" type="text" :disabled="found" 
                             class="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 font-medium"
                             :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                             placeholder="Registro General..."
                        >
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Observaciones</label>
                        <textarea v-model="form.observacion" rows="3" :disabled="found" 
                             class="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all duration-200 resize-none font-medium"
                             :class="found ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white shadow-sm'"
                             placeholder="Añada cualquier información adicional relevante..."
                        ></textarea>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                     <button 
                        @click="submitRequest" 
                        :disabled="loading"
                        class="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center w-full md:w-auto justify-center"
                    >
                        <span v-if="loading" class="flex items-center">
                            <i class="fas fa-spinner fa-spin mr-2"></i> Procesando...
                        </span>
                        <span v-else class="flex items-center">
                            <i class="fas fa-paper-plane mr-3"></i> 
                            Solicitar Confirmación
                        </span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const searchForm = ref({
    numero: '',
    fecha: ''
});

const form = ref({});
const found = ref(false);
const hasSearched = ref(false);
const loading = ref(false);

const searchDocument = async () => {
    loading.value = true;
    hasSearched.value = false;
    form.value = {}; // Reset form

    try {
        const response = await api.post('/confirmacion-documentos/search', searchForm.value);
        
        found.value = response.data.found;
        
        if (found.value) {
            if (response.data.multiple) {
                // Hay multiples, crear un select o mostrarlos en un SweetAlert custom HTML
                let optionsHtml = '';
                response.data.data.forEach((doc, index) => {
                    optionsHtml += `
                        <div class="p-3 border rounded-lg mb-2 text-left cursor-pointer hover:bg-blue-50 transition-colors bg-white ${index === 0 ? 'ring-2 ring-blue-500 bg-blue-50' : ''}" 
                             onclick="window.selectDocumentOption(${index})" id="doc-option-${index}">
                            <p class="font-bold text-slate-800"><i class="fas fa-file-alt mr-2 text-blue-500"></i>Doc: ${doc.numero}</p>
                            <p class="text-sm text-slate-600 mt-1"><i class="fas fa-user mr-2 text-slate-400"></i>Propietario: <span class="font-medium">${doc.propietario || 'Sin nombre'}</span></p>
                            <p class="text-sm text-slate-500"><i class="fas fa-money-check-alt mr-2 text-slate-400"></i>Monto: ${doc.monto_poliza || 'N/A'}</p>
                        </div>
                    `;
                });

                let selectedIndex = 0;
                window.selectDocumentOption = (index) => {
                    selectedIndex = index;
                    document.querySelectorAll('[id^="doc-option-"]').forEach(el => {
                        el.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    });
                    document.getElementById(`doc-option-${index}`).classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                };

                const { isConfirmed } = await Swal.fire({
                    title: 'Múltiples Documentos Encontrados',
                    html: `Hemos encontrado más de un documento con ese número y fecha. Por favor seleccione el correcto:<br><br>
                           <div class="max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-xl border">${optionsHtml}</div>`,
                    showCancelButton: true,
                    confirmButtonText: 'Seleccionar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3b82f6',
                    width: '600px',
                    didOpen: () => {
                         // Evitar focus default en enter
                    }
                });

                if (isConfirmed) {
                    const selectedDoc = response.data.data[selectedIndex];
                    form.value = { ...selectedDoc };
                    form.value.documento_id = selectedDoc.id;
                    hasSearched.value = true;
                } else {
                    hasSearched.value = false;
                    form.value = {};
                }
                
                // Limpiar la funcion global
                delete window.selectDocumentOption;

            } else {
                // Solo un resultado, comportamiento original
                const doc = response.data.data[0];
                form.value = { ...doc };
                form.value.documento_id = doc.id;
                hasSearched.value = true;
            }
        } else {
             // Populate form with search criteria to save manual entry
            form.value = {
                numero: searchForm.value.numero,
                fecha: searchForm.value.fecha,
            };
            hasSearched.value = true;
        }

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al buscar documento', 'error');
    } finally {
        loading.value = false;
    }
};

const submitRequest = async () => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Solicitar Confirmación?',
        text: found.value 
            ? 'Se enviará una solicitud para validar este documento existente.'
            : 'Se creará una solicitud de validación manual con los datos ingresados.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    });

    if (isConfirmed) {
        loading.value = true;
        try {
            await api.post('/confirmacion-documentos', form.value);
            
            await Swal.fire('Éxito', 'Solicitud enviada correctamente.', 'success');
            
            // Reset Flow
            hasSearched.value = false;
            searchForm.value = { numero: '', fecha: '' };
            form.value = {};

        } catch (error) {
             console.error(error);
             Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
