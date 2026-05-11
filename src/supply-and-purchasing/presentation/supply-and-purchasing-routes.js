const ordersPage = () => import('../../../copy-frontend-supplywok/src/supply-and-purchasing/presentation/pages/orders-page.vue');
const purchaseOrderFormPage = () => import('../../../copy-frontend-supplywok/src/supply-and-purchasing/presentation/pages/purchase-order-form-page.vue');
const suppliersPage = () => import('../../../copy-frontend-supplywok/src/supply-and-purchasing/presentation/pages/suppliers-page.vue');

/**
 * Supply and Purchasing presentation routes.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const supplyAndPurchasingRoutes = [
    { path: '/orders', name: 'orders-page', component: ordersPage, meta: { title: 'Orders' } },
    { path: '/orders/new', name: 'purchase-order-form-page', component: purchaseOrderFormPage, meta: { title: 'Create Order' } },
    { path: '/suppliers', name: 'suppliers-page', component: suppliersPage, meta: { title: 'Suppliers' } }
];

export default supplyAndPurchasingRoutes;
