import api from '@/api/axios'

interface KpiData {
    total_active: number
    total_finalized: number
    total_amount: number
    avg_days_open: number
}

interface PipelineData {
    state_name: string
    count: number
}

interface AdvisorData {
    data: {
        asesor: string
        active_cases: number
        rejected_cases: number
        total_cases: number
        rejection_rate: number
        success_rate: number
    }[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

interface RejectionData {
    asesor: string
    agencia: string
    rejections: number
}

interface AgencyData {
    data: {
        agency: string
        active: number
        rejected_cases: number
        total: number
        rejection_rate: number
        success_rate: number
    }[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

interface TrendData {
    month: string
    created: number
    finalized: number
}

export default {
    async getKpi(): Promise<KpiData> {
        const res = await api.get('/dashboard/kpi')
        return res.data
    },
    async getPipeline(): Promise<PipelineData[]> {
        const res = await api.get('/dashboard/pipeline')
        return res.data
    },
    async getAdvisors(page = 1, agencyId?: number | null): Promise<AdvisorData> {
        let url = `/dashboard/advisors?page=${page}`
        if (agencyId) {
            url += `&agency_id=${agencyId}`
        }
        const res = await api.get(url)
        return res.data
    },
    async getRejections(): Promise<RejectionData[]> {
        const res = await api.get('/dashboard/rejections')
        return res.data
    },
    async getAgencies(page = 1): Promise<AgencyData> {
        const res = await api.get(`/dashboard/agencies?page=${page}`)
        return res.data
    },
    async getAgenciesList(): Promise<{ id: number, nombre: string }[]> {
        const res = await api.get('/dashboard/agencies-list')
        return res.data
    },
    async getTrends(): Promise<TrendData[]> {
        const res = await api.get('/dashboard/trends')
        return res.data
    },
    async getProcessingTimes(): Promise<any> {
        const res = await api.get('/dashboard/processing-times')
        return res.data
    }
}
