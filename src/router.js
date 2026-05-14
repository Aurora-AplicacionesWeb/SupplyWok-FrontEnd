import { createRouter, createWebHistory } from 'vue-router';
import restaurantManagementRoutes from './restaurant-management/presentation/restaurant-management-routes.js';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management-routes.js';
import { useIamStore } from './iam/application/iam-store.js';
import useSessionStore from './shared/application/session.store.js';
import { getHomeByRole, getRoleFromPath, getScopedPathByRole, normalizeRole } from './shared/application/role-routing.js';

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

const supplierView = () => import('./shared/presentation/views/supplier-view.vue');
const restaurantView = () => import('./shared/presentation/views/restaurant-view.vue');

const supplierDashboard    = () => import('./supply-management/presentation/views/dashboard-supplier.vue');
const supplierOrders       = () => import('./supply-management/presentation/views/orders-supplier.vue');
const supplierClients      = () => import('./supply-management/presentation/views/clients-supplier.vue');
const supplierForecast     = () => import('./supply-management/presentation/views/demand-forecast.vue');
const supplierCatalog      = () => import('./supply-management/presentation/views/catalog-supplier.vue');
const supplierAlerts       = () => import('./supply-management/presentation/views/alerts-supplier.vue');
const supplierSettings     = () => import('./supply-management/presentation/views/settings-supplier.vue');
const supplierSubscription = () => import('./supply-management/presentation/views/subscription-supplier.vue');
const supplierDelivery     = () => import('./supply-management/presentation/views/delivery-supplier.vue');

const supplierRoutes = [
    { path: 'dashboard',     name: 'supplier-dashboard',     component: supplierDashboard,    meta: { title: 'Dashboard',     role: 'supplier' } },
    { path: 'orders',        name: 'supplier-orders',        component: supplierOrders,       meta: { title: 'Orders',        role: 'supplier' } },
    { path: 'clients',       name: 'supplier-clients',       component: supplierClients,      meta: { title: 'Clients',       role: 'supplier' } },
    { path: 'delivery',      name: 'supplier-delivery',      component: supplierDelivery,     meta: { title: 'Delivery',      role: 'supplier' } },
    { path: 'forecast',      name: 'supplier-forecast',      component: supplierForecast,     meta: { title: 'Forecast',      role: 'supplier' } },
    { path: 'catalog',       name: 'supplier-catalog',       component: supplierCatalog,      meta: { title: 'Catalog',       role: 'supplier' } },
    { path: 'alerts',        name: 'supplier-alerts',        component: supplierAlerts,       meta: { title: 'Alerts',        role: 'supplier' } },
    { path: 'configuration', name: 'supplier-configuration', component: supplierSettings,     meta: { title: 'Configuration', role: 'supplier' } },
    { path: 'subscription',  name: 'supplier-subscription',  component: supplierSubscription, meta: { title: 'Subscription',  role: 'supplier' } },
];

const loginPage = () => import('./iam/presentation/views/login-view.vue');
const registerPage = () => import('./iam/presentation/views/register-view.vue');

const routes = [
    { path: '/restaurant',      name: 'restaurant', component: restaurantView, redirect: '/restaurant/dashboard', meta: { role: 'restaurant' }, children: restaurantRoutes },
    { path: '/supplier',        name: 'supplier',   component: supplierView,   redirect: '/supplier/dashboard', meta: { role: 'supplier' }, children: supplierRoutes },
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
 * Global navigation guard that updates the document title and delegates auth when enabled.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    const iamStore = useIamStore();
    const sessionStore = useSessionStore();
    const currentRole = normalizeRole(iamStore.currentUserRole) ?? normalizeRole(sessionStore.userRole);
    const requiredRole = normalizeRole(to.meta?.role) ?? getRoleFromPath(to.path);

    const baseTitle = 'SupplyWok';
    document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle;

    if (currentRole && requiredRole && currentRole !== requiredRole) {
        return next(getHomeByRole(currentRole));
    }

    return next();
});

export default router;
