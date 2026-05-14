import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { InventoryManagementApi } from '../infrastructure/inventory-management-api.js';
import { InventoryItemAssembler } from '../infrastructure/inventory-item.assembler.js';
import { StockMovementAssembler } from '../infrastructure/stock-movement.assembler.js';

const api = new InventoryManagementApi();

const useInventoryManagementStore = defineStore('inventory', () => {
  const inventoryItems = ref([]);
  const stockMovements = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const errors = ref([]);

  const totalInventoryItems = computed(() => (loaded.value ? inventoryItems.value.length : 0));

  const totalCurrentStock = computed(() => {
	return inventoryItems.value.reduce((acc, item) => acc + (Number(item.currentStock) || 0), 0);
  });

  const criticalItemsCount = computed(() => inventoryItems.value.filter((i) => i.hasCriticalStock?.()).length);

  const lowStockItems = computed(() => inventoryItems.value.filter((i) => i.getStockStatus?.() === 'warning' || i.getStockStatus?.() === 'critical'));

  const inventoryUnits = computed(() => {
	const units = new Set(inventoryItems.value.map((i) => i.unitOfMeasure));
	return Array.from(units);
  });

  async function fetchInventoryItems() {
	loading.value = true;
	try {
	  const response = await api.getInventoryItems();
	  inventoryItems.value = InventoryItemAssembler.toEntitiesFromResponse(response);
	  loaded.value = true;
	  return inventoryItems.value;
	} catch (error) {
	  errors.value.push(error);
	  throw error;
	} finally {
	  loading.value = false;
	}
  }

  async function fetchStockMovements() {
	loading.value = true;
	try {
	  const response = await api.getStockMovements();
	  stockMovements.value = StockMovementAssembler.toEntitiesFromResponse(response);
	  return stockMovements.value;
	} catch (error) {
	  errors.value.push(error);
	  throw error;
	} finally {
	  loading.value = false;
	}
  }

  function attachMovementsToInventoryItems() {
	const movementsByInventory = stockMovements.value.reduce((map, movement) => {
	  const key = movement.inventoryItemId;
	  if (!map[key]) map[key] = [];
	  map[key].push(movement);
	  return map;
	}, {});

	inventoryItems.value.forEach((item) => {
	  const attached = movementsByInventory[item.id] ?? [];
	  item.attachMovements(attached);
	});
  }

  async function fetchAll() {
	loading.value = true;
	try {
	  const [itemsResponse, movementsResponse] = await Promise.allSettled([api.getInventoryItems(), api.getStockMovements()]);

	  if (itemsResponse.status === 'fulfilled') {
		inventoryItems.value = InventoryItemAssembler.toEntitiesFromResponse(itemsResponse.value);
		loaded.value = true;
	  } else {
		errors.value.push(itemsResponse.reason);
	  }

	  if (movementsResponse.status === 'fulfilled') {
		stockMovements.value = StockMovementAssembler.toEntitiesFromResponse(movementsResponse.value);
	  } else {
		errors.value.push(movementsResponse.reason);
	  }

	  attachMovementsToInventoryItems();
	} finally {
	  loading.value = false;
	}
  }

  async function createInventoryItem(entity) {
	loading.value = true;
	try {
	  const resource = InventoryItemAssembler.toResourceFromEntity(entity);
	  const response = await api.createInventoryItem(resource);
	  const created = InventoryItemAssembler.toEntityFromResource(response.data ?? response);
	  inventoryItems.value.unshift(created);
	  return created;
	} catch (error) {
	  errors.value.push(error);
	  return null;
	} finally {
	  loading.value = false;
	}
  }

  async function updateInventoryItem(id, entity) {
	loading.value = true;
	try {
	  const resource = InventoryItemAssembler.toResourceFromEntity(entity);
	  const response = await api.updateInventoryItem(id, resource);
	  const updated = InventoryItemAssembler.toEntityFromResource(response.data ?? response);
	  const index = inventoryItems.value.findIndex((i) => i.id === id);
	  if (index >= 0) inventoryItems.value.splice(index, 1, updated);
	  return updated;
	} catch (error) {
	  errors.value.push(error);
	  return null;
	} finally {
	  loading.value = false;
	}
  }

  async function deleteInventoryItem(id) {
	loading.value = true;
	try {
	  await api.deleteInventoryItem(id);
	  inventoryItems.value = inventoryItems.value.filter((i) => i.id !== id);
	  return true;
	} catch (error) {
	  errors.value.push(error);
	  return false;
	} finally {
	  loading.value = false;
	}
  }

  async function createStockMovement(movementEntity) {
	loading.value = true;
	try {
	  const resource = StockMovementAssembler.toResourceFromEntity(movementEntity);
	  const response = await api.createStockMovement(resource);
	  const created = StockMovementAssembler.toEntityFromResource(response.data ?? response);
	  stockMovements.value.push(created);

	  // Apply movement to inventory item locally
	  const item = inventoryItems.value.find((it) => it.id === created.inventoryItemId);
	  if (item) {
		if (created.type === 'ENTRY') item.addStock(created.amount, created.reason);
		else if (created.type === 'EXIT') item.removeStock(created.amount, created.reason);
		else if (created.type === 'ADJUSTMENT') item.adjustStock(created.amount, created.reason);
	  }

	  return created;
	} catch (error) {
	  errors.value.push(error);
	  return null;
	} finally {
	  loading.value = false;
	}
  }

  return {
	inventoryItems,
	stockMovements,
	loading,
	loaded,
	errors,
	totalInventoryItems,
	totalCurrentStock,
	criticalItemsCount,
	lowStockItems,
	inventoryUnits,
	fetchInventoryItems,
	fetchStockMovements,
	fetchAll,
	attachMovementsToInventoryItems,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
	createStockMovement
  };
});

export default useInventoryManagementStore;



