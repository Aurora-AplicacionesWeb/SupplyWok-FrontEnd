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
    { path: 'dashboard', name: 'restaurant-dashboard', component: placeholderPage, meta: { i18nKey: 'shared.titles.dashboard', role: 'restaurant', isDashboard: true } },
    { path: 'kitchen', name: 'restaurant-kitchen', component: kitchenTicketsView, meta: { i18nKey: 'shared.titles.kitchen-tickets' } },
    { path: 'tables', name: 'restaurant-tables', component: tablesAndOccupancyView, meta: { i18nKey: 'shared.titles.tables' } },
    { path: 'alerts', name: 'restaurant-alerts', component: alertsPage, meta: { i18nKey: 'shared.titles.alerts' } },
    { path: 'reports', name: 'restaurant-reports', component: reportsPage, meta: { i18nKey: 'shared.titles.reports' } },
    { path: 'configuration', name: 'restaurant-configuration', component: configurationPage, meta: { i18nKey: 'shared.titles.configuration' } },
    { path: 'subscription', name: 'restaurant-subscription', component: subscriptionPage, meta: { i18nKey: 'shared.titles.subscription' } },
    { path: 'dish-menu', name: 'dish-menu-view', component: dishMenuView, meta: { i18nKey: 'shared.titles.dish-menu' } },
    { path: 'create-kitchen-order', name: 'create-kitchen-order-view', component: createKitchenOrderView, meta: { i18nKey: 'shared.titles.create-kitchen-order' } },
    { path: 'kitchen-tickets', name: 'kitchen-tickets-view', component: kitchenTicketsView, meta: { i18nKey: 'shared.titles.kitchen-tickets' } },
    { path: 'tables-and-occupancy', name: 'tables-and-occupancy-view', component: tablesAndOccupancyView, meta: { i18nKey: 'shared.titles.tables-and-occupancy' } }
];

export default restaurantManagementRoutes;
