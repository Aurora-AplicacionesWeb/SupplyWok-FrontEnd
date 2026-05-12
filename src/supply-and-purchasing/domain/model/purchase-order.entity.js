import { OrderItem } from './order-item.entity.js';

/**
 * Purchase order entity in the Supply and Purchasing bounded context.
 *
 * @class PurchaseOrder
 */
export class PurchaseOrder {
    /**
     * @param {Object} params - Entity attributes.
     * @param {number|string|null} [params.id=null] - Purchase order identifier.
     * @param {number|string|null} [params.supplierId=null] - Related supplier identifier.
     * @param {string} [params.supplierName=''] - Related supplier business name.
     * @param {string} [params.orderDate=''] - Purchase order creation date.
     * @param {string} [params.priority=''] - Purchase order priority level.
     * @param {string} [params.status=''] - Current purchase order status.
     * @param {OrderItem[]|Object[]} [params.items=[]] - Purchase order line items.
     */
    constructor({
                    id = null,
                    supplierId = null,
                    supplierName = '',
                    orderDate = '',
                    priority = '',
                    status = '',
                    items = []
                }) {
        this.id = id;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.orderDate = orderDate;
        this.priority = priority;
        this.status = status;
        this.items = items.map((item) =>
            item instanceof OrderItem ? item : new OrderItem(item)
        );
    }
}