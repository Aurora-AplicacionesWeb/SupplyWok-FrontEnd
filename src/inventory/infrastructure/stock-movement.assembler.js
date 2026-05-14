import { StockMovement } from '../domain/model/stock-movement.entity.js';

/**
 * Assembler that transforms API responses into StockMovement domain entities
 */
export class StockMovementAssembler {
  /**
   * Transform a single API resource into a StockMovement entity
   * @param {Object} resource - Raw API response object
   * @returns {StockMovement}
   */
  static toEntityFromResource(resource) {
    return new StockMovement({
      id: resource.id,
      inventoryItemId: resource.inventoryItemId,
      type: resource.type,
      amount: resource.amount,
      date: typeof resource.date === 'string' ? new Date(resource.date) : resource.date,
      reason: resource.reason ?? ''
    });
  }

  /**
   * Transform API response array into StockMovement entities
   * @param {Object} response - Axios response object
   * @returns {StockMovement[]}
   */
  static toEntitiesFromResponse(response) {
    const data = response.data;
    const resources = Array.isArray(data) ? data : data.movements ?? data.StockMovement ?? data.stockMovements ?? [data];

    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Convert a StockMovement entity to a plain object for API submission
   * @param {StockMovement} stockMovement
   * @returns {Object}
   */
  static toResourceFromEntity(stockMovement) {
    return {
      id: stockMovement.id,
      inventoryItemId: stockMovement.inventoryItemId,
      type: stockMovement.type,
      amount: stockMovement.amount,
      date: stockMovement.date.toISOString(),
      reason: stockMovement.reason
    };
  }
}

