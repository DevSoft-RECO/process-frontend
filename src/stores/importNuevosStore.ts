import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'
import Swal from 'sweetalert2'

export const useImportNuevosStore = defineStore('importNuevos', () => {
    const isUploading = ref(false)
    const progress = ref(0)
    const statusMessage = ref('')
    const jobId = ref<string | null>(null)
    const pollInterval = ref<any>(null)

    const startImport = async (file: File) => {
        isUploading.value = true
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
                pollStatus()
            }
        } catch (error: any) {
            isUploading.value = false
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
                    isUploading.value = false
                    Swal.fire('Éxito', data.message, 'success')
                } else if (data.status === 'failed') {
                    stopPolling()
                    isUploading.value = false
                    Swal.fire('Error', data.message, 'error')
                }

            } catch (error) {
                stopPolling()
                isUploading.value = false
            }
        }, 2000)
    }

    const stopPolling = () => {
        if (pollInterval.value) clearInterval(pollInterval.value)
        pollInterval.value = null
    }

    return {
        isUploading,
        progress,
        statusMessage,
        startImport
    }
})
