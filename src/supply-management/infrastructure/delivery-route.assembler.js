import { DeliveryRoute } from '../domain/model/delivery-route.entity.js';

export class DeliveryRouteAssembler {
    static toEntityFromResource(resource) {
        return new DeliveryRoute({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['delivery-routes'] ?? response.data.deliveryRoutes ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
