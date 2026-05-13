import {HistoryStateKitchenOrder} from "../domain/model/history-state-kitchen-order.entity.js";

export class HistoryStateKitchenOrderAssembler {
    static toEntityFromResource(resource) {
        return new HistoryStateKitchenOrder({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['historyStateKitchenOrders'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}