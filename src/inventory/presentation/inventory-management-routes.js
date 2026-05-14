import inventoryManagementPage from './pages/inventory-management-page.vue';

export const inventoryManagementRoutes = [
  {
	path: '/inventory/items',
	name: 'restaurant-inventory',
	component: inventoryManagementPage,
	meta: { i18nKey: 'shared.titles.inventory', role: 'restaurant' }
  },
  {
	path: '/inventory/items/:itemId/edit',
	name: 'inventory-item-edit',
	component: inventoryManagementPage,
	meta: { i18nKey: 'shared.titles.inventory', role: 'restaurant' }
  }
];
