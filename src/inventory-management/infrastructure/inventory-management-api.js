import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const inventoryApiBaseUrl = (import.meta.env.VITE_INVENTORY_API_URL ?? '').replace(/\/$/, '');
const inventoryEndpointPath = import.meta.env.VITE_INVENTORY_ENDPOINT_PATH ?? '/Inventory';
const stockMovementEndpointPath = import.meta.env.VITE_STOCK_MOVEMENT_ENDPOINT_PATH ?? '/StockMovement';

function joinUrl(base, path) {
  const p = String(path ?? '');
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${base}${p.startsWith('/') ? '' : '/'}${p}`;
}

// Mock fallback data in case API is unavailable
const mockInventoryItems = [
  {
    id: 1001,
    restaurantId: 1,
    name: 'Tomatoes',
    unitOfMeasure: 'KILOGRAMS',
    currentStock: 50,
    minimumStockLevel: 20
  },
  {
    id: 1002,
    restaurantId: 1,
    name: 'Olive Oil',
    unitOfMeasure: 'LITERS',
    currentStock: 15,
    minimumStockLevel: 10
  },
  {
    id: 1003,
    restaurantId: 1,
    name: 'Salt',
    unitOfMeasure: 'GRAMS',
    currentStock: 500,
    minimumStockLevel: 300
  }
];

const mockStockMovements = [
  {
    id: 1,
    inventoryItemId: 1001,
    type: 'ENTRY',
    amount: 25,
    date: new Date('2026-05-10'),
    reason: 'Weekly supply'
  },
  {
    id: 2,
    inventoryItemId: 1001,
    type: 'EXIT',
    amount: 10,
    date: new Date('2026-05-11'),
    reason: 'Daily usage'
  },
  {
    id: 3,
    inventoryItemId: 1002,
    type: 'ENTRY',
    amount: 5,
    date: new Date('2026-05-12'),
    reason: 'Restocking'
  }
];

function buildFallbackResponse(type, data) {
  return {
    data: type === 'inventory' ? data : Array.isArray(data) ? data : [data]
  };
}

/**
 * Inventory management API adapter extending BaseApi
 * Handles communication with MockAPI for inventory items and stock movements
 */
export class InventoryManagementApi extends BaseApi {
  #inventoryEndpoint;
  #stockMovementEndpoint;

  constructor() {
    super();
    // Use absolute endpoint URLs so module works without modifying BaseApi
    const inventoryFullPath = joinUrl(inventoryApiBaseUrl, inventoryEndpointPath);
    const stockMovementFullPath = joinUrl(inventoryApiBaseUrl, stockMovementEndpointPath);
    this.#inventoryEndpoint = new BaseEndpoint(this, inventoryFullPath);
    this.#stockMovementEndpoint = new BaseEndpoint(this, stockMovementFullPath);
  }

  /**
   * Fetch all inventory items from API or fallback to mock data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getInventoryItems() {
    return this.#inventoryEndpoint
      .getAll()
      .catch((error) => {
        console.warn('Failed to fetch inventory items from API, using fallback data', error);
        return buildFallbackResponse('inventory', mockInventoryItems);
      });
  }

  /**
   * Fetch inventory item by ID
   * @param {number} id - Inventory item ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getInventoryItemById(id) {
    return this.#inventoryEndpoint
      .getById(id)
      .catch((error) => {
        console.warn(`Failed to fetch inventory item ${id} from API`, error);
        const item = mockInventoryItems.find((item) => item.id === id);
        return buildFallbackResponse('inventory', item ?? {});
      });
  }

  /**
   * Fetch all stock movements from API or fallback to mock data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getStockMovements() {
    return this.#stockMovementEndpoint
      .getAll()
      .catch((error) => {
        console.warn('Failed to fetch stock movements from API, using fallback data', error);
        return buildFallbackResponse('movements', mockStockMovements);
      });
  }

  /**
   * Fetch stock movements for a specific inventory item
   * @param {number} inventoryItemId - Inventory item ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getStockMovementsByInventoryId(inventoryItemId) {
    return this.#stockMovementEndpoint
      .getAll()
      .then((response) => {
        const movements = Array.isArray(response.data) ? response.data : [response.data];
        const filtered = movements.filter((m) => m.inventoryItemId === inventoryItemId);
        return { data: filtered };
      })
      .catch((error) => {
        console.warn(`Failed to fetch movements for inventory ${inventoryItemId}`, error);
        const filtered = mockStockMovements.filter((m) => m.inventoryItemId === inventoryItemId);
        return buildFallbackResponse('movements', filtered);
      });
  }

  /**
   * Create a new inventory item
   * @param {Object} item - Inventory item data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  createInventoryItem(item) {
    return this.#inventoryEndpoint.create(item);
  }

  /**
   * Update an existing inventory item
   * @param {number} id - Inventory item ID
   * @param {Object} item - Updated inventory item data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  updateInventoryItem(id, item) {
    return this.#inventoryEndpoint.update(id, item);
  }

  /**
   * Delete an inventory item
   * @param {number} id - Inventory item ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  deleteInventoryItem(id) {
    return this.#inventoryEndpoint.delete(id);
  }

  /**
   * Create a new stock movement
   * @param {Object} movement - Stock movement data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  createStockMovement(movement) {
    return this.#stockMovementEndpoint.create(movement);
  }

  /**
   * Update an existing stock movement
   * @param {number} id - Stock movement ID
   * @param {Object} movement - Updated stock movement data
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  updateStockMovement(id, movement) {
    return this.#stockMovementEndpoint.update(id, movement);
  }

  /**
   * Delete a stock movement
   * @param {number} id - Stock movement ID
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  deleteStockMovement(id) {
    return this.#stockMovementEndpoint.delete(id);
  }
}


