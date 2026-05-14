const placeholderPage = () => import('../../shared/presentation/views/placeholder-page.vue');

const dishMenuPage = () => import('./pages/dish-menu-page.vue');
const createKitchenOrderPage = () => import('./pages/create-kitchen-order-page.vue');
const kitchenTicketsPage = () => import('./pages/kitchen-tickets-page.vue');
const tablesAndOccupancyPage = () => import('./pages/tables-and-occupancy-page.vue');

const restaurantManagementRoutes = [
    { path: 'dashboard', name: 'restaurant-dashboard', component: placeholderPage, meta: { title: 'Dashboard' } },
    { path: 'inventory', name: 'restaurant-inventory', component: placeholderPage, meta: { title: 'Inventory' } },
    { path: 'orders', name: 'restaurant-orders', component: placeholderPage, meta: { title: 'Orders' } },
    { path: 'kitchen', name: 'restaurant-kitchen', component: placeholderPage, meta: { title: 'Kitchen Tickets' } },
    { path: 'suppliers', name: 'restaurant-suppliers', component: placeholderPage, meta: { title: 'Suppliers' } },
    { path: 'tables', name: 'restaurant-tables', component: placeholderPage, meta: { title: 'Tables' } },
    { path: 'alerts', name: 'restaurant-alerts', component: placeholderPage, meta: { title: 'Alerts' } },
    { path: 'reports', name: 'restaurant-reports', component: placeholderPage, meta: { title: 'Reports' } },
    { path: 'configuration', name: 'restaurant-configuration', component: placeholderPage, meta: { title: 'Configuration' } },
    { path: 'subscription', name: 'restaurant-subscription', component: placeholderPage, meta: { title: 'Subscription' } },
    { path: 'dish-menu', name: 'dish-menu-page', component: dishMenuPage, meta: { title: 'Dish Menu' } },
    { path: 'create-kitchen-order', name: 'create-kitchen-order-page', component: createKitchenOrderPage, meta: { title: 'Create Kitchen Order' } },
    { path: 'kitchen-tickets', name: 'kitchen-tickets-page', component: kitchenTicketsPage, meta: { title: 'Kitchen Tickets' } },
    { path: 'tables-and-occupancy', name: 'tables-and-occupancy-page', component: tablesAndOccupancyPage, meta: { title: 'Tables and Occupancy' } }
];

export default restaurantManagementRoutes;
