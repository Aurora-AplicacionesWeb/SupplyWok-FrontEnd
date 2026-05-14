import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const inventoryEndpointPath = import.meta.env.VITE_INVENTORY_ENDPOINT_PATH;
const stockMovementEndpointPath = import.meta.env.VITE_STOCK_MOVEMENT_ENDPOINT_PATH;

/**
 * Inventory management API adapter backed by json-server collections.
 */
export class InventoryManagementApi extends BaseApi {
  #inventoryEndpoint;
  #stockMovementEndpoint;

  constructor() {
    super();
    this.#inventoryEndpoint = new BaseEndpoint(this, inventoryEndpointPath);
    this.#stockMovementEndpoint = new BaseEndpoint(this, stockMovementEndpointPath);
  }

  getInventoryItems() {
    return this.#inventoryEndpoint.getAll();
  }

  getInventoryItemById(id) {
    return this.#inventoryEndpoint.getById(id);
  }

  getStockMovements() {
    return this.#stockMovementEndpoint.getAll();
  }

  getStockMovementsByInventoryId(inventoryItemId) {
    return this.#stockMovementEndpoint.getAll().then((response) => {
      const movements = Array.isArray(response.data) ? response.data : [response.data];
      return {
        ...response,
        data: movements.filter((movement) => movement.inventoryItemId === inventoryItemId)
      };
    });
  }

  createInventoryItem(item) {
    return this.#inventoryEndpoint.create(item);
  }

  updateInventoryItem(id, item) {
    return this.#inventoryEndpoint.update(id, item);
  }

  deleteInventoryItem(id) {
    return this.#inventoryEndpoint.delete(id);
  }

  createStockMovement(movement) {
    return this.#stockMovementEndpoint.create(movement);
  }

  updateStockMovement(id, movement) {
    return this.#stockMovementEndpoint.update(id, movement);
  }

  deleteStockMovement(id) {
    return this.#stockMovementEndpoint.delete(id);
  }
}
