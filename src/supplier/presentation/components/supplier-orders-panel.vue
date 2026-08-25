<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    orders: {
        type: Array,
        default: () => []
    },
    emptyText: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const router = useRouter();

function formatStatusClass(status) {
    return `orders-panel__status--${String(status ?? '').toLowerCase().replace(/\s+/g, '-')}`;
}

function formatPriorityClass(priority) {
    return `orders-panel__priority--${String(priority ?? '').toLowerCase()}`;
}

function goToOrder(orderId) {
    router.push(`/supplier/orders/${orderId}/view`);
}
</script>

<template>
    <article class="orders-panel">
        <header class="orders-panel__header">
            <h2>{{ title }}</h2>
        </header>

        <div v-if="orders.length" class="orders-panel__list">
            <article v-for="order in orders" :key="order.id" class="orders-panel__item">
                <div class="orders-panel__item-head">
                    <div>
                        <strong>{{ order.code }}</strong>
                        <p class="orders-panel__restaurant">{{ order.restaurantName }}</p>
                    </div>

                    <button class="orders-panel__action" type="button" @click="goToOrder(order.id)">
                        {{ t('supplier-management.orders.actions.view') }}
                    </button>
                </div>

                <div class="orders-panel__badges">
                    <span class="orders-panel__priority" :class="formatPriorityClass(order.priority)">
                        {{ t(`supplier-management.dashboard.priority.${String(order.priority ?? '').toLowerCase()}`) }}
                    </span>
                    <span class="orders-panel__status" :class="formatStatusClass(order.status)">
                        {{ t(`supply-and-purchasing.shared.status.${String(order.status ?? '').toLowerCase().replace(/\s+/g, '-')}`) }}
                    </span>
                </div>

                <p class="orders-panel__meta">
                    {{ t('supplier-management.dashboard.orders.summary', {
                        estimatedDate: order.estimatedDate,
                        items: order.itemsCount
                    }) }}
                </p>
            </article>
        </div>

        <p v-else class="orders-panel__empty">{{ emptyText }}</p>
    </article>
</template>

<style scoped>
.orders-panel {
    min-height: 388px;
    border: 1px solid #efe4d4;
    border-radius: 8px;
    background: #fffdf9;
    box-shadow: 0 16px 34px rgba(58, 42, 20, 0.08);
}

.orders-panel__header {
    padding: 12px 18px;
    border-bottom: 1px solid #ece5dc;
}

.orders-panel__header h2 {
    margin: 0;
    color: #4b5768;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 18px;
}

.orders-panel__list {
    display: grid;
    gap: 18px;
    padding: 16px;
}

.orders-panel__item {
    padding: 12px 12px 14px;
    border: 1px solid #f0ebe3;
    border-radius: 8px;
    background: #ffffff;
}

.orders-panel__item-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.orders-panel__item-head strong {
    color: #2d241e;
    font-size: 15px;
    font-weight: 700;
}

.orders-panel__restaurant {
    margin: 6px 0 0;
    color: #6f665d;
    font-size: 13px;
}

.orders-panel__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.orders-panel__priority,
.orders-panel__status {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

.orders-panel__priority--high {
    background: #fdeaea;
    color: #d73a49;
}

.orders-panel__priority--medium {
    background: #fff4dc;
    color: #b76a13;
}

.orders-panel__priority--low {
    background: #eaf7ed;
    color: #2f855a;
}

.orders-panel__status--pending {
    background: #f7eadf;
    color: #9a5b23;
}

.orders-panel__status--confirmed {
    background: #e8f3ff;
    color: #2f6fb1;
}

.orders-panel__status--in-transit {
    background: #efe9ff;
    color: #6b46c1;
}

.orders-panel__status--delivered {
    background: #eaf7ed;
    color: #2f855a;
}

.orders-panel__status--delayed {
    background: #fdeaea;
    color: #d73a49;
}

.orders-panel__meta {
    margin: 12px 0 0;
    color: #6f665d;
    font-size: 14px;
}

.orders-panel__action {
    border: none;
    border-radius: 999px;
    background: #2d241e;
    color: #ffffff;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.orders-panel__action:hover {
    background: #4a3c2f;
}

.orders-panel__empty {
    margin: 0;
    padding: 22px 18px;
    color: #6f665d;
    font-size: 14px;
}
</style>
