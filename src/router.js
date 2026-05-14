import { createRouter, createWebHistory } from 'vue-router';
import restaurantManagementRoutes from './restaurant-management/presentation/restaurant-management-routes.js';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management-routes.js';

const placeholderPage = () => import('./shared/presentation/views/placeholder-page.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const alertsPage = () => import('./iot-monitoring/presentation/views/alerts-view.vue');

const placeholderRoutes = [
    { path: '/dashboard', name: 'dashboard', component: placeholderPage, meta: { title: 'Dashboard' } },
    { path: '/alerts', name: 'alerts', component: alertsPage, meta: { title: 'Alerts' } },
    { path: '/reports', name: 'reports', component: placeholderPage, meta: { title: 'Reports' } },
    { path: '/configuration', name: 'configuration', component: placeholderPage, meta: { title: 'Configuration' } },
    { path: '/subscription', name: 'subscription', component: placeholderPage, meta: { title: 'Subscription' } },
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
    { path: '/restaurant',      name: 'restaurant', component: restaurantView, redirect: '/restaurant/dashboard', children: restaurantManagementRoutes },
    { path: '/supplier',        name: 'supplier',   component: supplierView,   redirect: '/supplier/dashboard', children: supplierRoutes },
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
    return next();
});

export default router;