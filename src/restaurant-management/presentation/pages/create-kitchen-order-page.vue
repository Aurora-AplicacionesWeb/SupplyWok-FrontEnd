<script setup>
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import DishCard from '../components/dish-card.vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useRestaurantManagementStore();

const {
    tables, freeTables, dishes, dishCategories, dishesByCategory,
    newOrderTypeService, newOrderTableId, newOrderTableNumber,
    newOrderItems, newOrderObservations,
    totalItemsNewOrder, totalNewOrder, loading
} = storeToRefs(store);

const {
    fetchTables, fetchDishes, fetchDishCategories,
    selectServiceType, addItemToOrder, removeItemFromOrder,
    updateItemQuantity, createKitchenOrder, updateKitchenOrderFull,
    fetchKitchenOrderById, initNewKitchenOrder, clearCurrentOrder
} = store;

const showMenu = ref(false);
const editId = computed(() => {
    const val = route.query.edit;
    return val ? Number(val) : null;
});

function categoryLabel(cat) {
    const key = cat.name.toLowerCase().replace(/\s+/g, '_');
    return t(`restaurantManagement.dishMenuPage.categories.${key}`) || cat.name;
}

async function handleCreateOrder() {
    let result;
    if (editId.value) {
        result = await updateKitchenOrderFull(editId.value, {
            tableId: newOrderTableId.value,
            tableNumber: newOrderTableNumber.value,
            typeService: newOrderTypeService.value,
            items: [...newOrderItems.value],
            observations: newOrderObservations.value
        });
    } else {
        result = await createKitchenOrder();
    }
    if (result) {
        router.push('/kitchen-tickets');
    }
}

function handleAddDish(dish) {
    addItemToOrder(dish, 1, '');
    showMenu.value = false;
}

function goBack() {
    router.push('/kitchen-tickets');
}

async function loadEditOrder(editIdVal) {
    await fetchKitchenOrderById(editIdVal);
    const order = store.currentKitchenOrder;
    if (!order || !order.id) return;

    const table = tables.value.find(t => t.id === order.tableId);
    const tableCode = table?.code || order.tableNumber;

    selectServiceType(order.typeService, order.tableId, tableCode);
    store.newOrderObservations = order.observations || '';
    store.newOrderItems = (order.item || []).map(item => ({
        dishId: item.dishId,
        dishName: item.dishName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        state: item.state || 'pending',
        observations: item.observations || ''
    }));
}

onMounted(async () => {
    await Promise.all([
        fetchTables(),
        dishes.value.length === 0 ? fetchDishes() : Promise.resolve(),
        dishCategories.value.length === 0 ? fetchDishCategories() : Promise.resolve()
    ]);

    if (editId.value) {
        await loadEditOrder(editId.value);
    }
});
</script>

