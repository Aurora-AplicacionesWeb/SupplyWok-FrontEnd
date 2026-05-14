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

        const dishesPath = import.meta.env.VITE_DISHES_ENDPOINT_PATH;
        const categoriesPath = import.meta.env.VITE_DISHES_CATEGORIES_ENDPOINT_PATH;
        const locksPath = import.meta.env.VITE_KITCHEN_LOCKS_ENDPOINT_PATH;
        const ordersPath = import.meta.env.VITE_KITCHEN_ORDERS_ENDPOINT_PATH;
        const itemsPath = import.meta.env.VITE_KITCHEN_ORDER_ITEMS_ENDPOINT_PATH;
        const tablesPath = import.meta.env.VITE_TABLES_ENDPOINT_PATH;

        if (dishesPath) this.#dishesEndpoint = new BaseEndpoint(this, dishesPath);
        if (categoriesPath) this.#dishesCategoriesEndpoint = new BaseEndpoint(this, categoriesPath);
        if (locksPath) this.#kitchenLocksEndpoint = new BaseEndpoint(this, locksPath);
        if (ordersPath) this.#kitchenOrdersEndpoint = new BaseEndpoint(this, ordersPath);
        if (itemsPath) this.#kitchenOrderItemsEndpoint = new BaseEndpoint(this, itemsPath);
        if (tablesPath) this.#tablesEndpoint = new BaseEndpoint(this, tablesPath);
    }

    getDishes() {
        return this.#requireEndpoint(this.#dishesEndpoint).getAll();
    }

    getDishCategories() {
        return this.#requireEndpoint(this.#dishesCategoriesEndpoint).getAll();
    }

    getTables() {
        return this.#requireEndpoint(this.#tablesEndpoint).getAll();
    }

    createTable(resource) {
        return this.#requireEndpoint(this.#tablesEndpoint).create(resource);
    }

    getKitchenOrders() {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).getAll();
    }

    getKitchenOrderById(id) {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).getById(id);
    }

    createKitchenOrder(resource) {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).create(resource);
    }

    updateKitchenOrder(id, resource) {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).update(id, resource);
    }

    updateKitchenOrderFull(id, resource) {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).update(id, resource);
    }

    updateKitchenOrderStatus(id, newState, observation) {
        const resource = { state: newState, observations: observation };
        if (newState === 'ready') resource.hourReady = new Date().toISOString();
        if (newState === 'delivered') resource.hourDelivered = new Date().toISOString();
        return this.updateKitchenOrder(id, resource);
    }

    getKitchenOrderItems() {
        return this.#requireEndpoint(this.#kitchenOrderItemsEndpoint).getAll();
    }

    getKitchenLock() {
        return this.#requireEndpoint(this.#kitchenLocksEndpoint).getAll();
    }

    updateKitchenLock(resource) {
        return this.#requireEndpoint(this.#kitchenLocksEndpoint).update(resource.id, resource);
    }

    deleteKitchenOrder(id) {
        return this.#requireEndpoint(this.#kitchenOrdersEndpoint).delete(id);
    }

    #requireEndpoint(endpoint) {
        if (!endpoint) {
            throw new Error('API endpoint not configured. Check your environment variables.');
        }
        return endpoint;
    }
}
