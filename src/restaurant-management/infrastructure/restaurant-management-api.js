import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const dishesEndpointPath = import.meta.env.VITE_DISHES_ENDPOINT_PATH ?? '';
const dishesCategoriesEndpointPath = import.meta.env.VITE_DISHES_CATEGORIES_ENDPOINT_PATH ?? '';
const historyStateKitchenOrdersEndpointPath = import.meta.env.VITE_HISTORY_STATE_KITCHEN_ORDERS_ENDPOINT_PATH ?? '';
const kitchenLocksEndpointPath = import.meta.env.VITE_KITCHEN_LOCKS_ENDPOINT_PATH ?? '';
const kitchenOrdersEndpointPath = import.meta.env.VITE_KITCHEN_ORDERS_ENDPOINT_PATH ?? '';
const kitchenOrderItemsEndpointPath = import.meta.env.VITE_KITCHEN_ORDER_ITEMS_ENDPOINT_PATH ?? '';
const tablesEndpointPath = import.meta.env.VITE_TABLES_ENDPOINT_PATH ?? '';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

const mockDishCategories = [
    { id: 1, name: 'Rice', order: 1, active: true },
    { id: 2, name: 'Noodles', order: 2, active: true },
    { id: 3, name: 'Soups', order: 3, active: true },
    { id: 4, name: 'Special Dishes', order: 4, active: true },
    { id: 5, name: 'Desserts', order: 5, active: true },
    { id: 6, name: 'Drinks', order: 6, active: true }
];

let mockDishes = [
    { id: 1, code: 'CHF001', name: 'Arroz Chaufa', description: 'Arroz salteado con huevo, verduras y pollo', price: 22.50, categoryId: 1, categoryName: 'Rice', active: true, outstanding: true },
    { id: 2, code: 'CHF002', name: 'Arroz Chaufa Especial', description: 'Arroz salteado con camarones, langostinos y carne', price: 28.00, categoryId: 1, categoryName: 'Rice', active: true, outstanding: true },
    { id: 3, code: 'CHF003', name: 'Tallarín Saltado', description: 'Fideos salteados con verduras y carne', price: 21.00, categoryId: 2, categoryName: 'Noodles', active: true, outstanding: true },
    { id: 4, code: 'CHF004', name: 'Sopa Wantán', description: 'Sopa tradicional con wantanes de pollo', price: 18.00, categoryId: 3, categoryName: 'Soups', active: true, outstanding: false },
    { id: 5, code: 'CHF005', name: 'Lomo Saltado', description: 'Clásico lomo saltado con papas fritas y arroz', price: 26.50, categoryId: 4, categoryName: 'Special Dishes', active: true, outstanding: true },
    { id: 6, code: 'BEB001', name: 'Inca Kola', description: 'Gaseosa dorada peruana', price: 8.00, categoryId: 6, categoryName: 'Drinks', active: true, outstanding: false },
    { id: 7, code: 'BEB002', name: 'Coca Cola', description: 'Gaseosa tradicional', price: 8.00, categoryId: 6, categoryName: 'Drinks', active: true, outstanding: false },
    { id: 8, code: 'BEB003', name: 'Limonada', description: 'Bebida hecha a base de limón', price: 8.50, categoryId: 6, categoryName: 'Drinks', active: true, outstanding: false },
    { id: 9, code: 'CHF006', name: 'Pollo Tipakay', description: 'Pollo frito al estilo chifa bañado en una salsa agridulce de tamarindo, servido con piña adicional', price: 24.00, categoryId: 4, categoryName: 'Special Dishes', active: true, outstanding: true },
    { id: 10, code: 'CHF007', name: 'Pollo Chijaukay', description: 'Pollo deshuesado rebozado y frito, bañado en una salsa de ostión, sillao y aceite de ajonjolí, servido con nabo encurtido', price: 24.00, categoryId: 4, categoryName: 'Special Dishes', active: true, outstanding: true },
    { id: 11, code: 'CHF008', name: 'Kam Lu Wantán', description: 'Wantanes fritos acompañados de una salsa agridulce de tamarindo, trozos de pollo, chancho asado, piña y verduras', price: 22.00, categoryId: 4, categoryName: 'Special Dishes', active: true, outstanding: true },
    { id: 12, code: 'PST001', name: 'Min Pao Dulce', description: 'Panecillos al vapor, suaves y rellenos de pasta de frejol dulce o crema', price: 12.00, categoryId: 5, categoryName: 'Desserts', active: true, outstanding: true },
    { id: 13, code: 'PST002', name: 'Chin Toi', description: 'Bolitas fritas de harina de arroz cubiertas de ajonjolí, rellenas de frejol colado', price: 11.00, categoryId: 5, categoryName: 'Desserts', active: true, outstanding: true },
    { id: 14, code: 'PST003', name: 'Flan chino', description: 'Una versión ligera del flan tradicional, aromatizado con ingredientes locales', price: 10.00, categoryId: 5, categoryName: 'Desserts', active: true, outstanding: true }
];

