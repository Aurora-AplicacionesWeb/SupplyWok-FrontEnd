<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import StatusBadge from '../components/status-badge.vue';
import Button from 'primevue/button';

const { t } = useI18n();
const router = useRouter();
const store = useRestaurantManagementStore();

const {
    kitchenOrders, tables, pendingKitchenOrders, inPreparationKitchenOrders,
    readyKitchenOrders, deliveredKitchenOrders, loading
} = storeToRefs(store);

const {
    fetchKitchenOrders, fetchTables, updateKitchenOrderStatus, deleteKitchenOrder
} = store;

const openCount = computed(() => pendingKitchenOrders.value.length);
const inPrepCount = computed(() => inPreparationKitchenOrders.value.length);
const readyCount = computed(() => readyKitchenOrders.value.length);

const allOrders = computed(() =>
    [...kitchenOrders.value].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
);

function serviceTypeLabel(order) {
    return t(`restaurantManagement.shared.serviceType.${order.typeService}`) || order.typeService;
}

function itemCount(order) {
    const items = order.item || order.items || [];
    return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

function tableCode(order) {
    if (!order.tableId) return null;
    const table = tables.value.find(t => t.id === order.tableId);
    return table?.code || order.tableNumber || null;
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yy} | ${hh}:${min}`;
}

async function handleStatusChange(orderId, newState) {
    await updateKitchenOrderStatus(orderId, newState);
    await fetchKitchenOrders();
}

async function handleDelete(orderId) {
    if (confirm(t('restaurantManagement.kitchenTicketsPage.confirmDelete'))) {
        await deleteKitchenOrder(orderId);
    }
}

function handleEdit(order) {
    router.push({ path: '/create-kitchen-order', query: { edit: order.id } });
}

function goToNewTicket() {
    router.push('/create-kitchen-order');
}

onMounted(() => {
    fetchKitchenOrders();
    fetchTables();
});
</script>

<template>
    <section class="kitchen-tickets-page">
        <div class="kitchen-tickets-page__header">
            <div>
                <span class="kitchen-tickets-page__kicker">{{ t('restaurantManagement.kitchenTicketsPage.kicker') }}</span>
                <h1 class="kitchen-tickets-page__title">{{ t('restaurantManagement.kitchenTicketsPage.title') }}</h1>
                <p class="kitchen-tickets-page__description">{{ t('restaurantManagement.kitchenTicketsPage.description') }}</p>
            </div>
            <Button
                :label="t('restaurantManagement.kitchenTicketsPage.newTicket')"
                icon="pi pi-plus"
                severity="danger"
                @click="goToNewTicket"
            />
        </div>

        <div v-if="loading" class="kitchen-tickets-page__loading">
            <i class="pi pi-spin pi-spinner" />
        </div>

        <template v-else>
            <div class="kitchen-tickets-page__kpi-row">
                <div class="kitchen-tickets-page__kpi-card kitchen-tickets-page__kpi-card--pending">
                    <span class="kitchen-tickets-page__kpi-value">{{ openCount }}</span>
                    <span class="kitchen-tickets-page__kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.pending') }}</span>
                </div>
                <div class="kitchen-tickets-page__kpi-card kitchen-tickets-page__kpi-card--prep">
                    <span class="kitchen-tickets-page__kpi-value">{{ inPrepCount }}</span>
                    <span class="kitchen-tickets-page__kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.inPreparation') }}</span>
                </div>
                <div class="kitchen-tickets-page__kpi-card kitchen-tickets-page__kpi-card--ready">
                    <span class="kitchen-tickets-page__kpi-value">{{ readyCount }}</span>
                    <span class="kitchen-tickets-page__kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.ready') }}</span>
                </div>
            </div>

            <div class="kitchen-tickets-page__table-wrapper">
                <table class="kitchen-tickets-page__table">
                    <thead>
                        <tr>
                            <th>{{ t('restaurantManagement.kitchenTicketsPage.orderNumber') }}</th>
                            <th>{{ t('restaurantManagement.kitchenTicketsPage.tableNumber') }}</th>
                            <th>{{ t('restaurantManagement.kitchenTicketsPage.typeService') }}</th>
                            <th>{{ t('restaurantManagement.kitchenTicketsPage.items') }}</th>
                            <th>{{ t('restaurantManagement.tablesAndOccupancyPage.state') }}</th>
                            <th>{{ t('restaurantManagement.kitchenTicketsPage.dateCreated') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in allOrders" :key="order.id" class="kitchen-tickets-page__row">
                            <td class="kitchen-tickets-page__cell-order">
                                <strong>{{ order.number || `#${order.id}` }}</strong>
                            </td>
                            <td>
                                <span v-if="tableCode(order)" class="kitchen-tickets-page__table-badge">
                                    <i class="pi pi-table" /> {{ tableCode(order) }}
                                </span>
                                <span v-else class="kitchen-tickets-page__table-badge kitchen-tickets-page__table-badge--takeaway">
                                    <i class="pi pi-shopping-bag" />
                                </span>
                            </td>
                            <td class="kitchen-tickets-page__cell-service">{{ serviceTypeLabel(order) }}</td>
                            <td class="kitchen-tickets-page__cell-items">{{ itemCount(order) }}</td>
                            <td><StatusBadge :status="order.state" /></td>
                            <td class="kitchen-tickets-page__cell-time">{{ formatDateTime(order.dateCreated) }}</td>
                            <td class="kitchen-tickets-page__cell-actions">
                                <template v-if="order.state === 'pending'">
                                    <Button
                                        icon="pi pi-play"
                                        severity="info"
                                        size="small"
                                        rounded
                                        text
                                        :tooltip="t('restaurantManagement.kitchenTicketsPage.markInPreparation')"
                                        @click="handleStatusChange(order.id, 'in_preparation')"
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        severity="danger"
                                        size="small"
                                        rounded
                                        text
                                        :tooltip="t('restaurantManagement.kitchenTicketsPage.cancel')"
                                        @click="handleStatusChange(order.id, 'cancelled')"
                                    />
                                </template>
                                <template v-else-if="order.state === 'in_preparation'">
                                    <Button
                                        icon="pi pi-check"
                                        severity="success"
                                        size="small"
                                        rounded
                                        text
                                        :tooltip="t('restaurantManagement.kitchenTicketsPage.markReady')"
                                        @click="handleStatusChange(order.id, 'ready')"
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        severity="danger"
                                        size="small"
                                        rounded
                                        text
                                        :tooltip="t('restaurantManagement.kitchenTicketsPage.cancel')"
                                        @click="handleStatusChange(order.id, 'cancelled')"
                                    />
                                </template>
                                <template v-else-if="order.state === 'ready'">
                                    <Button
                                        icon="pi pi-send"
                                        severity="secondary"
                                        size="small"
                                        rounded
                                        text
                                        :tooltip="t('restaurantManagement.kitchenTicketsPage.markDelivered')"
                                        @click="handleStatusChange(order.id, 'delivered')"
                                    />
                                </template>
                                <Button
                                    icon="pi pi-pencil"
                                    severity="contrast"
                                    size="small"
                                    rounded
                                    :tooltip="t('restaurantManagement.kitchenTicketsPage.edit')"
                                    @click="handleEdit(order)"
                                />
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    size="small"
                                    rounded
                                    :tooltip="t('restaurantManagement.kitchenTicketsPage.delete')"
                                    @click="handleDelete(order.id)"
                                />
                            </td>
                        </tr>
                        <tr v-if="allOrders.length === 0">
                            <td colspan="7" class="kitchen-tickets-page__empty">
                                {{ t('restaurantManagement.kitchenTicketsPage.noOrders') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </section>
</template>

<style scoped>
.kitchen-tickets-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.kitchen-tickets-page__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
}

.kitchen-tickets-page__kicker {
    display: inline-block;
    color: #a07832;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.kitchen-tickets-page__title {
    margin: 0;
    color: #342923;
    font-size: clamp(2rem, 2.2vw, 2.4rem);
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 700;
}

.kitchen-tickets-page__description {
    margin: 8px 0 0;
    color: #65594f;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 14px;
}

.kitchen-tickets-page__loading {
    display: flex;
    justify-content: center;
    padding: 48px;
    font-size: 24px;
    color: #a07832;
}

.kitchen-tickets-page__kpi-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.kitchen-tickets-page__kpi-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 20px 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    border: 2px solid #f0e8dd;
}

.kitchen-tickets-page__kpi-card--pending {
    border-color: #fef3c7;
}

.kitchen-tickets-page__kpi-card--prep {
    border-color: #fce4ec;
}

.kitchen-tickets-page__kpi-card--ready {
    border-color: #dcfce7;
}

.kitchen-tickets-page__kpi-value {
    font-size: 28px;
    font-weight: 800;
    color: #2d241e;
    line-height: 1;
    font-family: 'Poppins', system-ui, sans-serif;
}

.kitchen-tickets-page__kpi-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7d7065;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.kitchen-tickets-page__kpi-card--pending .kitchen-tickets-page__kpi-value {
    color: #e9b824;
}

.kitchen-tickets-page__kpi-card--prep .kitchen-tickets-page__kpi-value {
    color: #c21204;
}

.kitchen-tickets-page__kpi-card--ready .kitchen-tickets-page__kpi-value {
    color: #16a34a;
}

.kitchen-tickets-page__table-wrapper {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    border: 1px solid #f0e8dd;
    overflow-x: auto;
}

.kitchen-tickets-page__table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 13px;
}

