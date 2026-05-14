import { SupplierSubscription } from '../domain/model/supplier-subscription.entity.js';

export class SupplierSubscriptionAssembler {
    static toEntityFromResource(resource) {
        return new SupplierSubscription({ ...resource });
    }

    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return new SupplierSubscription();
        }

        const resource = response.data instanceof Array
            ? response.data[0]
            : response.data.supplierSubscription ?? response.data['supplier-subscriptions']?.[0] ?? response.data;

        return this.toEntityFromResource(resource ?? {});
    }
}
