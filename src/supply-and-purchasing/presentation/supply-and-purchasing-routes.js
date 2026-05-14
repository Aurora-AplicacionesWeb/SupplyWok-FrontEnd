const ordersPage = () => import('./pages/orders-page.vue');
const purchaseOrderFormPage = () => import('./pages/purchase-order-form-page.vue');
const suppliersPage = () => import('./pages/suppliers-page.vue');

/**
 * Supply and Purchasing presentation routes.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const supplyAndPurchasingRoutes = [
    { path: 'orders', name: 'restaurant-orders', component: ordersPage, meta: { title: 'Orders' } },
    { path: 'orders/new', name: 'restaurant-orders-new', component: purchaseOrderFormPage, meta: { title: 'Create Order' } },
    { path: 'suppliers', name: 'restaurant-suppliers', component: suppliersPage, meta: { title: 'Suppliers' } }
];

export default supplyAndPurchasingRoutes;
