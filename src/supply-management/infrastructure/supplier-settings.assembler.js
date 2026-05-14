import { SupplierSettings } from '../domain/model/supplier-settings.entity.js';

export class SupplierSettingsAssembler {
    static toEntityFromResource(resource) {
        return new SupplierSettings({ ...resource });
    }

    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return new SupplierSettings();
        }

        const resource = response.data instanceof Array
            ? response.data[0]
            : response.data.supplierSettings ?? response.data['supplier-settings']?.[0] ?? response.data;

        return this.toEntityFromResource(resource ?? {});
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            supplierName: entity.supplierName,
            supportContact: entity.supportContact,
            notifications: entity.notifications,
            serviceZones: entity.serviceZones,
            contacts: entity.contacts
        };
    }
}