.kitchen-tickets-page__table th {
    text-align: left;
    padding: 14px 16px;
    vertical-align: middle;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7d7065;
    background: #faf5ee;
    border-bottom: 2px solid #efe6da;
    white-space: nowrap;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.kitchen-tickets-page__table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0e8dd;
    color: #40342d;
    vertical-align: middle;
}

.kitchen-tickets-page__row:hover {
    background: #faf5ee;
}

.kitchen-tickets-page__row:last-child td {
    border-bottom: none;
}

.kitchen-tickets-page__cell-order strong {
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 600;
    color: #2d241e;
}

.kitchen-tickets-page__table-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #4b3d34;
}

.kitchen-tickets-page__table-badge--takeaway {
    color: #a07832;
}

.kitchen-tickets-page__cell-service {
    color: #65594f;
    font-size: 12px;
}

.kitchen-tickets-page__cell-items {
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
}

.kitchen-tickets-page__table td.kitchen-tickets-page__cell-items {
    text-align: center;
}

.kitchen-tickets-page__cell-time {
    color: #7d7065;
    font-size: 12px;
    white-space: nowrap;
    text-align: center;
}

.kitchen-tickets-page__table td.kitchen-tickets-page__cell-time {
    text-align: center;
}

.kitchen-tickets-page__cell-actions {
    display: flex;
    gap: 2px;
    white-space: nowrap;
    justify-content: flex-end;
}

.kitchen-tickets-page__table th:last-child {
    text-align: right;
}

.kitchen-tickets-page__empty {
    color: #7d7065;
    font-size: 13px;
    text-align: center;
    padding: 32px 16px;
}

@media (max-width: 768px) {
    .kitchen-tickets-page__table th:nth-child(3),
    .kitchen-tickets-page__table td:nth-child(3) {
        display: none;
    }
    .kitchen-tickets-page__table th:nth-child(6),
    .kitchen-tickets-page__table td:nth-child(6) {
        display: none;
    }
}

@media (max-width: 640px) {
    .kitchen-tickets-page__kpi-row {
        grid-template-columns: 1fr;
    }
    .kitchen-tickets-page__table th:nth-child(4),
    .kitchen-tickets-page__table td:nth-child(4) {
        display: none;
    }
}
</style>
