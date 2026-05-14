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
     * @param {string} [params.code=''] - Purchase order business code.
     * @param {number|string|null} [params.supplierId=null] - Related supplier identifier.
     * @param {string} [params.supplierName=''] - Related supplier business name.
     * @param {string} [params.restaurantName=''] - Restaurant that created the purchase order.
     * @param {string} [params.orderDate=''] - Purchase order creation date.
     * @param {string} [params.estimatedDate=''] - Expected delivery date.
     * @param {string} [params.priority=''] - Purchase order priority level.
     * @param {string} [params.status=''] - Current purchase order status.
     * @param {OrderItem[]|Object[]} [params.items=[]] - Purchase order line items.
     */
    constructor({
                    id = null,
                    code = '',
                    supplierId = null,
                    supplierName = '',
                    restaurantName = '',
                    orderDate = '',
                    estimatedDate = '',
                    priority = '',
                    status = '',
                    items = []
                }) {
        this.id = id;
        this.code = code;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.restaurantName = restaurantName;
        this.orderDate = orderDate;
        this.estimatedDate = estimatedDate;
        this.priority = priority;
        this.status = status;
        this.items = items.map((item) =>
            item instanceof OrderItem ? item : new OrderItem(item)
        );
    }
}
