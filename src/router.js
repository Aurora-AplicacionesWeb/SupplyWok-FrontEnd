import { createRouter, createWebHistory } from 'vue-router';
import restaurantManagementRoutes from './restaurant-management/presentation/restaurant-management-routes.js';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';
import { inventoryManagementRoutes } from './inventory-management/presentation/inventory-management-routes.js';

const placeholderPage = () => import('./shared/presentation/views/placeholder-page.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const placeholderRoutes = [
    { path: '/dashboard', name: 'dashboard', component: placeholderPage, meta: { title: 'Dashboard' } },
    { path: '/alerts', name: 'alerts', component: placeholderPage, meta: { title: 'Alerts' } },
    { path: '/reports', name: 'reports', component: placeholderPage, meta: { title: 'Reports' } },
    { path: '/configuration', name: 'configuration', component: placeholderPage, meta: { title: 'Configuration' } },
    { path: '/subscription', name: 'subscription', component: placeholderPage, meta: { title: 'Subscription' } },

];

const routes = [
    { path: '/', redirect: '/orders' },
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

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    const baseTitle = 'SupplyWok';
    document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle;
    return next();
});

export default router;