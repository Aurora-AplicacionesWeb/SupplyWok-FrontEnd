import {KitchenOrderItem} from "./kitchen-order-item.entity.js";

export class KitchenOrder {
    constructor({id=null, number='', tableId=null, tableNumber=0, typeService='', state='',
                    item= [], items: itemsProp = [],
                    observations='', dateCreated=null, hourReady=null, hourDelivered=null, preparationTime=null}) {
        this.id = id;
        this.number = number;
        this.tableId = tableId;
        this.tableNumber = tableNumber;
        this.typeService = typeService;
        this.state = state;
        const orderItems = (item && item.length > 0) ? item : (itemsProp || []);
        this.item = orderItems.map(i => i instanceof KitchenOrderItem ? i : new KitchenOrderItem({...i}));
        this.observations = observations;
        this.dateCreated = dateCreated ? new Date(dateCreated) : null;
        this.hourReady = hourReady ? new Date(hourReady) : null;
        this.hourDelivered = hourDelivered ? new Date(hourDelivered) : null;
        this.preparationTime = preparationTime;
    }
}