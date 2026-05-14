import { SupplierAlert } from '../domain/model/supplier-alert.entity.js';

export class SupplierAlertAssembler {
    static toEntityFromResource(resource) {
        return new SupplierAlert({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data.alerts ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
