export const MovementType = Object.freeze({
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  ADJUSTMENT: 'ADJUSTMENT',
});

let nextStockMovementId = 1;

export class StockMovement {
  #id;
  #inventoryItemId;
  #type;
  #amount;
  #date;
  #reason;

  constructor(idOrParams, inventoryItemId, type, amount, date = new Date(), reason = '') {
    if (typeof idOrParams === 'object' && idOrParams !== null) {
      const params = idOrParams;
      this.#id = params.id ?? StockMovement.generateId();
      this.#inventoryItemId = params.inventoryItemId;
      this.#type = params.type;
      this.#amount = params.amount;
      this.#date = params.date ?? new Date();
      this.#reason = params.reason ?? '';
    } else {
      this.#id = typeof idOrParams === 'number' ? idOrParams : StockMovement.generateId();
      this.#inventoryItemId = inventoryItemId;
      this.#type = type;
      this.#amount = amount;
      this.#date = date;
      this.#reason = reason;
    }
  }

  get id() {
    return this.#id;
  }

  get inventoryItemId() {
    return this.#inventoryItemId;
  }

  get type() {
    return this.#type;
  }

  get amount() {
    return this.#amount;
  }

  get date() {
    return this.#date;
  }

  get reason() {
    return this.#reason;
  }

  isEntry() {
    return this.#type === MovementType.ENTRY;
  }

  isExit() {
    return this.#type === MovementType.EXIT;
  }

  isAdjustment() {
    return this.#type === MovementType.ADJUSTMENT;
  }

  getDetails() {
    return {
      id: this.#id,
      inventoryItemId: this.#inventoryItemId,
      type: this.#type,
      amount: this.#amount,
      date: this.#date,
      reason: this.#reason,
    };
  }

  toPlainObject() {
    return {
      id: this.#id,
      inventoryItemId: this.#inventoryItemId,
      type: this.#type,
      amount: this.#amount,
      date: this.#date.toISOString(),
      reason: this.#reason,
    };
  }

  static generateId() {
    return nextStockMovementId++;
  }
}

