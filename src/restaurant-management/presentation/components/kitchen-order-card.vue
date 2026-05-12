<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import StatusBadge from './status-badge.vue';

const props = defineProps({
    order: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
});

const emit = defineEmits(['status-change']);
const { t } = useI18n();

const serviceTypeLabel = computed(() => {
    return t(`restaurantManagement.shared.serviceType.${props.order.typeService}`) || props.order.typeService;
});

const itemCount = computed(() => {
    const items = props.order.item || props.order.items || [];
    return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
});

const itemList = computed(() => {
    return props.order.item || props.order.items || [];
});
</script>

<template>
    <article class="kitchen-order-card">
        <div class="kitchen-order-card__header">
            <div class="kitchen-order-card__order-info">
                <strong class="kitchen-order-card__number">{{ order.number || `#${order.id}` }}</strong>
                <StatusBadge :status="order.state" />
            </div>
            <span v-if="order.tableNumber" class="kitchen-order-card__table">
                <i class="pi pi-table" /> {{ order.tableNumber }}
            </span>
            <span v-else class="kitchen-order-card__table">
                <i class="pi pi-shopping-bag" /> {{ serviceTypeLabel }}
            </span>
        </div>

        <div class="kitchen-order-card__items">
            <div v-for="item in itemList" :key="item.id || item.dishId" class="kitchen-order-card__item">
                <span class="kitchen-order-card__item-name">{{ item.dishName }}</span>
                <span class="kitchen-order-card__item-qty">x{{ item.quantity }}</span>
            </div>
        </div>

        <div v-if="order.observations" class="kitchen-order-card__observations">
            <i class="pi pi-comment" /> {{ order.observations }}
        </div>

        <div class="kitchen-order-card__footer">
            <span class="kitchen-order-card__time">
                <i class="pi pi-clock" />
                {{ new Date(order.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
            <span class="kitchen-order-card__items-total">{{ itemCount }} items</span>
        </div>

        <div v-if="!readonly" class="kitchen-order-card__actions">
            <template v-if="order.state === 'pending'">
                <Button
                    :label="t('restaurantManagement.kitchenTicketsPage.markInPreparation')"
                    icon="pi pi-play"
                    severity="info"
                    size="small"
                    @click="emit('status-change', { orderId: order.id, newState: 'in_preparation' })"
                />
                <Button
                    :label="t('restaurantManagement.kitchenTicketsPage.cancel')"
                    icon="pi pi-times"
                    severity="danger"
                    size="small"
                    text
                    @click="emit('status-change', { orderId: order.id, newState: 'cancelled' })"
                />
            </template>
            <template v-else-if="order.state === 'in_preparation'">
                <Button
                    :label="t('restaurantManagement.kitchenTicketsPage.markReady')"
                    icon="pi pi-check"
                    severity="success"
                    size="small"
                    @click="emit('status-change', { orderId: order.id, newState: 'ready' })"
                />
                <Button
                    :label="t('restaurantManagement.kitchenTicketsPage.cancel')"
                    icon="pi pi-times"
                    severity="danger"
                    size="small"
                    text
                    @click="emit('status-change', { orderId: order.id, newState: 'cancelled' })"
                />
            </template>
            <template v-else-if="order.state === 'ready'">
                <Button
                    :label="t('restaurantManagement.kitchenTicketsPage.markDelivered')"
                    icon="pi pi-send"
                    severity="secondary"
                    size="small"
                    @click="emit('status-change', { orderId: order.id, newState: 'delivered' })"
                />
            </template>
        </div>
    </article>
</template>

<style scoped>
.kitchen-order-card {
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    border: 1px solid #f0e8dd;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.kitchen-order-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
}

.kitchen-order-card__order-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.kitchen-order-card__number {
    color: #40342d;
    font-size: 15px;
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 600;
}

.kitchen-order-card__table {
    color: #7d7065;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.kitchen-order-card__items {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.kitchen-order-card__item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 13px;
}

.kitchen-order-card__item-name {
    color: #4b3d34;
}

.kitchen-order-card__item-qty {
    color: #7d7065;
    font-weight: 600;
    white-space: nowrap;
}

.kitchen-order-card__observations {
    font-size: 12px;
    color: #a07832;
    background: #fefce8;
    padding: 6px 8px;
    border-radius: 8px;
    display: flex;
    gap: 6px;
    align-items: flex-start;
}

.kitchen-order-card__footer {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #8e8177;
}

.kitchen-order-card__time i,
.kitchen-order-card__table i {
    margin-right: 4px;
}

.kitchen-order-card__actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}
</style>
