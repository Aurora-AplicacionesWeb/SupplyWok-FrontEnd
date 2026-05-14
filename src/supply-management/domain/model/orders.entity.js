export class Orders {
    constructor({
                    id = null,
                    code = '',
                    supplierId = null,
                    supplierName = '',
                    restaurantName = '',
                    orderDate = null,
                    estimatedDate = null,
                    priority = '',
                    status = '',
                    items = []
                } = {}) {
        this.id = id;
        this.code = code;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.restaurantName = restaurantName;
        this.orderDate = orderDate;
        this.estimatedDate = estimatedDate;
        this.priority = priority;
        this.status = status;
        this.items = items;
    }
}