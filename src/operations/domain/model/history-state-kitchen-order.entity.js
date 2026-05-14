export class HistoryStateKitchenOrder {
    constructor({id=null, kitchenOrderId=null, previousState='', nextState='', dateChange=null, observation=''}) {
        this.id = id;
        this.kitchenOrderId = kitchenOrderId;
        this.previousState = previousState;
        this.nextState = nextState;
        this.dateChange = dateChange ? new Date(dateChange) : new Date();
        this.observation = observation;
    }
}