const placeholderPage = () => import('../../shared/presentation/views/placeholder-page.vue');
const alertsPage = () => import('../../iot-monitoring/presentation/views/alerts-view.vue');
const reportsPage = () => import('../../shared/presentation/views/reports-page.vue');
const configurationPage = () => import('../../shared/presentation/views/configuration-page.vue');
const subscriptionPage = () => import('../../shared/presentation/views/subscription-page.vue');

const dishMenuView = () => import('./views/dish-menu-view.vue');
const createKitchenOrderView = () => import('./views/create-kitchen-order-view.vue');
const kitchenTicketsView = () => import('./views/kitchen-tickets-view.vue');
const tablesAndOccupancyView = () => import('./views/tables-and-occupancy-view.vue');

const restaurantManagementRoutes = [
    { path: 'dashboard', name: 'restaurant-dashboard', component: placeholderPage, meta: { title: 'Dashboard', role: 'restaurant', isDashboard: true } },
    { path: 'kitchen', name: 'restaurant-kitchen', component: kitchenTicketsView, meta: { title: 'Kitchen Tickets' } },
    { path: 'tables', name: 'restaurant-tables', component: tablesAndOccupancyView, meta: { title: 'Tables' } },
    { path: 'alerts', name: 'restaurant-alerts', component: alertsPage, meta: { title: 'Alerts' } },
    { path: 'reports', name: 'restaurant-reports', component: reportsPage, meta: { title: 'Reports' } },
    { path: 'configuration', name: 'restaurant-configuration', component: configurationPage, meta: { title: 'Configuration' } },
    { path: 'subscription', name: 'restaurant-subscription', component: subscriptionPage, meta: { title: 'Subscription' } },
    { path: 'dish-menu', name: 'dish-menu-view', component: dishMenuView, meta: { title: 'Dish Menu' } },
    { path: 'create-kitchen-order', name: 'create-kitchen-order-view', component: createKitchenOrderView, meta: { title: 'Create Kitchen Order' } },
    { path: 'kitchen-tickets', name: 'kitchen-tickets-view', component: kitchenTicketsView, meta: { title: 'Kitchen Tickets' } },
    { path: 'tables-and-occupancy', name: 'tables-and-occupancy-view', component: tablesAndOccupancyView, meta: { title: 'Tables and Occupancy' } }
];

export default restaurantManagementRoutes;
