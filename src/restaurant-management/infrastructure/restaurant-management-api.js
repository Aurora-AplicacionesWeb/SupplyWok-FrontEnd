import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

export class RestaurantManagementApi extends BaseApi {
    #dishesEndpoint;
    #dishesCategoriesEndpoint;
    #kitchenLocksEndpoint;
    #kitchenOrdersEndpoint;
    #kitchenOrderItemsEndpoint;
    #tablesEndpoint;

    constructor() {
        super();

        this.#dishesEndpoint = new BaseEndpoint(this, import.meta.env.VITE_DISHES_ENDPOINT_PATH);
        this.#dishesCategoriesEndpoint = new BaseEndpoint(this, import.meta.env.VITE_DISHES_CATEGORIES_ENDPOINT_PATH);
        this.#kitchenLocksEndpoint = new BaseEndpoint(this, import.meta.env.VITE_KITCHEN_LOCKS_ENDPOINT_PATH);
        this.#kitchenOrdersEndpoint = new BaseEndpoint(this, import.meta.env.VITE_KITCHEN_ORDERS_ENDPOINT_PATH);
        this.#kitchenOrderItemsEndpoint = new BaseEndpoint(this, import.meta.env.VITE_KITCHEN_ORDER_ITEMS_ENDPOINT_PATH);
        this.#tablesEndpoint = new BaseEndpoint(this, import.meta.env.VITE_TABLES_ENDPOINT_PATH);
    }

    getDishes() {
        return this.#dishesEndpoint.getAll();
    }

    getDishCategories() {
        return this.#dishesCategoriesEndpoint.getAll();
    }

    getTables() {
        return this.#tablesEndpoint.getAll();
    }

    createTable(resource) {
        return this.#tablesEndpoint.create(resource);
    }

    getKitchenOrders() {
        return this.#kitchenOrdersEndpoint.getAll();
    }

    getKitchenOrderById(id) {
        return this.#kitchenOrdersEndpoint.getById(id);
    }

    createKitchenOrder(resource) {
        return this.#kitchenOrdersEndpoint.create(resource);
    }

    updateKitchenOrder(id, resource) {
        return this.updateKitchenOrderFull(id, resource);
    }

    updateKitchenOrderFull(id, resource) {
        return this.#kitchenOrdersEndpoint.update(id, resource);
    }

    updateKitchenOrderStatus(id, newState, observation) {
        const resource = { state: newState, observations: observation };
        if (newState === 'ready') resource.hourReady = new Date().toISOString();
        if (newState === 'delivered') resource.hourDelivered = new Date().toISOString();
        return this.updateKitchenOrder(id, resource);
    }

    getKitchenOrderItems() {
        return this.#kitchenOrderItemsEndpoint.getAll();
    }

    getKitchenLock() {
        return this.#kitchenLocksEndpoint.getAll();
    }

    updateKitchenLock(resource) {
        return this.#kitchenLocksEndpoint.update(resource.id, resource);
    }

    deleteKitchenOrder(id) {
        return this.#kitchenOrdersEndpoint.delete(id);
    }
}