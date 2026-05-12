const dishMenuPage = () => import('./pages/dish-menu-page.vue');
const createKitchenOrderPage = () => import('./pages/create-kitchen-order-page.vue');
const kitchenTicketsPage = () => import('./pages/kitchen-tickets-page.vue');
const tablesAndOccupancyPage = () => import('./pages/tables-and-occupancy-page.vue');

const restaurantManagementRoutes = [
    { path: '/dish-menu', name: 'dish-menu-page', component: dishMenuPage, meta: { title: 'Dish Menu' } },
    { path: '/create-kitchen-order', name: 'create-kitchen-order-page', component: createKitchenOrderPage, meta: { title: 'Create Kitchen Order' } },
    { path: '/kitchen-tickets', name: 'kitchen-tickets-page', component: kitchenTicketsPage, meta: { title: 'Kitchen Tickets' } },
    { path: '/tables-and-occupancy', name: 'tables-and-occupancy-page', component: tablesAndOccupancyPage, meta: { title: 'Tables and Occupancy' } }
];

export default restaurantManagementRoutes;
