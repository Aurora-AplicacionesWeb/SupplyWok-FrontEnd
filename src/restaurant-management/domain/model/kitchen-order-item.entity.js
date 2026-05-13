export class KitchenOrderItem {
    constructor({id=null, kitchenOrderId=null, dishId=null, dishName='', quantity=0,
                    unitPrice=0.0, totalPrice=0.0, state='', observations=''}) {
        this.id=id;
        this.kitchenOrderId=kitchenOrderId;
        this.dishId = dishId;
        this.dishName = dishName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.state = state;
        this.observations = observations;
    }
}