<template>
    <section class="create-kitchen-order-page">
        <div class="create-kitchen-order-page__header">
            <div class="create-kitchen-order-page__header-left">
                <Button
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    text
                    rounded
                    :tooltip="t('restaurantManagement.createKitchenOrderPage.back')"
                    @click="goBack"
                />
                <div>
                    <span class="create-kitchen-order-page__kicker">{{ t('restaurantManagement.createKitchenOrderPage.kicker') }}</span>
                    <h1 class="create-kitchen-order-page__title">{{ t('restaurantManagement.createKitchenOrderPage.title') }}</h1>
                    <p class="create-kitchen-order-page__description">{{ t('restaurantManagement.createKitchenOrderPage.description') }}</p>
                </div>
            </div>
        </div>

        <div class="create-kitchen-order-page__workspace">
            <div class="create-kitchen-order-page__form">
                <div class="create-kitchen-order-page__card">
                    <h3>{{ t('restaurantManagement.createKitchenOrderPage.serviceType') }}</h3>
                    <div class="create-kitchen-order-page__service-toggle">
                        <Button
                            :label="t('restaurantManagement.createKitchenOrderPage.tableService')"
                            severity="danger"
                            :outlined="newOrderTypeService !== 'table_service'"
                            @click="selectServiceType('table_service')"
                        />
                        <Button
                            :label="t('restaurantManagement.createKitchenOrderPage.toTakeHome')"
                            severity="danger"
                            :outlined="newOrderTypeService !== 'to_take_home'"
                            @click="selectServiceType('to_take_home')"
                        />
                    </div>
                </div>

                <div v-if="newOrderTypeService === 'table_service'" class="create-kitchen-order-page__card">
                    <h3>{{ t('restaurantManagement.createKitchenOrderPage.tableSelection') }}</h3>
                    <div class="create-kitchen-order-page__tables-grid">
                        <button
                            v-for="table in freeTables"
                            :key="table.id"
                            type="button"
                            class="create-kitchen-order-page__table-btn"
                            :class="{ 'create-kitchen-order-page__table-btn--selected': newOrderTableId === table.id }"
                            @click="selectServiceType('table_service', table.id, table.code)"
                        >
                            <i class="pi pi-table" />
                            <span>{{ table.code || `T-${String(table.number).padStart(2, '0')}` }}</span>
                        </button>
                    </div>
                    <p v-if="freeTables.length === 0" class="create-kitchen-order-page__no-tables">
                        {{ t('restaurantManagement.createKitchenOrderPage.freeTables') }}: 0
                    </p>
                </div>

                <div class="create-kitchen-order-page__card">
                    <h3>{{ t('restaurantManagement.createKitchenOrderPage.selectedDishes') }}</h3>
                    <div v-if="newOrderItems.length === 0" class="create-kitchen-order-page__empty-items">
                        <p>{{ t('restaurantManagement.createKitchenOrderPage.noItems') }}</p>
                    </div>
                    <div v-else class="create-kitchen-order-page__items-list">
                        <div v-for="item in newOrderItems" :key="item.dishId" class="create-kitchen-order-page__item-row">
                            <div class="create-kitchen-order-page__item-info">
                                <strong>{{ item.dishName }}</strong>
                                <span>{{ t('restaurantManagement.createKitchenOrderPage.unitPrice') }}: S/ {{ item.unitPrice.toFixed(2) }}</span>
                            </div>
                            <div class="create-kitchen-order-page__item-controls">
                                <button type="button" class="create-kitchen-order-page__qty-btn" @click="updateItemQuantity(item.dishId, item.quantity - 1)">-</button>
                                <span class="create-kitchen-order-page__qty-value">{{ item.quantity }}</span>
                                <button type="button" class="create-kitchen-order-page__qty-btn" @click="updateItemQuantity(item.dishId, item.quantity + 1)">+</button>
                                <button type="button" class="create-kitchen-order-page__remove-btn" @click="removeItemFromOrder(item.dishId)">
                                    <i class="pi pi-trash" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Button
                        :label="t('restaurantManagement.createKitchenOrderPage.addDishes')"
                        icon="pi pi-plus-circle"
                        severity="secondary"
                        text
                        @click="showMenu = !showMenu"
                    />
                </div>

                <div class="create-kitchen-order-page__card">
                    <h3>{{ t('restaurantManagement.createKitchenOrderPage.observations') }}</h3>
                    <Textarea
                        v-model="newOrderObservations"
                        :placeholder="t('restaurantManagement.createKitchenOrderPage.observationsPlaceholder')"
                        rows="3"
                        class="create-kitchen-order-page__observations"
                    />
                </div>

                <div class="create-kitchen-order-page__summary">
                    <div class="create-kitchen-order-page__summary-row">
                        <span>{{ t('restaurantManagement.createKitchenOrderPage.totalItems') }}</span>
                        <strong>{{ totalItemsNewOrder }}</strong>
                    </div>
                    <div class="create-kitchen-order-page__summary-row">
                        <span>{{ t('restaurantManagement.createKitchenOrderPage.totalAmount') }}</span>
                        <strong>S/ {{ totalNewOrder.toFixed(2) }}</strong>
                    </div>
                </div>

                <Button
                    :label="editId ? t('restaurantManagement.createKitchenOrderPage.updateOrder') : t('restaurantManagement.createKitchenOrderPage.createOrder')"
                    :icon="editId ? 'pi pi-save' : 'pi pi-check'"
                    severity="danger"
                    class="create-kitchen-order-page__submit"
                    :disabled="newOrderItems.length === 0 || loading"
                    :loading="loading"
                    @click="handleCreateOrder"
                />
            </div>

            <div v-if="showMenu" class="create-kitchen-order-page__menu-panel">
                <div class="create-kitchen-order-page__menu-header">
                    <h3>{{ t('restaurantManagement.dishMenuPage.title') }}</h3>
                    <button type="button" class="create-kitchen-order-page__menu-close" @click="showMenu = false">
                        <i class="pi pi-times" />
                    </button>
                </div>
                <div v-for="group in dishesByCategory" :key="group.category.id" class="create-kitchen-order-page__menu-group">
                    <h4 class="create-kitchen-order-page__menu-category">{{ categoryLabel(group.category) }}</h4>
                    <div class="create-kitchen-order-page__menu-grid">
                        <DishCard
                            v-for="dish in group.dishes"
                            :key="dish.id"
                            :dish="dish"
                            compact
                            @add-to-order="handleAddDish"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.create-kitchen-order-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.create-kitchen-order-page__header-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.create-kitchen-order-page__kicker {
    display: inline-block;
    color: #a07832;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.create-kitchen-order-page__title {
    margin: 0;
    color: #342923;
    font-size: clamp(2rem, 2.2vw, 2.4rem);
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 700;
}

