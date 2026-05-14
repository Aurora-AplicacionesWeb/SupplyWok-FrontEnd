import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

let mockTables = [
    { id: 1, code: 'M-01', number: '01', capacity: 4, location: 'main_hall', state: 'busy', kitchenOrderId: 11, active: true },
    { id: 2, code: 'M-02', number: '02', capacity: 4, location: 'main_hall', state: 'available', kitchenOrderId: null, active: true },
    { id: 3, code: 'T-03', number: '03', capacity: 2, location: 'terrace', state: 'busy', kitchenOrderId: 12, active: true }
];

const mockDishCategories = [
    { id: 1, name: 'Rice', order: 1, active: true },
    { id: 2, name: 'Noodles', order: 2, active: true },
    { id: 3, name: 'Special Dishes', order: 3, active: true }
];

const mockDishes = [
    { id: 1, code: 'D-101', name: 'Arroz chaufa', description: 'Classic wok-fried rice.', price: 28, categoryId: 1, categoryName: 'Rice', active: true, outstanding: true },
    { id: 2, code: 'D-102', name: 'Tallarines saltados', description: 'Stir-fried noodles.', price: 30, categoryId: 2, categoryName: 'Noodles', active: true, outstanding: true },
    { id: 3, code: 'D-103', name: 'Pollo tipakay', description: 'Crispy chicken in sweet sauce.', price: 36, categoryId: 3, categoryName: 'Special Dishes', active: true, outstanding: false }
];

let mockKitchenOrders = [
    { id: 11, number: 'C001', tableId: 1, tableNumber: '01', typeService: 'table_service', state: 'pending', observations: '', dateCreated: '2026-05-14T10:00:00.000Z' },
    { id: 12, number: 'C002', tableId: 3, tableNumber: '03', typeService: 'table_service', state: 'in_preparation', observations: 'No cebolla', dateCreated: '2026-05-14T10:08:00.000Z' },
    { id: 13, number: 'C003', tableId: null, tableNumber: null, typeService: 'to_take_home', state: 'ready', observations: '', dateCreated: '2026-05-14T10:15:00.000Z', hourReady: '2026-05-14T10:28:00.000Z' }
];

let mockKitchenOrderItems = [
    { id: 101, kitchenOrderId: 11, dishId: 1, dishName: 'Arroz chaufa', quantity: 2, unitPrice: 28, totalPrice: 56, state: 'pending', observations: '' },
    { id: 102, kitchenOrderId: 12, dishId: 2, dishName: 'Tallarines saltados', quantity: 1, unitPrice: 30, totalPrice: 30, state: 'in_preparation', observations: 'Sin aji' },
    { id: 103, kitchenOrderId: 13, dishId: 3, dishName: 'Pollo tipakay', quantity: 1, unitPrice: 36, totalPrice: 36, state: 'ready', observations: '' }
];

