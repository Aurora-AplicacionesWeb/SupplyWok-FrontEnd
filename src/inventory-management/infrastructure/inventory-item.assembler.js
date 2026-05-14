import { InventoryItem } from '../domain/model/inventory-item.entity.js';

/**
 * Assembler that transforms API responses into InventoryItem domain entities
 */
export class InventoryItemAssembler {
  /**
   * Transform a single API resource into an InventoryItem entity
   * @param {Object} resource - Raw API response object
   * @returns {InventoryItem}
   */
  static toEntityFromResource(resource) {
    return new InventoryItem({
      id: resource.id,
      restaurantId: resource.restaurantId,
      name: resource.name,
      unitOfMeasure: resource.unitOfMeasure,
      currentStock: resource.currentStock ?? resource.initialStock ?? 0,
      minimumStockLevel: resource.minimumStockLevel ?? 0,
      category: resource.category,
      supplierId: resource.supplierId,
      supplierName: resource.supplierName,
      movements: resource.movements ?? []
    });
  }

  /**
   * Transform API response array into InventoryItem entities
   * @param {Object} response - Axios response object
   * @returns {InventoryItem[]}
   */
  static toEntitiesFromResponse(response) {
    const data = response.data;
    const resources = Array.isArray(data) ? data : data.inventory ?? data.Inventory ?? data.inventoryItems ?? [data];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Convert an InventoryItem entity to a plain object for API submission
   * @param {InventoryItem} inventoryItem
   * @returns {Object}
   */
  static toResourceFromEntity(inventoryItem) {
    return {
      id: inventoryItem.id,
      restaurantId: inventoryItem.restaurantId,
      name: inventoryItem.name,
      unitOfMeasure: inventoryItem.unitOfMeasure,
      currentStock: inventoryItem.currentStock,
      minimumStockLevel: inventoryItem.minimumStockLevel,
      category: inventoryItem.category,
      supplierId: inventoryItem.supplierId,
      supplierName: inventoryItem.supplierName
    };
  }
}

