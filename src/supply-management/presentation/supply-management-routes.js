const supplierDashboard = () => import('./views/dashboard-supplier.vue');
const supplierOrders = () => import('./views/orders-supplier.vue');
const supplierClients = () => import('./views/clients-supplier.vue');
const supplierDelivery = () => import('./views/delivery-supplier.vue');
const supplierForecast = () => import('./views/demand-forecast.vue');
const supplierCatalog = () => import('./views/catalog-supplier.vue');
const supplierAlerts = () => import('./views/alerts-supplier.vue');
const supplierSettings = () => import('./views/settings-supplier.vue');
const supplierSubscription = () => import('./views/subscription-supplier.vue');

/**
 * Supply Management presentation routes.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const supplyManagementRoutes = [
    { path: 'dashboard', name: 'supplier-dashboard', component: supplierDashboard, meta: { title: 'Dashboard', role: 'supplier' } },
    { path: 'orders', name: 'supplier-orders', component: supplierOrders, meta: { title: 'Orders', role: 'supplier' } },
    { path: 'clients', name: 'supplier-clients', component: supplierClients, meta: { title: 'Clients', role: 'supplier' } },
    { path: 'delivery', name: 'supplier-delivery', component: supplierDelivery, meta: { title: 'Delivery', role: 'supplier' } },
    { path: 'forecast', name: 'supplier-forecast', component: supplierForecast, meta: { title: 'Forecast', role: 'supplier' } },
    { path: 'catalog', name: 'supplier-catalog', component: supplierCatalog, meta: { title: 'Catalog', role: 'supplier' } },
    { path: 'alerts', name: 'supplier-alerts', component: supplierAlerts, meta: { title: 'Alerts', role: 'supplier' } },
    { path: 'configuration', name: 'supplier-configuration', component: supplierSettings, meta: { title: 'Configuration', role: 'supplier' } },
    { path: 'subscription', name: 'supplier-subscription', component: supplierSubscription, meta: { title: 'Subscription', role: 'supplier' } },
];

export default supplyManagementRoutes;
