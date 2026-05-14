import { createRouter, createWebHistory } from 'vue-router';
import restaurantManagementRoutes from './restaurant-management/presentation/restaurant-management-routes.js';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';
import supplyManagementRoutes from './supply-management/presentation/supply-management-routes.js';
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

    return normalizeRole(iamStore.currentUserRole) ?? normalizeRole(sessionStore.userRole);
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

const restaurantRoutes = [
    ...restaurantManagementRoutes,
    ...inventoryManagementRoutes,
    ...supplyAndPurchasingRoutes
];

const legacyRedirectRoutes = [
    { path: '/dashboard', name: 'dashboard', redirect: () => getHomeByRole(getActiveRole() ?? 'restaurant') },
    { path: '/alerts', name: 'alerts', redirect: () => getScopedPathByRole(getActiveRole() ?? 'restaurant', 'alerts') },
    { path: '/reports', name: 'reports', redirect: '/restaurant/reports' },
    { path: '/configuration', name: 'configuration', redirect: () => getScopedPathByRole(getActiveRole() ?? 'restaurant', 'configuration') },
    { path: '/subscription', name: 'subscription', redirect: () => getScopedPathByRole(getActiveRole() ?? 'restaurant', 'subscription') },
    { path: '/inventory', name: 'inventory', redirect: '/restaurant/inventory' },
    { path: '/orders', name: 'orders', redirect: '/restaurant/orders' },
    { path: '/orders/new', name: 'orders-new', redirect: '/restaurant/orders/new' },
    { path: '/suppliers', name: 'suppliers', redirect: '/restaurant/suppliers' },
];

const supplierView = () => import('./shared/presentation/views/supplier-view.vue');
const restaurantView = () => import('./shared/presentation/views/restaurant-view.vue');

const loginPage = () => import('./iam/presentation/views/login-view.vue');
const registerPage = () => import('./iam/presentation/views/register-view.vue');

const routes = [
    { path: '/restaurant',      name: 'restaurant', component: restaurantView, redirect: '/restaurant/dashboard', meta: { role: 'restaurant' }, children: restaurantRoutes },
    { path: '/supplier',        name: 'supplier',   component: supplierView,   redirect: '/supplier/dashboard', meta: { role: 'supplier' }, children: supplyManagementRoutes },
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: loginPage, meta: { title: 'Log in' } },
    { path: '/register', name: 'register', component: registerPage, meta: { title: 'Register' } },
    ...legacyRedirectRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
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

    if (!currentRole && requiredRole) {
        const sessionStore = useSessionStore();
        sessionStore.setUserRole(requiredRole);
        return next();
    }

    if (currentRole && requiredRole && currentRole !== requiredRole) {
        return next(getHomeByRole(currentRole));
    }

    return next();
});

export default router;
