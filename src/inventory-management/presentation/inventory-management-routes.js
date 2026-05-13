import inventoryManagementPage from './pages/inventory-management-page.vue';

export const inventoryManagementRoutes = [
  {
	path: '/inventory',
	name: 'inventory-management-page',
	component: inventoryManagementPage,
	meta: { title: 'Inventory' }
  }
];


