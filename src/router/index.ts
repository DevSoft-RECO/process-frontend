import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'

// Vistas
import CallbackView from '@/views/CallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const routes: RouteRecordRaw[] = [
    // 1. RUTAS PÚBLICAS
    {
        path: '/',
        redirect: '/admin/dashboard'
    },
    {
        path: '/callback',
        name: 'callback',
        component: CallbackView
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: UnauthorizedView
    },

    // 2. RUTAS PROTEGIDAS
    {
        path: '/admin',
        component: AdminLayout,
        meta: {
            requiresAuth: true,
            permission: 'app_sadec'
        },
        children: [
            // ==========================================
            // DASHBOARD
            // ==========================================
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: { title: 'SADEC' }
            },

            // ==========================================
            // MÓDULO: ASESORES DE CRÉDITOS
            // ==========================================
            {
                path: 'asesores/nuevos',
                name: 'admin-asesores-nuevos',
                component: () => import('@/views/asesores-creditos/NuevosPendientesView.vue'),
                meta: { title: 'Cargados / Pendientes', permission: 'asesores_credito' }
            },
            {
                path: 'asesores/seguimiento',
                name: 'admin-asesores-seguimiento',
                component: () => import('@/views/asesores-creditos/EnSeguimientoView.vue'),
                meta: { title: 'En Seguimiento', permission: 'asesores_credito' }
            },
            {
                path: 'asesores/retornados',
                name: 'admin-asesores-retornados',
                component: () => import('@/views/asesores-creditos/RetornadosView.vue'),
                meta: { title: 'Retornados', permission: 'asesores_credito' }
            },
            {
                path: 'asesores/finalizados',
                name: 'admin-asesores-finalizados',
                component: () => import('@/views/asesores-creditos/FinalizadosView.vue'),
                meta: { title: 'Finalizados (Histórico)', permission: 'asesores_credito' }
            },
            {
                path: 'consultas/expedientes',
                name: 'admin-consultas-expedientes',
                component: () => import('@/views/consultas/ExpedientesHistoricosView.vue'),
                meta: { title: 'Listado Histórico', permission: 'asesores_credito' }
            },

            // ==========================================
            // MÓDULO: BUZÓN SECRE. AGENCIA
            // ==========================================
            {
                path: 'tracking/secretaria-agencia',
                name: 'admin-tracking-secretaria',
                component: () => import('@/views/tracking/SecretariaAgenciaView.vue'),
                meta: { title: 'Bandeja Principal', permission: 'secretaria_agencia' }
            },
            {
                path: 'tracking/secretaria-edicion',
                name: 'admin-tracking-secretaria-edicion',
                component: () => import('@/views/editar_expedientes/SecretariaEdicionView.vue'),
                meta: { title: 'Edición de Expedientes', permission: 'secretaria_agencia' }
            },
            {
                path: 'tracking/secretaria-agencia/archivados',
                name: 'admin-tracking-secretaria-archivados',
                component: () => import('@/views/tracking/SecretariaAgenciaArchivadosView.vue'),
                meta: { title: 'Archivados Administrativamente', permission: 'secretaria_agencia' }
            },

            // ==========================================
            // MÓDULO: BUZÓN SECRE. CRÉDITOS
            // ==========================================
            {
                path: 'secretaria-credito/buzon-entrantes',
                name: 'secretaria-credito-buzon',
                component: () => import('@/views/secretaria-credito/BuzonEntrantesView.vue'),
                meta: { title: 'Buzón Entrantes', permission: 'secretaria_credito' }
            },
            {
                path: 'secretaria-credito/buzon-aceptados',
                name: 'secretaria-credito-buzon-aceptados',
                component: () => import('@/views/secretaria-credito/BuzonAceptadosView.vue'),
                meta: { title: 'Buzón Aceptados', permission: 'secretaria_credito' }
            },
            {
                path: 'secretaria-credito/buzon-abogados',
                name: 'secretaria-credito-buzon-abogados',
                component: () => import('@/views/secretaria-credito/BuzonAbogadosView.vue'),
                meta: { title: 'Enviado a Abogados', permission: 'secretaria_credito' }
            },
            {
                path: 'secretaria-credito/escanear-documentos',
                name: 'secretaria-credito-escanear-documentos',
                component: () => import('@/views/secretaria-credito/EscanearDocumentosView.vue'),
                meta: { title: 'Escanear Documentos', permission: 'secretaria_credito' }
            },
            {
                path: 'secretaria-credito/buzon-completados',
                name: 'secretaria-credito-buzon-completados',
                component: () => import('@/views/secretaria-credito/BuzonCompletadosView.vue'),
                meta: { title: 'Buzón Completados', permission: 'secretaria_credito' }
            },
            {
                path: 'secretaria-credito/edicion',
                name: 'secretaria-credito-edicion',
                component: () => import('@/views/editar_expedientes/SecretariaCreditosEdicionView.vue'),
                meta: { title: 'Edición de Expedientes', permission: 'secretaria_credito' }
            },

            // ==========================================
            // MÓDULO: BUZÓN ABOGADO
            // ==========================================
            {
                path: 'abogado/buzon',
                name: 'buzon-abogado',
                component: () => import('@/views/abogado/BuzonAbogadoView.vue'),
                meta: { title: 'Bandeja de Entrada', permission: 'abogado' }
            },
            {
                path: 'abogado/devueltos',
                name: 'abogado-devueltos',
                component: () => import('@/views/abogado/BuzonAbogadoDevueltosView.vue'),
                meta: { title: 'Devueltos a Secretaría', permission: 'abogado' }
            },

            // ==========================================
            // MÓDULO: ARCHIVO
            // ==========================================
            {
                path: 'archivo/buzon-recibidos',
                name: 'archivo-buzon-recibidos',
                component: () => import('@/views/archivo/BuzonRecibidosView.vue'),
                meta: { title: 'Buzón Recibidos', permission: 'archivo' }
            },
            {
                path: 'archivo/sistema',
                name: 'archivo-sistema',
                component: () => import('@/views/archivo/ArchivoSistemaView.vue'),
                meta: { title: 'Archivo Sistema', permission: 'archivo' }
            },
            {
                path: 'archivo/historico',
                name: 'archivo-historico',
                component: () => import('@/views/archivo/ArchivoHistoricoView.vue'),
                meta: { title: 'Archivo Histórico', permission: 'archivo' }
            },
            {
                path: 'archivo/edicion',
                name: 'archivo-edicion',
                component: () => import('@/views/editar_expedientes/ArchivoEdicionView.vue'),
                meta: { title: 'Edición de Expedientes', permission: 'archivo' }
            },

            // ==========================================
            // MÓDULO: CONFIRMACIÓN DOCUMENTOS 
            // ==========================================
            {
                path: 'confirmacion-documentos/solicitud',
                name: 'admin-confirmacion-solicitud',
                component: () => import('@/views/confirmacion-documentos/solicitud/SolicitudConfirmacionView.vue'),
                meta: { title: 'Nueva Solicitud Confirmación', permission: 'confirmar_documentos' }
            },
            {
                path: 'confirmacion-documentos/resultados',
                name: 'admin-confirmacion-resultados',
                component: () => import('@/views/confirmacion-documentos/solicitud/ResultadosConfirmacionView.vue'),
                meta: { title: 'Resultados de Confirmación', permission: 'confirmar_documentos' }
            },
            {
                path: 'confirmacion-documentos/buzon',
                name: 'admin-confirmacion-buzon',
                component: () => import('@/views/confirmacion-documentos/validacion/BuzonConfirmacionesView.vue'),
                meta: { title: 'Buzón Validar Confirmación', permission: 'archivo' }
            },
            {
                path: 'confirmacion-documentos/historico',
                name: 'admin-confirmacion-historico',
                component: () => import('@/views/confirmacion-documentos/validacion/HistoricoConfirmacionesView.vue'),
                meta: { title: 'Histórico de Validaciones', permission: 'archivo' }
            },

            // ==========================================
            // MÓDULO: RETIRO DE GARANTÍAS
            // ==========================================
            {
                path: 'retiro-garantias/buzon',
                name: 'retiro-garantias-buzon',
                component: () => import('@/views/retiro-garantias/validacion/BuzonSolicitudesView.vue'),
                meta: { title: 'Buzón Solicitudes Archivo', permission: 'retiro_garantias' }
            },
            {
                path: 'retiro-garantias/historico-general',
                name: 'retiro-garantias-historico-general',
                component: () => import('@/views/retiro-garantias/validacion/BuzonHistoricoGeneralView.vue'),
                meta: { title: 'Histórico General Garantías', permission: 'retiro_garantias' }
            },
            {
                path: 'retiro-garantias/solicitar',
                name: 'retiro-garantias-solicitar',
                component: () => import('@/views/retiro-garantias/solicitud/SolicitudRetiroView.vue'),
                meta: { title: 'Solicitar Retiro', permission: 'archivo' }
            },
            {
                path: 'retiro-garantias/entrega',
                name: 'retiro-garantias-entrega',
                component: () => import('@/views/retiro-garantias/validacion/EntregaGarantiasView.vue'),
                meta: { title: 'Entrega de Garantías', permission: 'archivo' }
            },
            {
                path: 'retiro-garantias/entregadas',
                name: 'retiro-garantias-entregadas',
                component: () => import('@/views/retiro-garantias/validacion/BuzonEntregasView.vue'),
                meta: { title: 'Buzón Entregas', permission: 'archivo' }
            },
            {
                path: 'retiro-garantias/historico-cliente',
                name: 'retiro-garantias-historico-cliente',
                component: () => import('@/views/retiro-garantias/solicitud/SolicitudRetiroHistoricoClienteView.vue'),
                meta: { title: 'Histórico Realizadas', permission: 'archivo' }
            },

            // ==========================================
            // MÓDULO: RETIRO DOC ADMINISTRATIVO
            // ==========================================
            {
                path: 'retiro-administrativo/usuario/solicitar',
                name: 'retiro-administrativo-solicitar',
                component: () => import('@/views/retiro-administrativo/usuario/SolicitarRetiroAdminView.vue'),
                meta: { title: 'Solicitar Retiro Administrativo', permission: 'retiro_doc_administrativo' }
            },
            {
                path: 'retiro-administrativo/admin/despacho',
                name: 'retiro-administrativo-despacho',
                component: () => import('@/views/retiro-administrativo/admin/DespachoRetiroAdminView.vue'),
                meta: { title: 'Despacho Doc. Administrativo', permission: 'secretaria_agencia' }
            },

            // ==========================================
            // MÓDULO: AJUSTES (Carga de Datos)
            // ==========================================
            {
                path: 'carga-datos/clientes',
                name: 'admin-carga-clientes',
                component: () => import('@/views/carga-datos/ExpedientesHistoricosImportView.vue'),
                meta: { title: 'Expedientes Históricos' }
            },
            {
                path: 'carga-datos/nuevos-expedientes',
                name: 'admin-carga-nuevos-expedientes',
                component: () => import('@/views/carga-datos/NuevosExpedientesImportView.vue'),
                meta: { title: 'Cargar Expedientes' }
            },

            // ==========================================
            // MÓDULO: CONFIGURACIONES (CATÁLOGOS)
            // ==========================================
            {
                path: 'catalogos/garantias',
                name: 'admin-catalogos-garantias',
                component: () => import('@/views/catalogos/GarantiasView.vue'),
                meta: { title: 'Catálogo de Garantías', permission: 'ajustes' }
            },
            {
                path: 'catalogos/tipo-documentos',
                name: 'admin-catalogos-tipo-documentos',
                component: () => import('@/views/catalogos/TipoDocumentosView.vue'),
                meta: { title: 'Catálogo de Tipo Documentos', permission: 'ajustes' }
            },
            {
                path: 'catalogos/agencias',
                name: 'admin-catalogos-agencias',
                component: () => import('@/views/catalogos/AgenciasView.vue'),
                meta: { title: 'Agencias' }
            },
            {
                path: 'catalogos/bufetes',
                name: 'admin-catalogos-bufetes',
                component: () => import('@/views/catalogos/BufetesView.vue'),
                meta: { title: 'Catálogo de Bufetes', permission: 'ajustes' }
            },
            {
                path: 'catalogos/registros-propiedad',
                name: 'admin-catalogos-registros-propiedad',
                component: () => import('@/views/catalogos/RegistrosPropiedadView.vue'),
                meta: { title: 'Registros de Propiedad', permission: 'ajustes' }
            },
            {
                path: 'catalogos/tipo-estados',
                name: 'admin-catalogos-tipo-estados',
                component: () => import('@/views/catalogos/TipoEstadosView.vue'),
                meta: { title: 'Tipos de Estado' }
            },
            {
                path: 'configuracion/traslado-expedientes',
                name: 'admin-traslado-expedientes',
                component: () => import('@/views/admin/configuracion/TrasladoExpedientesView.vue'),
                meta: { title: 'Traslado de Expedientes' }
            },
            {
                path: 'configuracion/editar-seguimiento',
                name: 'admin-editar-seguimiento',
                component: () => import('@/views/admin/configuracion/EditarSeguimientoView.vue'),
                meta: { title: 'Editar Seguimiento' }
            },
            {
                path: 'configuracion/editar-garantias',
                name: 'admin-editar-garantias',
                component: () => import('@/views/admin/configuracion/EditarGarantiasView.vue'),
                meta: { title: 'Editar Garantías' }
            },
            {
                path: 'configuracion/editar-detalle-garantia',
                name: 'admin-editar-detalle-garantia',
                component: () => import('@/views/admin/configuracion/EditarDetalleGarantiaView.vue'),
                meta: { title: 'Editar Detalles de Garantía' }
            },
            {
                path: 'configuracion/editar-nuevo-expediente',
                name: 'admin-editar-nuevo-expediente',
                component: () => import('@/views/admin/configuracion/EditarNuevoExpedienteView.vue'),
                meta: { title: 'Editar Nuevo Expediente' }
            },
            {
                path: 'configuracion/editar-solicitud-administrativa',
                name: 'admin-editar-solicitud-administrativa',
                component: () => import('@/views/admin/configuracion/EditarSolicitudAdministrativaView.vue'),
                meta: { title: 'Editar Solicitud Administrativa' }
            },

            // ==========================================
            // MÓDULO: REPORTES
            // ==========================================
            {
                path: 'reportes',
                name: 'admin-reportes',
                component: () => import('@/views/reportes/ReportesView.vue'),
                meta: { title: 'Reportes y Analítica' }
            }
        ]
    },

    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// --- GUARDIA DE NAVEGACIÓN ---
