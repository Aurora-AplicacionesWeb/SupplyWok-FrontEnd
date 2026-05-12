import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const ordersEndpointPath=import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH ?? '';

export class SupplyManagementApi extends BaseApi {
    #supplyManagementEndpoint;
    constructor(){
        super();
        this.#supplyManagementEndpoint= new BaseEndpoint(this,ordersEndpointPath);
    }
    getOrders(){
        return this.#supplyManagementEndpoint.getAll();
    }
    getOrderById(id){
        return this.#supplyManagementEndpoint.getById(id);
    }
    createOrder(order){
        return this.#supplyManagementEndpoint.create(order);
    }
    updateOrder(id,order){
        return this.#supplyManagementEndpoint.update(id,order);
    }
    deleteOrder(id){
        return this.#supplyManagementEndpoint.delete(id);
    }
    getOrderItems(id){
        return this.#supplyManagementEndpoint.getById(id);
    }
}