let mockKitchenLocks = [
    { id: 1, userId: 1, stateLocked: false, password: '123456', lastLockedAt: '2026-05-13T20:00:00.000Z', lastUnlockedAt: '2026-05-14T09:00:00.000Z', failAttempt: 0, lockUntil: null }
];

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

        if (dishesPath && !useMockApi) this.#dishesEndpoint = new BaseEndpoint(this, dishesPath);
        if (categoriesPath && !useMockApi) this.#dishesCategoriesEndpoint = new BaseEndpoint(this, categoriesPath);
        if (locksPath && !useMockApi) this.#kitchenLocksEndpoint = new BaseEndpoint(this, locksPath);
        if (ordersPath && !useMockApi) this.#kitchenOrdersEndpoint = new BaseEndpoint(this, ordersPath);
        if (itemsPath && !useMockApi) this.#kitchenOrderItemsEndpoint = new BaseEndpoint(this, itemsPath);
        if (tablesPath && !useMockApi) this.#tablesEndpoint = new BaseEndpoint(this, tablesPath);
    }

    getDishes() {
        return this.#getCollection(this.#dishesEndpoint, 'dishes', mockDishes, 'dishes');
    }

    getDishCategories() {
        return this.#getCollection(this.#dishesCategoriesEndpoint, 'dish categories', mockDishCategories, 'dishCategories');
    }

    getTables() {
        return this.#getCollection(this.#tablesEndpoint, 'tables', mockTables, 'tables');
    }

    createTable(resource) {
        if (this.#tablesEndpoint) {
            return this.#tablesEndpoint.create(resource).catch((error) => {
                console.warn('Remote tables API unavailable, creating table in local fallback.', error);
                return this.#createMockResource(resource, mockTables);
            });
        }

        return Promise.resolve(this.#createMockResource(resource, mockTables));
    }

    getKitchenOrders() {
        return this.#getCollection(this.#kitchenOrdersEndpoint, 'kitchen orders', mockKitchenOrders, 'kitchenOrders');
    }

    getKitchenOrderById(id) {
        if (this.#kitchenOrdersEndpoint) {
            return this.#kitchenOrdersEndpoint.getById(id).catch((error) => {
                console.warn(`Remote kitchen orders API unavailable, using local fallback for order ${id}.`, error);
                return this.#buildResponse(this.#findById(mockKitchenOrders, id));
            });
        }

        return Promise.resolve(this.#buildResponse(this.#findById(mockKitchenOrders, id)));
    }

    createKitchenOrder(resource) {
        if (this.#kitchenOrdersEndpoint) {
            return this.#kitchenOrdersEndpoint.create(resource).catch((error) => {
                console.warn('Remote kitchen orders API unavailable, creating order in local fallback.', error);
                return this.#createMockKitchenOrder(resource);
            });
        }

        return Promise.resolve(this.#createMockKitchenOrder(resource));
    }

    updateKitchenOrder(id, resource) {
        return this.updateKitchenOrderFull(id, resource);
    }

    updateKitchenOrderFull(id, resource) {
        if (this.#kitchenOrdersEndpoint) {
            return this.#kitchenOrdersEndpoint.update(id, resource).catch((error) => {
                console.warn(`Remote kitchen orders API unavailable, updating order ${id} in local fallback.`, error);
                return this.#updateMockKitchenOrder(id, resource);
            });
        }

        return Promise.resolve(this.#updateMockKitchenOrder(id, resource));
    }

    updateKitchenOrderStatus(id, newState, observation) {
        const resource = { state: newState, observations: observation };
        if (newState === 'ready') resource.hourReady = new Date().toISOString();
        if (newState === 'delivered') resource.hourDelivered = new Date().toISOString();
        return this.updateKitchenOrder(id, resource);
    }

    getKitchenOrderItems() {
        return this.#getCollection(this.#kitchenOrderItemsEndpoint, 'kitchen order items', mockKitchenOrderItems, 'kitchenOrderItems');
    }

    getKitchenLock() {
        return this.#getCollection(this.#kitchenLocksEndpoint, 'kitchen locks', mockKitchenLocks, 'kitchenLocks');
    }

    updateKitchenLock(resource) {
        if (this.#kitchenLocksEndpoint) {
            return this.#kitchenLocksEndpoint.update(resource.id, resource).catch((error) => {
                console.warn(`Remote kitchen locks API unavailable, updating lock ${resource.id} in local fallback.`, error);
                return this.#updateMockKitchenLock(resource);
            });
        }

        return Promise.resolve(this.#updateMockKitchenLock(resource));
    }

    deleteKitchenOrder(id) {
        if (this.#kitchenOrdersEndpoint) {
            return this.#kitchenOrdersEndpoint.delete(id).catch((error) => {
                console.warn(`Remote kitchen orders API unavailable, deleting order ${id} in local fallback.`, error);
                return this.#deleteMockKitchenOrder(id);
            });
        }

        return Promise.resolve(this.#deleteMockKitchenOrder(id));
    }

    #getCollection(endpoint, label, records, responseKey) {
        if (endpoint) {
            return endpoint.getAll().catch((error) => {
                console.warn(`Remote ${label} API unavailable, using local fallback.`, error);
                return this.#buildResponse({ [responseKey]: records });
            });
        }

        return Promise.resolve(this.#buildResponse({ [responseKey]: records }));
    }

    #buildResponse(data) {
        return {
            status: 200,
            statusText: 'OK',
            data
        };
    }

    #findById(records, id) {
        return records.find((record) => String(record.id) === String(id)) ?? null;
    }

    #createMockResource(resource, records) {
        const nextRecord = { ...resource, id: Date.now() };
        records.push(nextRecord);
        return this.#buildResponse(nextRecord);
    }

    #createMockKitchenOrder(resource) {
        const nextOrder = {
            ...resource,
            id: Date.now()
        };

        mockKitchenOrders.push(nextOrder);

        if (Array.isArray(resource.items)) {
            resource.items.forEach((item, index) => {
                mockKitchenOrderItems.push({
                    id: Date.now() + index + 1,
                    kitchenOrderId: nextOrder.id,
                    ...item
                });
            });
        }

        return this.#buildResponse(nextOrder);
    }

    #updateMockKitchenOrder(id, resource) {
        const index = mockKitchenOrders.findIndex((record) => String(record.id) === String(id));
        const current = index >= 0 ? mockKitchenOrders[index] : { id };
        const nextOrder = { ...current, ...resource, id: current.id ?? id };

        if (index >= 0) {
            mockKitchenOrders[index] = nextOrder;
        } else {
            mockKitchenOrders.push(nextOrder);
        }

        if (Array.isArray(resource.items)) {
            mockKitchenOrderItems = mockKitchenOrderItems.filter((item) => String(item.kitchenOrderId) !== String(id));
            resource.items.forEach((item, index2) => {
                mockKitchenOrderItems.push({
                    id: Date.now() + index2 + 1,
                    kitchenOrderId: nextOrder.id,
                    ...item
                });
            });
        }

        return this.#buildResponse(nextOrder);
    }

    #updateMockKitchenLock(resource) {
        const index = mockKitchenLocks.findIndex((record) => String(record.id) === String(resource.id));
        const current = index >= 0 ? mockKitchenLocks[index] : { id: resource.id };
        const nextLock = { ...current, ...resource };

        if (index >= 0) {
            mockKitchenLocks[index] = nextLock;
        } else {
            mockKitchenLocks.push(nextLock);
        }

        return this.#buildResponse(nextLock);
    }

    #deleteMockKitchenOrder(id) {
        mockKitchenOrders = mockKitchenOrders.filter((record) => String(record.id) !== String(id));
        mockKitchenOrderItems = mockKitchenOrderItems.filter((record) => String(record.kitchenOrderId) !== String(id));

        return this.#buildResponse({});
    }
}
