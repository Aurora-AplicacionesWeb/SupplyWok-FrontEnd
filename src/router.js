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

const getActiveRole = () => {
    const iamStore = useIamStore();
    const sessionStore = useSessionStore();
    return normalizeRole(iamStore.currentUserRole) ?? normalizeRole(sessionStore.userRole) ?? 'restaurant';
};

const restaurantRoutes = [
    ...restaurantManagementRoutes,
    ...inventoryManagementRoutes,
    ...supplyAndPurchasingRoutes
];

const legacyRedirectRoutes = [
    { path: '/dashboard', name: 'dashboard', redirect: () => getHomeByRole(getActiveRole()) },
    { path: '/alerts', name: 'alerts', redirect: () => getScopedPathByRole(getActiveRole(), 'alerts') },
    { path: '/reports', name: 'reports', redirect: '/restaurant/reports' },
    { path: '/configuration', name: 'configuration', redirect: () => getScopedPathByRole(getActiveRole(), 'configuration') },
    { path: '/subscription', name: 'subscription', redirect: () => getScopedPathByRole(getActiveRole(), 'subscription') },
    { path: '/inventory', name: 'inventory', redirect: '/restaurant/inventory' },
    { path: '/orders', name: 'orders', redirect: '/restaurant/orders' },
    { path: '/orders/new', name: 'orders-new', redirect: '/restaurant/orders/new' },
    { path: '/suppliers', name: 'suppliers', redirect: '/restaurant/suppliers' },
];

const topLevelRoutes = [
    { path: '/dashboard', name: 'dashboard', component: placeholderPage, meta: { title: 'Dashboard' } },
    { path: '/alerts', name: 'alerts', component: alertsPage, meta: { title: 'Alerts' } },
    { path: '/reports', name: 'reports', component: reportsPage, meta: { title: 'Reports' } },
    { path: '/configuration', name: 'configuration', component: configurationPage, meta: { title: 'Configuration' } },
    { path: '/subscription', name: 'subscription', component: subscriptionPage, meta: { title: 'Subscription' } }
];

const loginPage = () => import('./iam/presentation/views/login-view.vue');
const registerPage = () => import('./iam/presentation/views/register-view.vue');

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: loginPage, meta: { title: 'Log in' } },
    { path: '/register', name: 'register', component: registerPage, meta: { title: 'Register' } },
    ...placeholderRoutes,
    ...inventoryManagementRoutes,
    ...supplyAndPurchasingRoutes,
    ...restaurantManagementRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

/**
 * Global navigation guard that updates the document title and delegates auth when enabled.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    const baseTitle = 'SupplyWok';
    document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle;

    if (currentRole && requiredRole && currentRole !== requiredRole) {
        return next(getHomeByRole(currentRole));
    }

    return next();
});

export default router;