let mockTables = [
    { id: 1, code: 'T-01', number: 1, capacity: 2, location: 'Main Hall', state: 'available', kitchenOrderId: null, active: true },
    { id: 2, code: 'T-02', number: 2, capacity: 4, location: 'Main Hall', state: 'available', kitchenOrderId: null, active: true },
    { id: 3, code: 'T-03', number: 3, capacity: 4, location: 'Main Hall', state: 'busy', kitchenOrderId: 1, active: true },
    { id: 4, code: 'T-04', number: 4, capacity: 6, location: 'Main Hall', state: 'available', kitchenOrderId: null, active: true },
    { id: 5, code: 'T-05', number: 5, capacity: 2, location: 'Terrace', state: 'busy', kitchenOrderId: 2, active: true },
    { id: 6, code: 'T-06', number: 6, capacity: 4, location: 'Terrace', state: 'available', kitchenOrderId: null, active: true },
    { id: 7, code: 'T-07', number: 7, capacity: 8, location: 'Bar', state: 'available', kitchenOrderId: null, active: true },
    { id: 8, code: 'T-08', number: 8, capacity: 4, location: 'Bar', state: 'busy', kitchenOrderId: 3, active: true }
];

let mockKitchenOrders = [
    {
        id: 1, number: 'C001', tableId: 2, tableNumber: '2', typeService: 'table_service', state: 'in_preparation',
        observations: '', dateCreated: '2026-05-09T18:30:00Z', hourReady: null, hourDelivered: null, preparationTime: null
    },
    {
        id: 2, number: 'C002', tableId: null, tableNumber: null, typeService: 'to_take_home', state: 'ready',
        observations: 'Cliente: Sr. Rodríguez', dateCreated: '2026-05-09T18:15:00Z', hourReady: '2026-05-09T18:35:00Z', hourDelivered: null, preparationTime: null
    },
    {
        id: 3, number: 'C003', tableId: 5, tableNumber: '5', typeService: 'table_service', state: 'ready',
        observations: '', dateCreated: '2026-05-09T18:00:00Z', hourReady: null, hourDelivered: null, preparationTime: null
    }
];

let mockKitchenOrderItems = [
    { id: 1, kitchenOrderId: 1, dishId: 1, dishName: 'Arroz Chaufa', quantity: 2, unitPrice: 22.50, totalPrice: 45.00, state: 'in_preparation', observations: 'uno sin ají' },
    { id: 2, kitchenOrderId: 1, dishId: 6, dishName: 'Inca Kola', quantity: 3, unitPrice: 8.00, totalPrice: 24.00, state: 'delivered', observations: '' },
    { id: 3, kitchenOrderId: 2, dishId: 5, dishName: 'Lomo Saltado', quantity: 1, unitPrice: 26.50, totalPrice: 26.50, state: 'pending', observations: '' },
    { id: 4, kitchenOrderId: 2, dishId: 7, dishName: 'Coca Cola', quantity: 2, unitPrice: 8.00, totalPrice: 16.00, state: 'delivered', observations: '' },
    { id: 5, kitchenOrderId: 3, dishId: 3, dishName: 'Tallarín Saltado', quantity: 3, unitPrice: 21.00, totalPrice: 63.00, state: 'ready', observations: '' },
    { id: 6, kitchenOrderId: 3, dishId: 12, dishName: 'Flan chino', quantity: 2, unitPrice: 10.00, totalPrice: 20.00, state: 'ready', observations: '' }
];

