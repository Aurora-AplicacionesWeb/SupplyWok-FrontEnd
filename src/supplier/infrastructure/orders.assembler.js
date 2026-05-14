import { Orders } from "../domain/model/orders.entity.js";

export class OrdersAssembler {
    static toEntityFromResource(resource) {
        return new Orders({...resource});
    }
    static toEntitiesFromResponse(response){
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data.purchaseOrders ?? response.data['purchase-orders'] ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
