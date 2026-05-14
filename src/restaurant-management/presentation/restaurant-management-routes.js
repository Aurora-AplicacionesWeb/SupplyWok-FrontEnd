const placeholderPage = () => import('../../shared/presentation/views/placeholder-page.vue');
const alertsPage = () => import('../../iot-monitoring/presentation/views/alerts-view.vue');
const reportsPage = () => import('../../shared/presentation/views/reports-page.vue');
const configurationPage = () => import('../../shared/presentation/views/configuration-page.vue');
const subscriptionPage = () => import('../../shared/presentation/views/subscription-page.vue');

const dishMenuPage = () => import('./pages/dish-menu-page.vue');
const createKitchenOrderPage = () => import('./pages/create-kitchen-order-page.vue');
const kitchenTicketsPage = () => import('./pages/kitchen-tickets-page.vue');
const tablesAndOccupancyPage = () => import('./pages/tables-and-occupancy-page.vue');

const restaurantManagementRoutes = [
    { path: 'dashboard', name: 'restaurant-dashboard', component: placeholderPage, meta: { title: 'Dashboard', role: 'restaurant', isDashboard: true } },
    { path: 'kitchen', name: 'restaurant-kitchen', component: kitchenTicketsPage, meta: { title: 'Kitchen Tickets' } },
    { path: 'tables', name: 'restaurant-tables', component: tablesAndOccupancyPage, meta: { title: 'Tables' } },
    { path: 'alerts', name: 'restaurant-alerts', component: alertsPage, meta: { title: 'Alerts' } },
    { path: 'reports', name: 'restaurant-reports', component: reportsPage, meta: { title: 'Reports' } },
    { path: 'configuration', name: 'restaurant-configuration', component: configurationPage, meta: { title: 'Configuration' } },
    { path: 'subscription', name: 'restaurant-subscription', component: subscriptionPage, meta: { title: 'Subscription' } },
    { path: 'dish-menu', name: 'dish-menu-page', component: dishMenuPage, meta: { title: 'Dish Menu' } },
    { path: 'create-kitchen-order', name: 'create-kitchen-order-page', component: createKitchenOrderPage, meta: { title: 'Create Kitchen Order' } },
    { path: 'kitchen-tickets', name: 'kitchen-tickets-page', component: kitchenTicketsPage, meta: { title: 'Kitchen Tickets' } },
    { path: 'tables-and-occupancy', name: 'tables-and-occupancy-page', component: tablesAndOccupancyPage, meta: { title: 'Tables and Occupancy' } }
];

export default restaurantManagementRoutes;
