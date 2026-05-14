export class Client {
    constructor({
                    id = null,
                    name = '',
                    district = '',
                    frequency = '',
                    averageTicket = 0,
                    demandProjectionPercent = 0,
                    status = '',
                    lastOrderDate = ''
                } = {}) {
        this.id = id;
        this.name = name;
        this.district = district;
        this.frequency = frequency;
        this.averageTicket = averageTicket;
        this.demandProjectionPercent = demandProjectionPercent;
        this.status = status;
        this.lastOrderDate = lastOrderDate;
    }
}
