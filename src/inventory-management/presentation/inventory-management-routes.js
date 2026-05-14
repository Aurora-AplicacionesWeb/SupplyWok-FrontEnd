import inventoryManagementPage from './pages/inventory-management-page.vue';

export const inventoryManagementRoutes = [
  {
	path: 'inventory',
	name: 'restaurant-inventory',
	component: inventoryManagementPage,
	meta: { i18nKey: 'shared.titles.inventory' }
  }
];
