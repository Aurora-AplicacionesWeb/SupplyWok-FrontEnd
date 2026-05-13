import { MovementType, StockMovement } from './stock-movement.entity.js';

export const UnitOfMeasure = Object.freeze({
  KILOGRAMS: 'KILOGRAMS',
  LITERS: 'LITERS',
  UNITS: 'UNITS',
  GRAMS: 'GRAMS'
});

const DEFAULT_INVENTORY_ITEM_ID = 1000;
let nextInventoryItemId = DEFAULT_INVENTORY_ITEM_ID;

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function toPositiveInteger(value, fieldName) {
  const numericValue = Number(value);

  if (!isPositiveInteger(numericValue)) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return numericValue;
}

function toNonNegativeNumber(value, fieldName) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number`);
  }

  return numericValue;
}

function normalizeMovements(movements) {
  if (!Array.isArray(movements)) {
    return [];
  }

  return movements
    .map((movement) => movement instanceof StockMovement ? movement : new StockMovement(movement))
    .sort((left, right) => left.date.getTime() - right.date.getTime());
}

export class InventoryItem {
  constructor(idOrParams, restaurantId, name, unitOfMeasure, initialStock = 0, minimumStockLevel = 0, movements = []) {
    const params = typeof idOrParams === 'object' && idOrParams !== null
      ? idOrParams
      : {
          id: idOrParams,
          restaurantId,
          name,
          unitOfMeasure,
          initialStock,
          minimumStockLevel,
          movements
        };

    const itemId = params.id ?? InventoryItem.generateId();
    const resolvedRestaurantId = params.restaurantId;
    const resolvedName = params.name;
    const resolvedUnitOfMeasure = params.unitOfMeasure;
    const resolvedCurrentStock = params.currentStock ?? params.initialStock ?? 0;
    const resolvedMinimumStockLevel = params.minimumStockLevel ?? 0;

    if (!isPositiveInteger(Number(itemId))) {
      throw new Error('InventoryItem id is required and must be a positive integer');
    }

    this.id = Number(itemId);
    this.restaurantId = toPositiveInteger(resolvedRestaurantId, 'restaurantId');

    if (!resolvedName || String(resolvedName).trim() === '') {
      throw new Error('name is required');
    }

    if (!resolvedUnitOfMeasure || !Object.values(UnitOfMeasure).includes(resolvedUnitOfMeasure)) {
      throw new Error('unitOfMeasure must be a valid UnitOfMeasure');
    }

    this.name = String(resolvedName).trim();
    this.unitOfMeasure = resolvedUnitOfMeasure;
    this.currentStock = toNonNegativeNumber(resolvedCurrentStock, 'currentStock');
    this.minimumStockLevel = toNonNegativeNumber(resolvedMinimumStockLevel, 'minimumStockLevel');
    this.movements = normalizeMovements(params.movements);
  }

  static generateId() {
    return nextInventoryItemId++;
  }

  static create(params = {}) {
    return new InventoryItem({
      id: InventoryItem.generateId(),
      ...params,
      initialStock: params.initialStock ?? params.currentStock ?? 0
    });
  }

  setMinimumStockLevel(amount) {
    this.minimumStockLevel = toNonNegativeNumber(amount, 'minimumStockLevel');
  }

  setCurrentStock(amount) {
    this.currentStock = toNonNegativeNumber(amount, 'currentStock');
  }

  attachMovements(movements = []) {
    this.movements = normalizeMovements(movements);
    return this;
  }

  addMovement(movement) {
    const normalizedMovement = movement instanceof StockMovement ? movement : new StockMovement(movement);
    this.movements = [...this.movements, normalizedMovement].sort((left, right) => left.date.getTime() - right.date.getTime());
    return normalizedMovement;
  }

  addStock(amount, reason = '') {
    const numericAmount = toNonNegativeNumber(amount, 'amount');

    if (numericAmount <= 0) {
      throw new Error('amount must be greater than zero');
    }

    this.currentStock += numericAmount;

    return this.addMovement(new StockMovement({
      inventoryId: this.id,
      type: MovementType.ENTRY,
      amount: numericAmount,
      date: new Date(),
      reason
    }));
  }

  removeStock(amount, reason = '') {
    const numericAmount = toNonNegativeNumber(amount, 'amount');

    if (numericAmount <= 0) {
      throw new Error('amount must be greater than zero');
    }

    if (numericAmount > this.currentStock) {
      throw new Error('insufficient stock available');
    }

    this.currentStock -= numericAmount;

    return this.addMovement(new StockMovement({
      inventoryId: this.id,
      type: MovementType.EXIT,
      amount: numericAmount,
      date: new Date(),
      reason
    }));
  }

  adjustStock(amount, reason = '') {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount === 0) {
      throw new Error('amount must be a valid non-zero number');
    }

    const nextStock = this.currentStock + numericAmount;

    if (nextStock < 0) {
      throw new Error('adjustment cannot reduce stock below zero');
    }

    this.currentStock = nextStock;

    return this.addMovement(new StockMovement({
      inventoryId: this.id,
      type: MovementType.ADJUSTMENT,
      amount: Math.abs(numericAmount),
      date: new Date(),
      reason
    }));
  }

  hasCriticalStock() {
    return this.currentStock <= this.minimumStockLevel;
  }

  getStockStatus() {
    if (this.hasCriticalStock()) {
      return 'critical';
    }

    if (this.currentStock <= this.minimumStockLevel * 1.5) {
      return 'warning';
    }

    return 'healthy';
  }

  getStockLevelPercentage() {
    if (this.minimumStockLevel <= 0) {
      return this.currentStock > 0 ? 100 : 0;
    }

    return Math.min(100, Math.round((this.currentStock / this.minimumStockLevel) * 100));
  }

  getStockGap() {
    return this.currentStock - this.minimumStockLevel;
  }

  getMovements() {
    return [...this.movements];
  }

  getMovementsByType(type) {
    if (!Object.values(MovementType).includes(type)) {
      throw new Error('Invalid movement type');
    }

    return this.movements.filter((movement) => movement.type === type);
  }

  getMovementCount() {
    return this.movements.length;
  }

  getLastMovement() {
    return this.movements.at(-1) ?? null;
  }
}

