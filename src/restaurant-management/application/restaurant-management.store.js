import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { RestaurantManagementApi } from '../infrastructure/restaurant-management-api.js';
import { TableAssembler } from '../infrastructure/table.assembler.js';
import { DishAssembler } from '../infrastructure/dish.assembler.js';
import { DishCategoryAssembler } from '../infrastructure/dish-category.assembler.js';
import { KitchenOrderAssembler } from '../infrastructure/kitchen-order.assembler.js';
import { KitchenOrderItemAssembler } from '../infrastructure/kitchen-order-item.assembler.js';
import { KitchenLockAssembler } from '../infrastructure/kitchen-lock.assembler.js';

const restaurantManagementApi = new RestaurantManagementApi();

const useRestaurantManagementStore = defineStore('restaurant-management', () => {
    const tables = ref([]);
    const dishes = ref([]);
    const dishCategories = ref([]);
    const kitchenOrders = ref([]);
    const kitchenOrderItems = ref([]);
    const kitchenLock = ref(null);
    const kitchenOrderHistory = ref([]);
    const currentKitchenOrder = ref(null);
    const errors = ref([]);
    const loading = ref(false);

    const newOrderTableId = ref(null);
    const newOrderTableNumber = ref(null);
    const newOrderTypeService = ref('to_take_home');
    const newOrderItems = ref([]);
    const newOrderObservations = ref('');

    const pendingKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state === 'pending'));
    const inPreparationKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state === 'in_preparation'));
    const readyKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state === 'ready'));
    const deliveredKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state === 'delivered'));
    const cancelledKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state === 'cancelled'));

    const activeKitchenOrders = computed(() => kitchenOrders.value.filter(o => o.state !== 'delivered' && o.state !== 'cancelled'));
    const activeDishes = computed(() => dishes.value.filter(d => d.active));
    const featuredDishes = computed(() => dishes.value.filter(d => d.outstanding && d.active));

    const dishesByCategory = computed(() => {
        const grouped = {};
        dishCategories.value.forEach(cat => {
            grouped[cat.id] = {
                category: cat,
                dishes: dishes.value.filter(d => d.categoryId === cat.id && d.active)
            };
        });
        return grouped;
    });

    const freeTables = computed(() => tables.value.filter(t => t.state === 'available' && t.active));
    const occupiedTables = computed(() => tables.value.filter(t => t.state === 'busy' && t.active));
    const tablesByLocation = computed(() => {
        const grouped = {};
        tables.value.forEach(t => {
            if (!grouped[t.location]) grouped[t.location] = [];
            grouped[t.location].push(t);
        });
        return grouped;
    });

    const totalItemsNewOrder = computed(() => newOrderItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0));
    const totalNewOrder = computed(() => newOrderItems.value.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0));

    const isKitchenLocked = computed(() => kitchenLock.value?.stateLocked ?? false);
    const failedAttempts = computed(() => kitchenLock.value?.failAttempt ?? 0);

    function initNewKitchenOrder(tableId = null, tableNumber = null, typeService = 'to_take_home') {
        newOrderTableId.value = tableId;
        newOrderTableNumber.value = tableNumber;
        newOrderTypeService.value = typeService;
        newOrderItems.value = [];
        newOrderObservations.value = '';
    }

    function selectServiceType(typeService, tableId = null, tableNumber = null) {
        newOrderTypeService.value = typeService;
        newOrderTableId.value = tableId;
        newOrderTableNumber.value = tableNumber;
    }

    function addItemToOrder(dish, quantity = 1, observations = '') {
        const existing = newOrderItems.value.find(item => item.dishId === dish.id);
        if (existing) {
            existing.quantity += quantity;
            if (observations) existing.observations = observations;
        } else {
            newOrderItems.value.push({
                dishId: dish.id,
                dishName: dish.name,
                quantity,
                unitPrice: dish.price,
                totalPrice: dish.price * quantity,
                state: 'pending',
                observations
            });
        }
    }

    function removeItemFromOrder(dishId) {
        const index = newOrderItems.value.findIndex(item => item.dishId === dishId);
        if (index !== -1) newOrderItems.value.splice(index, 1);
    }

    function updateItemQuantity(dishId, quantity) {
        const item = newOrderItems.value.find(i => i.dishId === dishId);
        if (item) {
            if (quantity <= 0) {
                removeItemFromOrder(dishId);
            } else {
                item.quantity = quantity;
                item.totalPrice = quantity * item.unitPrice;
            }
        }
    }

    function clearCurrentOrder() {
        initNewKitchenOrder(null, null, 'to_take_home');
        currentKitchenOrder.value = null;
    }

    async function fetchTables() {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.getTables();
            tables.value = TableAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    async function fetchDishes() {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.getDishes();
            dishes.value = DishAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    async function fetchDishCategories() {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.getDishCategories();
            dishCategories.value = DishCategoryAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    async function fetchKitchenOrders() {
        loading.value = true;
        try {
            const [ordersResponse, itemsResponse] = await Promise.all([
                restaurantManagementApi.getKitchenOrders(),
                restaurantManagementApi.getKitchenOrderItems()
            ]);
            kitchenOrders.value = KitchenOrderAssembler.ToEntitiesFromResponse(ordersResponse);
            kitchenOrderItems.value = KitchenOrderItemAssembler.toEntitiesFromResponse(itemsResponse);
            mergeItemsIntoOrders();
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function mergeItemsIntoOrders() {
        const itemsByOrderId = {};
        kitchenOrderItems.value.forEach(item => {
            if (!itemsByOrderId[item.kitchenOrderId]) itemsByOrderId[item.kitchenOrderId] = [];
            itemsByOrderId[item.kitchenOrderId].push(item);
        });
        kitchenOrders.value.forEach(order => {
            if (!order.item || order.item.length === 0) {
                const matched = itemsByOrderId[order.id] || [];
                order.item = matched;
            }
        });
    }

    async function fetchKitchenOrderItemsOnly() {
        try {
            const response = await restaurantManagementApi.getKitchenOrderItems();
            kitchenOrderItems.value = KitchenOrderItemAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function fetchKitchenOrderById(id) {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.getKitchenOrderById(id);
            currentKitchenOrder.value = KitchenOrderAssembler.toEntityFromResource(response.data);
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    async function fetchKitchenLock() {
        try {
            const response = await restaurantManagementApi.getKitchenLock();
            const locks = KitchenLockAssembler.toEntitiesFromResponse(response);
            kitchenLock.value = locks.length > 0 ? locks[0] : null;
        } catch (error) {
            console.error('Error fetching kitchen lock:', error);
        }
    }

    async function fetchAll() {
        loading.value = true;
        try {
            await Promise.all([
                fetchTables(),
                fetchDishes(),
                fetchDishCategories(),
                fetchKitchenOrders(),
                fetchKitchenLock()
            ]);
        } catch (error) {
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    async function createKitchenOrder() {
        if (newOrderItems.value.length === 0) {
            errors.value.push('Debe agregar al menos un item');
            return null;
        }
        if (newOrderTypeService.value === 'table_service' && !newOrderTableId.value) {
            errors.value.push('Debe seleccionar una mesa');
            return null;
        }

        loading.value = true;
        try {
            const orderData = {
                tableId: newOrderTableId.value,
                tableNumber: newOrderTableNumber.value,
                typeService: newOrderTypeService.value,
                state: 'pending',
                items: [...newOrderItems.value],
                observations: newOrderObservations.value,
                dateCreated: new Date().toISOString()
            };

            const response = await restaurantManagementApi.createKitchenOrder(orderData);
            const newOrder = KitchenOrderAssembler.toEntityFromResource(response.data);
            kitchenOrders.value.unshift(newOrder);
            initNewKitchenOrder(null, null, 'to_take_home');
            return newOrder;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function addTable(tableData) {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.createTable(tableData);
            const newTable = TableAssembler.toEntityFromResource(response.data);
            tables.value.push(newTable);
            return newTable;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function updateKitchenOrderFull(orderId, orderData) {
        loading.value = true;
        try {
            const response = await restaurantManagementApi.updateKitchenOrderFull(orderId, orderData);
            const updated = KitchenOrderAssembler.toEntityFromResource(response.data);
            const index = kitchenOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1) kitchenOrders.value[index] = updated;
            clearCurrentOrder();
            return updated;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function deleteKitchenOrder(orderId) {
        loading.value = true;
        try {
            await restaurantManagementApi.deleteKitchenOrder(orderId);
            const index = kitchenOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1) kitchenOrders.value.splice(index, 1);
            if (currentKitchenOrder.value?.id === orderId) currentKitchenOrder.value = null;
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function updateKitchenOrderStatus(orderId, newState) {
        const order = kitchenOrders.value.find(o => o.id === orderId);
        if (!order) return null;

        const transitions = {
            pending: ['in_preparation', 'cancelled'],
            in_preparation: ['ready', 'cancelled'],
            ready: ['delivered'],
            delivered: [],
            cancelled: []
        };
        const allowed = transitions[order.state] || [];
        if (!allowed.includes(newState)) return null;

        loading.value = true;
        try {
            const response = await restaurantManagementApi.updateKitchenOrderStatus(orderId, newState, '');
            const updated = KitchenOrderAssembler.toEntityFromResource(response.data);
            const index = kitchenOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1) kitchenOrders.value[index] = updated;
            if (currentKitchenOrder.value?.id === orderId) currentKitchenOrder.value = updated;
            return updated;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function activateKitchenMode(password) {
        if (!password || !password.trim()) {
            errors.value.push('La contraseña es requerida');
            return false;
        }
        try {
            if (password === kitchenLock.value?.password) {
                kitchenLock.value.stateLocked = true;
                await restaurantManagementApi.updateKitchenLock(kitchenLock.value);
                return true;
            }
            errors.value.push('Contraseña incorrecta');
            return false;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    async function deactivateKitchenMode(password) {
        if (!password || !password.trim()) {
            errors.value.push('La contraseña es requerida');
            return false;
        }
        try {
            if (password === kitchenLock.value?.password) {
                kitchenLock.value.stateLocked = false;
                await restaurantManagementApi.updateKitchenLock(kitchenLock.value);
                return true;
            }
            kitchenLock.value.failAttempt = (kitchenLock.value?.failAttempt ?? 0) + 1;
            errors.value.push('Contraseña incorrecta');
            return false;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    function resetStore() {
        tables.value = [];
        dishes.value = [];
        dishCategories.value = [];
        kitchenOrders.value = [];
        kitchenLock.value = null;
        kitchenOrderHistory.value = [];
        currentKitchenOrder.value = null;
        errors.value = [];
        loading.value = false;
        initNewKitchenOrder(null, null, 'to_take_home');
    }

    return {
        tables, dishes, dishCategories, kitchenOrders, kitchenOrderItems, kitchenLock,
        kitchenOrderHistory, currentKitchenOrder, errors, loading,
        newOrderTableId, newOrderTableNumber, newOrderTypeService,
        newOrderItems, newOrderObservations,
        pendingKitchenOrders, inPreparationKitchenOrders, readyKitchenOrders,
        deliveredKitchenOrders, cancelledKitchenOrders, activeKitchenOrders,
        activeDishes, featuredDishes, dishesByCategory,
        freeTables, occupiedTables, tablesByLocation,
        totalItemsNewOrder, totalNewOrder, isKitchenLocked, failedAttempts,
        initNewKitchenOrder, selectServiceType, addItemToOrder,
        removeItemFromOrder, updateItemQuantity, clearCurrentOrder,
        fetchTables, fetchDishes, fetchDishCategories, fetchKitchenOrders,
        fetchKitchenOrderById, fetchKitchenOrderItemsOnly, fetchKitchenLock, fetchAll,
        createKitchenOrder, updateKitchenOrderStatus, updateKitchenOrderFull, deleteKitchenOrder,
        addTable, activateKitchenMode, deactivateKitchenMode, resetStore
    };
});

export default useRestaurantManagementStore;
