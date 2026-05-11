import { createRouter, createWebHistory } from 'vue-router';
import supplyAndPurchasingRoutes from './supply-and-purchasing/presentation/supply-and-purchasing-routes.js';

const placeholderPage = () => import('./shared/presentation/views/placeholder-page.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const placeholderRoutes = [
    { path: '/dashboard', name: 'dashboard', component: placeholderPage, meta: { title: 'Dashboard' } },
    { path: '/inventory', name: 'inventory', component: placeholderPage, meta: { title: 'Inventory' } },
    { path: '/kitchen-tickets', name: 'kitchen-tickets', component: placeholderPage, meta: { title: 'Kitchen Tickets' } },
    { path: '/alerts', name: 'alerts', component: placeholderPage, meta: { title: 'Alerts' } },
    { path: '/reports', name: 'reports', component: placeholderPage, meta: { title: 'Reports' } },
    { path: '/configuration', name: 'configuration', component: placeholderPage, meta: { title: 'Configuration' } },
    { path: '/subscription', name: 'subscription', component: placeholderPage, meta: { title: 'Subscription' } },
    { path: '/tables-and-occupancy', name: 'tables-and-occupancy', component: placeholderPage, meta: { title: 'Tables and Occupancy' } }
];

const routes = [
    { path: '/', redirect: '/orders' },
    ...placeholderRoutes,
    ...supplyAndPurchasingRoutes,
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