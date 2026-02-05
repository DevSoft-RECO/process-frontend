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
                path: 'consultas/busqueda-cliente',
                name: 'admin-busqueda-cliente',
                component: () => import('@/views/consultas/BusquedaClienteView.vue'),
                meta: {
                    title: 'Búsqueda de Cliente'
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
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: {
                    title: 'Gestiones'
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
            const motherAppUrl =
                import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'

            console.warn(
                `⛔ Acceso denegado: Usuario no tiene el permiso '${to.meta.permission}'.`
            )

            // window.location.href = `${motherAppUrl}/apps`
            return false
        }

        // Verificar rol
        if (to.meta.role && !authStore.hasRole(to.meta.role)) {
            const motherAppUrl =
                import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'

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
