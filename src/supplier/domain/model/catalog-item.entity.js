export class CatalogItem {
    constructor({
                    id = null,
                    name = '',
                    category = '',
                    price = 0,
                    unit = '',
                    deliveryConditions = ''
                } = {}) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.unit = unit;
        this.deliveryConditions = deliveryConditions;
    }
}
