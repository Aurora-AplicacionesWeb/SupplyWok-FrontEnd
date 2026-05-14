export class SupplierSettings {
    constructor({
                    id = null,
                    supplierName = '',
                    supportContact = '',
                    notifications = { email: false, sms: false },
                    serviceZones = [],
                    contacts = []
                } = {}) {
        this.id = id;
        this.supplierName = supplierName;
        this.supportContact = supportContact;
        this.notifications = notifications;
        this.serviceZones = serviceZones;
        this.contacts = contacts;
    }
}
