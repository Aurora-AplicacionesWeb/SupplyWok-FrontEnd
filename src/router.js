import {createRouter, createWebHistory} from "vue-router";

// ── Supply Management (Supplier role) – lazy-loaded views ──────────────────
const supplierDashboard    = () => import('./supply-management/presentation/views/dashboard-supplier.vue');
const supplierOrders       = () => import('./supply-management/presentation/views/orders-supplier.vue');
const supplierClients      = () => import('./supply-management/presentation/views/clients-supplier.vue');
const supplierForecast     = () => import('./supply-management/presentation/views/demand-forecast.vue');
const supplierCatalog      = () => import('./supply-management/presentation/views/catalog-supplier.vue');
const supplierAlerts       = () => import('./supply-management/presentation/views/alerts-supplier.vue');
const supplierSettings     = () => import('./supply-management/presentation/views/settings-supplier.vue');
const supplierSubscription = () => import('./supply-management/presentation/views/subscription-supplier.vue');
const supplierDelivery     = () => import('./supply-management/presentation/views/delivery-supplier.vue');

/** Child routes for the /supplier prefix (only active when userRole === 'supplier') */
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

/*
// Routes version when IAM is implemented
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/about',           name: 'about',      component: about,       meta: { title: 'About' } },
    { path: '/publishing',      name: 'publishing', children: publishingRoutes },
    { path: '/iam',             name: 'iam',        children: iamRoutes },
    { path: '/supplier',        name: 'supplier',   redirect: '/supplier/dashboard', children: supplierRoutes },
    { path: '/restaurant',      name: 'restaurant', redirect: '/restaurant/dashboard' },
    { path: '/',                redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];
*/

// Routes version when IAM is not implemented
const routes = [
    // Supplier routes (supply-management bc)
    { path: '/supplier',        name: 'supplier',   redirect: '/supplier/dashboard', children: supplierRoutes },

    { path: '/restaurant',      name: 'restaurant', redirect: '/restaurant/dashboard' },
    { path: '/',                redirect: '/restaurant/dashboard' },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,

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
    // Set the page title
    let baseTitle = 'SupplyWok';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // When IAM is implemented, use:
    // return authenticationGuard(to, from, next);
    // if not, use:
    return next();
});

export default router;
