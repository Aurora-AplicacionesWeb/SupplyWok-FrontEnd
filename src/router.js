import { createRouter, createWebHistory } from 'vue-router';
import restaurantManagementRoutes from './restaurant-management/presentation/restaurant-management-routes.js';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management-routes.js';
import { useIamStore } from './iam/application/iam-store.js';
import useSessionStore from './shared/application/session.store.js';
import { getHomeByRole, getRoleFromPath, getScopedPathByRole, normalizeRole } from './shared/application/role-routing.js';

const placeholderPage = () => import('./shared/presentation/views/placeholder-page.vue');
const reportsPage = () => import('./shared/presentation/views/reports-page.vue');
const configurationPage = () => import('./shared/presentation/views/configuration-page.vue');
const subscriptionPage = () => import('./shared/presentation/views/subscription-page.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const alertsPage = () => import('./iot-monitoring/presentation/views/alerts-view.vue');

/**
 * Resolves the best available active role from IAM or the lightweight session store.
 *
 * @returns {string}
 */
function getActiveRole() {
    const iamStore = useIamStore();
    const sessionStore = useSessionStore();

    return normalizeRole(iamStore.currentUserRole) ?? normalizeRole(sessionStore.userRole) ?? 'restaurant';
}

/**
 * Prefixes child-like route definitions with an absolute role scope.
 *
 * @param {import('vue-router').RouteRecordRaw[]} routes
 * @param {string} prefix
 * @returns {import('vue-router').RouteRecordRaw[]}
 */
function scopeRoutes(routes, prefix) {
    return routes.map((route) => ({
        ...route,
        path: `${prefix}/${route.path}`
    }));
}

const restaurantScopedRoutes = [
    {
        path: '/restaurant/dashboard',
        name: 'restaurant-dashboard',
        component: placeholderPage,
        meta: { title: 'Dashboard', role: 'restaurant', isDashboard: true }
    },
    {
        path: '/restaurant/alerts',
        name: 'restaurant-alerts',
        component: alertsPage,
        meta: { title: 'Alerts', role: 'restaurant' }
    },
    {
        path: '/restaurant/reports',
        name: 'restaurant-reports',
        component: reportsPage,
        meta: { title: 'Reports', role: 'restaurant' }
    },
    {
        path: '/restaurant/configuration',
        name: 'restaurant-configuration',
        component: configurationPage,
        meta: { title: 'Configuration', role: 'restaurant' }
    },
    {
        path: '/restaurant/subscription',
        name: 'restaurant-subscription',
        component: subscriptionPage,
        meta: { title: 'Subscription', role: 'restaurant' }
    },
    ...scopeRoutes(
        restaurantManagementRoutes.filter((route) => !['dashboard', 'alerts', 'reports', 'configuration', 'subscription'].includes(route.path)),
        '/restaurant'
    ),
    ...scopeRoutes(inventoryManagementRoutes, '/restaurant'),
    ...scopeRoutes(supplyAndPurchasingRoutes, '/restaurant')
];

const supplierScopedRoutes = [
    {
        path: '/supplier/dashboard',
        name: 'supplier-dashboard',
        component: placeholderPage,
        meta: { title: 'Dashboard', role: 'supplier', isDashboard: true }
    },
    {
        path: '/supplier/orders',
        name: 'supplier-orders',
        component: placeholderPage,
        meta: { title: 'Orders', role: 'supplier' }
    },
    {
        path: '/supplier/clients',
        name: 'supplier-clients',
        component: placeholderPage,
        meta: { title: 'Clients', role: 'supplier' }
    },
    {
        path: '/supplier/delivery',
        name: 'supplier-delivery',
        component: placeholderPage,
        meta: { title: 'Delivery', role: 'supplier' }
    },
    {
        path: '/supplier/forecast',
        name: 'supplier-forecast',
        component: placeholderPage,
        meta: { title: 'Forecast', role: 'supplier' }
    },
    {
        path: '/supplier/catalog',
        name: 'supplier-catalog',
        component: placeholderPage,
        meta: { title: 'Catalog', role: 'supplier' }
    },
    {
        path: '/supplier/alerts',
        name: 'supplier-alerts',
        component: placeholderPage,
        meta: { title: 'Alerts', role: 'supplier' }
    },
    {
        path: '/supplier/configuration',
        name: 'supplier-configuration',
        component: placeholderPage,
        meta: { title: 'Configuration', role: 'supplier' }
    },
    {
        path: '/supplier/subscription',
        name: 'supplier-subscription',
        component: placeholderPage,
        meta: { title: 'Subscription', role: 'supplier' }
    }
];

const legacyRedirectRoutes = [
    { path: '/dashboard', name: 'dashboard', redirect: () => getHomeByRole(getActiveRole()) },
    { path: '/alerts', name: 'alerts', redirect: () => getScopedPathByRole(getActiveRole(), 'alerts') },
    { path: '/reports', name: 'reports', redirect: () => getScopedPathByRole(getActiveRole(), 'reports') },
    { path: '/configuration', name: 'configuration', redirect: () => getScopedPathByRole(getActiveRole(), 'configuration') },
    { path: '/subscription', name: 'subscription', redirect: () => getScopedPathByRole(getActiveRole(), 'subscription') },
    { path: '/inventory', name: 'inventory', redirect: () => getScopedPathByRole(getActiveRole(), 'inventory') },
    { path: '/orders', name: 'orders', redirect: () => getScopedPathByRole(getActiveRole(), 'orders') },
    { path: '/orders/new', name: 'orders-new', redirect: () => `${getScopedPathByRole(getActiveRole(), 'orders')}/new` },
    { path: '/suppliers', name: 'suppliers', redirect: () => getScopedPathByRole(getActiveRole(), 'suppliers') }
];

const loginPage = () => import('./iam/presentation/views/login-view.vue');
const registerPage = () => import('./iam/presentation/views/register-view.vue');

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: loginPage, meta: { title: 'Log in' } },
    { path: '/register', name: 'register', component: registerPage, meta: { title: 'Register' } },
    ...legacyRedirectRoutes,
    ...restaurantScopedRoutes,
    ...supplierScopedRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

/**
 * Updates document metadata and prevents navigating into another role's scope.
 *
 * @param {import('vue-router').RouteLocationNormalized} to
 * @param {import('vue-router').RouteLocationNormalized} from
 * @param {import('vue-router').NavigationGuardNext} next
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    const baseTitle = 'SupplyWok';
    document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle;

    const currentRole = getActiveRole();
    const requiredRole = getRoleFromPath(to.path);

    if (currentRole && requiredRole && currentRole !== requiredRole) {
        return next(getHomeByRole(currentRole));
    }

    return next();
});

export default router;
