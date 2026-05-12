import { Order } from "../domain/order.js";

export class OrdersAssembler {
    static toEntityFromResource(resource) {
        return new Order({...resource});
    }
    static toEntitiesFromResponse(response){
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['purchase-orders'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}