let mockKitchenLock = {
    id: 1, userId: null, stateLocked: false, password: 'desarrollo123', lastLockedAt: null, lastUnlockedAt: null, failAttempt: 0, lockUntil: null
};

export class RestaurantManagementApi extends BaseApi {
    #dishesEndpoint;
    #dishesCategoriesEndpoint;
    #historyStateKitchenOrdersEndpoint;
    #kitchenLocksEndpoint;
    #kitchenOrdersEndpoint;
    #kitchenOrderItemsEndpoint;
    #tablesEndpoint;

    constructor() {
        super();
        this.#dishesEndpoint = dishesEndpointPath && !useMockApi ? new BaseEndpoint(this, dishesEndpointPath) : null;
        this.#dishesCategoriesEndpoint = dishesCategoriesEndpointPath && !useMockApi ? new BaseEndpoint(this, dishesCategoriesEndpointPath) : null;
        this.#historyStateKitchenOrdersEndpoint = historyStateKitchenOrdersEndpointPath && !useMockApi ? new BaseEndpoint(this, historyStateKitchenOrdersEndpointPath) : null;
        this.#kitchenLocksEndpoint = kitchenLocksEndpointPath && !useMockApi ? new BaseEndpoint(this, kitchenLocksEndpointPath) : null;
        this.#kitchenOrdersEndpoint = kitchenOrdersEndpointPath && !useMockApi ? new BaseEndpoint(this, kitchenOrdersEndpointPath) : null;
        this.#kitchenOrderItemsEndpoint = kitchenOrderItemsEndpointPath && !useMockApi ? new BaseEndpoint(this, kitchenOrderItemsEndpointPath) : null;
        this.#tablesEndpoint = tablesEndpointPath && !useMockApi ? new BaseEndpoint(this, tablesEndpointPath) : null;
    }