.create-kitchen-order-page__description {
    margin: 8px 0 0;
    color: #65594f;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 14px;
}

.create-kitchen-order-page__workspace {
    display: grid;
    grid-template-columns: minmax(380px, 1fr) minmax(320px, 1fr);
    gap: 18px;
    align-items: start;
}

.create-kitchen-order-page__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.create-kitchen-order-page__card {
    background: #fff;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
}

.create-kitchen-order-page__card h3 {
    margin: 0 0 12px;
    color: #40342d;
    font-size: 16px;
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 600;
}

.create-kitchen-order-page__service-toggle {
    display: flex;
    gap: 8px;
}

.create-kitchen-order-page__tables-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 8px;
}

.create-kitchen-order-page__table-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px;
    border: 2px solid #e6ddd3;
    border-radius: 12px;
    background: #fff;
    color: #4b3d34;
    cursor: pointer;
    transition: all 0.2s;
}

.create-kitchen-order-page__table-btn:hover {
    border-color: #d5b98f;
}

.create-kitchen-order-page__table-btn--selected {
    border-color: #c21204;
    background: #fef2f0;
    color: #c21204;
}

.create-kitchen-order-page__no-tables {
    color: #7d7065;
    font-size: 13px;
}

.create-kitchen-order-page__empty-items {
    color: #7d7065;
    padding: 12px 0;
}

.create-kitchen-order-page__items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
}

.create-kitchen-order-page__item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    background: #faf5ee;
    border-radius: 10px;
    border: 1px solid #eee3d6;
}

.create-kitchen-order-page__item-info {
    display: grid;
    gap: 2px;
}

.create-kitchen-order-page__item-info strong {
    color: #40342d;
    font-size: 14px;
}

.create-kitchen-order-page__item-info span {
    color: #7d7065;
    font-size: 11px;
}

.create-kitchen-order-page__item-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.create-kitchen-order-page__qty-btn {
    width: 26px;
    height: 26px;
    border: 1px solid #ddd1c4;
    border-radius: 6px;
    background: #fff;
    color: #4b3d34;
    cursor: pointer;
    font-weight: 700;
}

.create-kitchen-order-page__qty-value {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
}

.create-kitchen-order-page__remove-btn {
    border: none;
    background: transparent;
    color: #c21204;
    cursor: pointer;
    padding: 4px;
}

.create-kitchen-order-page__observations {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #e6ddd3;
    padding: 0.78rem 0.9rem;
    font-family: inherit;
    resize: vertical;
}

.create-kitchen-order-page__summary {
    background: #fff;
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    display: grid;
    gap: 8px;
}

.create-kitchen-order-page__summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.create-kitchen-order-page__summary-row span {
    color: #7d7065;
}

.create-kitchen-order-page__summary-row strong {
    color: #40342d;
    font-size: 18px;
}

.create-kitchen-order-page__submit {
    border-radius: 10px;
    min-height: 42px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.create-kitchen-order-page__menu-panel {
    background: #fff;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    max-height: 80vh;
    overflow-y: auto;
}

.create-kitchen-order-page__menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.create-kitchen-order-page__menu-header h3 {
    margin: 0;
    color: #40342d;
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 600;
}

.create-kitchen-order-page__menu-close {
    border: none;
    background: transparent;
    color: #7d7065;
    cursor: pointer;
    font-size: 18px;
}

.create-kitchen-order-page__menu-group {
    margin-bottom: 16px;
}

.create-kitchen-order-page__menu-category {
    margin: 0 0 8px;
    color: #65594f;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #efe6da;
    padding-bottom: 6px;
}

.create-kitchen-order-page__menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
}

@media (max-width: 960px) {
    .create-kitchen-order-page__workspace {
        grid-template-columns: 1fr;
    }
}
</style>
