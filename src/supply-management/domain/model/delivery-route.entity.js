export class DeliveryRoute {
    constructor({
                    id = null,
                    date = '',
                    routeName = '',
                    supplierName = '',
                    vehicle = '',
                    status = 'planned',
                    totalStops = 0,
                    totalOrders = 0,
                    estimatedDeparture = '',
                    estimatedArrival = '',
                    estimatedDurationMinutes = 0,
                    stops = []
                } = {}) {
        this.id = id;
        this.date = date;
        this.routeName = routeName;
        this.supplierName = supplierName;
        this.vehicle = vehicle;
        this.status = status;
        this.totalStops = totalStops;
        this.totalOrders = totalOrders;
        this.estimatedDeparture = estimatedDeparture;
        this.estimatedArrival = estimatedArrival;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.stops = stops;
    }
}