    getDishes() {
        if (this.#dishesEndpoint) return this.#dishesEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { dishes: mockDishes } });
    }

    getDishCategories() {
        if (this.#dishesCategoriesEndpoint) return this.#dishesCategoriesEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { dishCategories: mockDishCategories } });
    }

    getTables() {
        if (this.#tablesEndpoint) return this.#tablesEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { tables: mockTables } });
    }

    createTable(resource) {
        if (this.#tablesEndpoint) return this.#tablesEndpoint.create(resource);
        const newTable = { ...resource, id: mockTables.length + 1 };
        mockTables = [...mockTables, newTable];
        return Promise.resolve({ status: 201, statusText: 'Created', data: newTable });
    }

    getKitchenOrders() {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { kitchenOrders: mockKitchenOrders } });
    }

    getKitchenOrderById(id) {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.getById(id);
        const numId = Number(id);
        const order = mockKitchenOrders.find(o => o.id === numId);
        if (!order) return Promise.resolve({ status: 404, statusText: 'Not Found', data: null });
        const items = mockKitchenOrderItems.filter(i => i.kitchenOrderId === numId);
        return Promise.resolve({ status: 200, statusText: 'OK', data: { ...order, items } });
    }

    createKitchenOrder(resource) {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.create(resource);
        const { items, ...orderData } = resource;
        const newOrder = { ...orderData, id: mockKitchenOrders.length + 1, number: `C${String(mockKitchenOrders.length + 1).padStart(3, '0')}`, dateCreated: new Date().toISOString() };
        mockKitchenOrders = [newOrder, ...mockKitchenOrders];
        if (items && items.length > 0) {
            const newItems = items.map((item, idx) => ({
                ...item, id: mockKitchenOrderItems.length + idx + 1, kitchenOrderId: newOrder.id
            }));
            mockKitchenOrderItems = [...mockKitchenOrderItems, ...newItems];
        }
        return Promise.resolve({ status: 201, statusText: 'Created', data: { ...newOrder, items: items || [] } });
    }

    updateKitchenOrder(id, resource) {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.update(id, resource);
        const index = mockKitchenOrders.findIndex(o => o.id === id);
        if (index !== -1) mockKitchenOrders[index] = { ...mockKitchenOrders[index], ...resource };
        return Promise.resolve({ status: 200, statusText: 'OK', data: mockKitchenOrders[index] });
    }

    updateKitchenOrderFull(id, resource) {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.update(id, resource);
        const { items, ...orderData } = resource;
        const numId = Number(id);
        const index = mockKitchenOrders.findIndex(o => o.id === numId);
        if (index === -1) return Promise.resolve({ status: 404, statusText: 'Not Found', data: null });
        mockKitchenOrders[index] = { ...mockKitchenOrders[index], ...orderData };
        mockKitchenOrderItems = mockKitchenOrderItems.filter(i => i.kitchenOrderId !== numId);
        if (items && items.length > 0) {
            const newItems = items.map((item, idx) => ({
                ...item, id: mockKitchenOrderItems.length + idx + 1, kitchenOrderId: numId
            }));
            mockKitchenOrderItems = [...mockKitchenOrderItems, ...newItems];
        }
        return Promise.resolve({ status: 200, statusText: 'OK', data: { ...mockKitchenOrders[index], items: items || [] } });
    }

    updateKitchenOrderStatus(id, newState, observation) {
        const resource = { state: newState, observations: observation };
        if (newState === 'ready') resource.hourReady = new Date().toISOString();
        if (newState === 'delivered') resource.hourDelivered = new Date().toISOString();
        return this.updateKitchenOrder(id, resource);
    }

    getKitchenOrderItems() {
        if (this.#kitchenOrderItemsEndpoint) return this.#kitchenOrderItemsEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { kitchenOrderItems: mockKitchenOrderItems } });
    }

    getKitchenLock() {
        if (this.#kitchenLocksEndpoint) return this.#kitchenLocksEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { kitchenLocks: [mockKitchenLock] } });
    }

    updateKitchenLock(resource) {
        if (this.#kitchenLocksEndpoint) return this.#kitchenLocksEndpoint.update(resource.id, resource);
        mockKitchenLock = { ...mockKitchenLock, ...resource };
        return Promise.resolve({ status: 200, statusText: 'OK', data: mockKitchenLock });
    }

    deleteKitchenOrder(id) {
        if (this.#kitchenOrdersEndpoint) return this.#kitchenOrdersEndpoint.delete(id);
        const index = mockKitchenOrders.findIndex(o => o.id === id);
        if (index !== -1) mockKitchenOrders.splice(index, 1);
        mockKitchenOrderItems = mockKitchenOrderItems.filter(i => i.kitchenOrderId !== id);
        return Promise.resolve({ status: 200, statusText: 'OK', data: {} });
    }

    createStateHistory(resource) {
        if (this.#historyStateKitchenOrdersEndpoint) return this.#historyStateKitchenOrdersEndpoint.create(resource);
        return Promise.resolve({ status: 201, statusText: 'Created', data: { ...resource, id: Date.now() } });
    }

    getHistoryByKitchenOrderId(kitchenOrderId) {
        if (this.#historyStateKitchenOrdersEndpoint) return this.#historyStateKitchenOrdersEndpoint.getAll();
        return Promise.resolve({ status: 200, statusText: 'OK', data: { historyStateKitchenOrders: [] } });
    }

    updateTableStatus(tableId, newState) {
        if (this.#tablesEndpoint) return this.#tablesEndpoint.update(tableId, { state: newState });
        const index = mockTables.findIndex(t => t.id === tableId);
        if (index !== -1) mockTables[index] = { ...mockTables[index], state: newState };
        return Promise.resolve({ status: 200, statusText: 'OK', data: mockTables[index] });
    }
}