router.beforeEach(async (to, _from) => {
    const authStore = useAuthStore()

    // 0. Callback o Unauthorized → siempre pasar
    if (to.name === 'callback' || to.name === 'unauthorized') {
        return true
    }

    const isAuthenticated = !!authStore.token

    // Caso 1: Ruta protegida sin token
    if (to.matched.some(record => record.meta.requiresAuth) || to.path === '/') {
        if (!isAuthenticated) {
            console.log('🔒 Acceso Hija: Usuario sin sesión. Iniciando flujo SSO...')
            authStore.login()
            return false
        }
    }

    // Caso 2: Usuario autenticado
    if (isAuthenticated) {
        if (!authStore.isReady) {
            try {
                await authStore.fetchUser()
            } catch {
                return false
            }
        }

        // Helper de permisos combinados (A || B)
        const hasRequiredPermission = (permStr: string) => {
            if (!permStr) return false
            if (permStr.includes('||')) {
                return permStr.split('||').some(p => authStore.hasPermission(p.trim()))
            }
            return authStore.hasPermission(permStr)
        }

        const isSuperAdmin = authStore.hasRole('Super Admin');
        const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || '';

        // 1) Verificamos cadena de permisos anidados (ej. /admin exige 'app_sadec', /ruta_hija exige otro)
        if (!isSuperAdmin) {
            for (const record of to.matched) {
                if (record.meta.permission) {
                    const requiredPerm = record.meta.permission as string;
                    if (!hasRequiredPermission(requiredPerm)) {
                        console.warn(`⛔ Acceso denegado: Usuario carece del permiso jerárquico '${requiredPerm}'.`)
                        window.location.href = `${motherAppUrl}/apps`
                        return false
                    }
                }

                // 2) Verificamos cadena de roles
                if (record.meta.role) {
                    const requiredRole = record.meta.role as string;
                    if (!authStore.hasRole(requiredRole)) {
                        console.warn(`⛔ Acceso denegado: Usuario carece del rol '${requiredRole}'.`)
                        window.location.href = `${motherAppUrl}/apps`
                        return false
                    }
                }
            }
        }
    }

    return true
})

export default router
