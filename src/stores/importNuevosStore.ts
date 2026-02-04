import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'
import Swal from 'sweetalert2'

export const useImportNuevosStore = defineStore('importNuevos', () => {
    const isUploading = ref(false)
    const isProcessing = ref(false)
    const progress = ref(0)
    const statusMessage = ref('')
    const status = ref<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle')
    const jobId = ref<string | null>(null)
    const pollInterval = ref<any>(null)

    // Widget State
    const isWidgetVisible = ref(false)
    const isWidgetMinimized = ref(false)

    const startImport = async (file: File) => {
        isUploading.value = true
        status.value = 'uploading'
        isWidgetVisible.value = true
        isWidgetMinimized.value = false
        progress.value = 0
        statusMessage.value = 'Subiendo archivo...'

        const formData = new FormData()
        formData.append('file', file)

        try {
            const { data } = await axios.post('/import-nuevos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (data.success) {
                jobId.value = data.jobId
                isUploading.value = false
                isProcessing.value = true
                status.value = 'processing'
                statusMessage.value = 'Procesando...'
                pollStatus()
            }
        } catch (error: any) {
            isUploading.value = false
            status.value = 'failed'
            isWidgetVisible.value = false
            Swal.fire('Error', error.response?.data?.message || 'Error al iniciar la carga', 'error')
        }
    }

    const pollStatus = () => {
        pollInterval.value = setInterval(async () => {
            if (!jobId.value) return

            try {
                const { data } = await axios.get(`/import-nuevos/status/${jobId.value}`)

                progress.value = data.progress
                statusMessage.value = data.message

                if (data.status === 'completed') {
                    stopPolling()
                    isProcessing.value = false
                    status.value = 'completed'
                    if (!isWidgetVisible.value) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: data.message,
                            toast: true,
                            timer: 3000,
                            position: 'top-end',
                            showConfirmButton: false
                        })
                    }

                    // Auto close widget after 10 seconds
                    setTimeout(() => {
                        isWidgetVisible.value = false
                        status.value = 'idle'
                    }, 10000)

                } else if (data.status === 'failed') {
                    stopPolling()
                    isProcessing.value = false
                    status.value = 'failed'
                    Swal.fire('Error', data.message, 'error')
                } else {
                    status.value = data.status || 'processing'
                }

            } catch (error) {
                stopPolling()
                isProcessing.value = false
                status.value = 'failed'
            }
        }, 2000)
    }

    const stopPolling = () => {
        if (pollInterval.value) clearInterval(pollInterval.value)
        pollInterval.value = null
    }

    const toggleMinimize = () => {
        isWidgetMinimized.value = !isWidgetMinimized.value
    }

    const closeWidget = () => {
        if (isProcessing.value) {
            isWidgetVisible.value = false
            Swal.fire({
                icon: 'info',
                title: 'Ejecutando en segundo plano',
                text: 'Te avisaremos cuando termine.',
                toast: true,
                position: 'bottom-end',
                timer: 2000,
                showConfirmButton: false
            })
        } else {
            isWidgetVisible.value = false
            progress.value = 0
            statusMessage.value = ''
        }
    }

    return {
        isUploading,
        isProcessing,
        status,
        progress,
        statusMessage,
        isWidgetVisible,
        isWidgetMinimized,
        startImport,
        toggleMinimize,
        closeWidget
    }
})
