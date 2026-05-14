export class Table {

    constructor({id=null, code='', number='', capacity='', location='', state='',
                    kitchenOrderId= null, active= true}) {
        this.id = id;
        this.code = code;
        this.number = number;
        this.capacity = capacity;
        this.location = location;
        this.state = state;
        this.kitchenOrderId = kitchenOrderId;
        this.active = active;
    }
}