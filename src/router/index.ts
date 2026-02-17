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
            permission: 'app_gestiones'
        },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: {
                    title: 'SADEC'
                }
            },
            {
                path: 'carga-datos/clientes',
                name: 'admin-carga-clientes',
                component: () => import('@/views/carga-datos/ExpedientesHistoricosImportView.vue'),
                meta: {
                    title: 'Carga de Expedientes Históricos'
                }
            },
            {
                path: 'carga-datos/nuevos-expedientes',
                name: 'admin-carga-nuevos-expedientes',
                component: () => import('@/views/carga-datos/NuevosExpedientesImportView.vue'),
                meta: {
                    title: 'Carga Histórica / Nuevos'
                }
            },
            {
                path: 'consultas/expedientes',
                name: 'admin-consultas-expedientes',
                component: () => import('@/views/consultas/ExpedientesHistoricosView.vue'),
                meta: {
                    title: 'Listado de Expedientes Históricos'
                }
            },
            {
                path: 'consultas/mis-expedientes',
                name: 'admin-consultas-mis-expedientes',
                component: () => import('@/views/consultas/MisExpedientesView.vue'),
                meta: {
                    title: 'Mis Expedientes (Nuevos)'
                }
            },
            {
                path: 'catalogos/garantias',
                name: 'admin-catalogos-garantias',
                component: () => import('@/views/catalogos/GarantiasView.vue'),
                meta: {
                    title: 'Catálogo de Garantías'
                }
            },
            {
                path: 'catalogos/tipo-documentos',
                name: 'admin-catalogos-tipo-documentos',
                component: () => import('@/views/catalogos/TipoDocumentosView.vue'),
                meta: {
                    title: 'Catálogo de Tipo Documentos'
                }
            },
            {
                path: 'catalogos/agencias',
                name: 'admin-catalogos-agencias',
                component: () => import('@/views/catalogos/AgenciasView.vue'),
                meta: {
                    title: 'Sincronización de Agencias'
                }
            },
            {
                path: 'catalogos/bufetes',
                name: 'admin-catalogos-bufetes',
                component: () => import('@/views/catalogos/BufetesView.vue'),
                meta: {
                    title: 'Catálogo de Bufetes'
                }
            },
            {
                path: 'catalogos/registros-propiedad',
                name: 'admin-catalogos-registros-propiedad',
                component: () => import('@/views/catalogos/RegistrosPropiedadView.vue'),
                meta: {
                    title: 'Registros de Propiedad'
                }
            },
            {
                path: 'catalogos/tipo-estados',
                name: 'admin-catalogos-tipo-estados',
                component: () => import('@/views/catalogos/TipoEstadosView.vue'),
                meta: {
                    title: 'Tipos de Estado'
                }
            },
            {
                path: 'tracking/secretaria-agencia',
                name: 'admin-tracking-secretaria',
                component: () => import('@/views/tracking/SecretariaAgenciaView.vue'),
                meta: {
                    title: 'Buzón Secretaría Agencia'
                }
            },
            {
                path: 'tracking/secretaria-edicion',
                name: 'admin-tracking-secretaria-edicion',
                component: () => import('@/views/editar_expedientes/SecretariaEdicionView.vue'),
                meta: {
                    title: 'Edición de Expedientes'
                }
            },
            {
                path: 'secretaria-credito/edicion',
                name: 'secretaria-credito-edicion',
                component: () => import('@/views/editar_expedientes/SecretariaCreditosEdicionView.vue'),
                meta: {
                    title: 'Edición Créditos'
                }
            },
            {
                path: 'archivo/edicion',
                name: 'archivo-edicion',
                component: () => import('@/views/editar_expedientes/ArchivoEdicionView.vue'),
                meta: {
                    title: 'Edición Archivo'
                }
            },
            {
                path: 'tracking/secretaria-agencia/archivados',
                name: 'admin-tracking-secretaria-archivados',
                component: () => import('@/views/tracking/SecretariaAgenciaArchivadosView.vue'),
                meta: {
                    title: 'Archivados Administrativamente'
                }
            },
            {
                path: 'secretaria-credito/buzon-entrantes',
                name: 'secretaria-credito-buzon',
                component: () => import('@/views/secretaria-credito/BuzonEntrantesView.vue'),
                meta: {
                    title: 'Buzón Entrantes Crédito'
                }
            },
            {
                path: 'secretaria-credito/buzon-aceptados',
                name: 'secretaria-credito-buzon-aceptados',
                component: () => import('@/views/secretaria-credito/BuzonAceptadosView.vue'),
                meta: {
                    title: 'Buzón Aceptados Crédito'
                }
            },
            {
                path: 'secretaria-credito/buzon-completados',
                name: 'secretaria-credito-buzon-completados',
                component: () => import('@/views/secretaria-credito/BuzonCompletadosView.vue'),
                meta: {
                    title: 'Buzón Completados Crédito'
                }
            },
            {
                path: 'secretaria-credito/buzon-abogados',
                name: 'secretaria-credito-buzon-abogados',
                component: () => import('@/views/secretaria-credito/BuzonAbogadosView.vue'),
                meta: {
                    title: 'Enviado a Abogados'
                }
            },
            {
                path: 'secretaria-credito/escanear-documentos',
                name: 'secretaria-credito-escanear-documentos',
                component: () => import('@/views/secretaria-credito/EscanearDocumentosView.vue'),
                meta: {
                    title: 'Escanear Documentos'
                }
            },
            {
                path: 'abogado/buzon',
                name: 'buzon-abogado',
                component: () => import('@/views/abogado/BuzonAbogadoView.vue'),
                meta: {
                    title: 'Bandeja de Abogado'
                }
            },
            {
                path: 'abogado/devueltos',
                name: 'abogado-devueltos',
                component: () => import('@/views/abogado/BuzonAbogadoDevueltosView.vue'),
                meta: {
                    title: 'Devueltos a Secretaría'
                }
            },
            {
                path: 'archivo/buzon-recibidos',
                name: 'archivo-buzon-recibidos',
                component: () => import('@/views/archivo/BuzonRecibidosView.vue'),
                meta: {
                    title: 'Buzón Recibidos (Archivo)'
                }
            },
            {
                path: 'archivo/sistema',
                name: 'archivo-sistema',
                component: () => import('@/views/archivo/ArchivoSistemaView.vue'),
                meta: {
                    title: 'Archivo Sistema'
                }
            },
            {
                path: 'archivo/historico',
                name: 'archivo-historico',
                component: () => import('@/views/archivo/ArchivoHistoricoView.vue'),
                meta: {
                    title: 'Archivo Histórico'
                }
            },

            // Asesores de Crédito
            {
                path: 'asesores/nuevos',
                name: 'asesores-nuevos',
                component: () => import('@/views/asesores-creditos/NuevosPendientesView.vue'),
                meta: {
                    title: 'Nuevos / Pendientes'
                }
            },
            {
                path: 'asesores/finalizados',
                name: 'asesores-finalizados',
                component: () => import('@/views/asesores-creditos/FinalizadosView.vue'),
                meta: {
                    title: 'Finalizados (Histórico)'
                }
            },
            {
                path: 'asesores/seguimiento',
                name: 'asesores-seguimiento',
                component: () => import('@/views/asesores-creditos/EnSeguimientoView.vue'),
                meta: {
                    title: 'En Seguimiento'
                }
            },
            {
                path: 'asesores/retornados',
                name: 'asesores-retornados',
                component: () => import('@/views/asesores-creditos/RetornadosView.vue'),
                meta: {
                    title: 'Retornados'
                }
            },
            {
                path: 'configuracion/traslado-expedientes',
                name: 'admin-traslado-expedientes',
                component: () => import('@/views/admin/configuracion/TrasladoExpedientesView.vue'),
                meta: {
                    title: 'Traslado de Expedientes/Cartera'
                }
            },
            {
                path: 'configuracion/editar-seguimiento',
                name: 'admin-editar-seguimiento',
                component: () => import('@/views/admin/configuracion/EditarSeguimientoView.vue'),
                meta: {
                    title: 'Editar Seguimiento (Admin)'
                }
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

        // Verificar permiso
        if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {


            console.warn(
                `⛔ Acceso denegado: Usuario no tiene el permiso '${to.meta.permission}'.`
            )

            // window.location.href = `${motherAppUrl}/apps`
            return false
        }

        // Verificar rol
        if (to.meta.role && !authStore.hasRole(to.meta.role)) {


            console.warn(
                `⛔ Acceso denegado: Usuario no tiene el rol '${to.meta.role}'.`
            )

            // window.location.href = `${motherAppUrl}/apps`
            return false
        }
    }

    return true
})

export default router
