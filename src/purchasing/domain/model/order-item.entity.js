/**
 * Order item entity in the Supply and Purchasing bounded context.
 *
 * @class OrderItem
 */
export class OrderItem {
    /**
     * @param {Object} params - Entity attributes.
     * @param {number|string|null} [params.id=null] - Order item identifier.
     * @param {number|string|null} [params.inventoryItemId=null] - Related inventory item identifier.
     * @param {string} [params.productName=''] - Product name included in the purchase order.
     * @param {number} [params.quantity=0] - Requested quantity.
     * @param {number} [params.unitPrice=0] - Unit price for the requested product.
     * @param {string} [params.unitType=''] - Unit type (e.g., 'kg', 'pcs').
     */
    constructor({
                    id = null,
                    inventoryItemId = null,
                    productName = '',
                    quantity = 0,
                    unitPrice = 0,
                    unitType = ''
                }) {
        this.id = id;
        this.inventoryItemId = inventoryItemId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.unitType = unitType;
    }
}