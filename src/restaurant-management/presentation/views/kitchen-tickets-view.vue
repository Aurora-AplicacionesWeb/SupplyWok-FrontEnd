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
  readyKitchenOrders, loading
} = storeToRefs(store);

const {
  fetchKitchenOrders, fetchTables, updateKitchenOrderStatus, deleteKitchenOrder
} = store;

const openCount = computed(() => pendingKitchenOrders.value.length);
const inPrepCount = computed(() => inPreparationKitchenOrders.value.length);
const readyCount = computed(() => readyKitchenOrders.value.length);

const allOrders = computed(() =>
    [...kitchenOrders.value]
        .filter(o => o.state !== 'deleted')
        .sort((a, b) => String(a.number).localeCompare(String(b.number), undefined, { numeric: true }))
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
    return table?.code || table?.number || order.tableNumber || null;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return dd + '/' + mm + '/' + yy + ' | ' + hh + ':' + min;
}

function handleStatusChange(orderId, newState) {
  var result = updateKitchenOrderStatus(orderId, newState);
  if (result && typeof result.then === 'function') {
    result.then(function() {
      fetchKitchenOrders();
    });
  } else {
    fetchKitchenOrders();
  }
}

function handleDelete(orderId) {
  if (confirm(t('restaurantManagement.kitchenTicketsPage.confirmDelete'))) {
    deleteKitchenOrder(orderId);
  }
}

function handleEdit(order) {
  router.push({ name: 'create-kitchen-order-view', query: { edit: order.id } });
}

function goToNewTicket() {
  router.push({ name: 'create-kitchen-order-view' });
}

onMounted(() => {
  fetchKitchenOrders();
  fetchTables();
});
</script>

<template>
  <section class="flex flex-column gap-3">
    <div class="flex justify-content-between align-items-start gap-3">
      <div>
        <span class="inline-block font-bold uppercase mb-1 kicker-text">{{ t('restaurantManagement.kitchenTicketsPage.kicker') }}</span>
        <h1 class="font-bold m-0 page-title">{{ t('restaurantManagement.kitchenTicketsPage.title') }}</h1>
        <p class="mt-2 page-desc">{{ t('restaurantManagement.kitchenTicketsPage.description') }}</p>
      </div>
      <Button
          :label="t('restaurantManagement.kitchenTicketsPage.newTicket')"
          icon="pi pi-plus"
          severity="danger"
          @click="goToNewTicket"
      />
    </div>

    <div v-if="loading" class="flex justify-content-center py-5 loading-spinner">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <template v-else>
      <div class="grid">
        <div class="col-12 sm:col-4">
          <div class="flex flex-column align-items-center gap-1 p-4 bg-white shadow-1 border-2 kpi-card--pending" :style="{ borderRadius: '18px' }">
            <span class="font-extrabold kpi-value kpi-value--amber">{{ openCount }}</span>
            <span class="font-bold uppercase kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.pending') }}</span>
          </div>
        </div>
        <div class="col-12 sm:col-4">
          <div class="flex flex-column align-items-center gap-1 p-4 bg-white shadow-1 border-2 kpi-card--prep" :style="{ borderRadius: '18px' }">
            <span class="font-extrabold kpi-value kpi-value--red">{{ inPrepCount }}</span>
            <span class="font-bold uppercase kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.inPreparation') }}</span>
          </div>
        </div>
        <div class="col-12 sm:col-4">
          <div class="flex flex-column align-items-center gap-1 p-4 bg-white shadow-1 border-2 kpi-card--ready" :style="{ borderRadius: '18px' }">
            <span class="font-extrabold kpi-value kpi-value--green">{{ readyCount }}</span>
            <span class="font-bold uppercase kpi-label">{{ t('restaurantManagement.kitchenTicketsPage.ready') }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-1 overflow-x-auto table-wrapper" :style="{ borderRadius: '16px' }">
        <table class="w-full border-collapse main-table">
          <thead>
          <tr>
            <th class="text-left p-3 align-middle">{{ t('restaurantManagement.kitchenTicketsPage.orderNumber') }}</th>
            <th class="text-left p-3 align-middle">{{ t('restaurantManagement.kitchenTicketsPage.tableNumber') }}</th>
            <th class="text-left p-3 align-middle hide-md">{{ t('restaurantManagement.kitchenTicketsPage.typeService') }}</th>
            <th class="text-left p-3 align-middle hide-sm">{{ t('restaurantManagement.kitchenTicketsPage.items') }}</th>
            <th class="text-left p-3 align-middle">{{ t('restaurantManagement.tablesAndOccupancyPage.state') }}</th>
            <th class="text-left p-3 align-middle hide-md">{{ t('restaurantManagement.kitchenTicketsPage.dateCreated') }}</th>
            <th class="text-right p-3 align-middle"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in allOrders" :key="order.id" class="table-row">
            <td class="p-3 align-middle">
              <strong class="order-number">{{ order.number || '#' + order.id }}</strong>
            </td>
            <td class="p-3 align-middle">
                                <span v-if="tableCode(order)" class="inline-flex align-items-center gap-1 font-semibold table-badge">
                                    <i class="pi pi-table" /> {{ tableCode(order) }}
                                </span>
              <span v-else class="inline-flex align-items-center gap-1 font-semibold takeaway-badge">
                                    <i class="pi pi-shopping-bag" />
                                </span>
            </td>
            <td class="p-3 align-middle service-cell hide-md">{{ serviceTypeLabel(order) }}</td>
            <td class="p-3 align-middle font-semibold text-center hide-sm">{{ itemCount(order) }}</td>
            <td class="p-3 align-middle"><StatusBadge :status="order.state" /></td>
            <td class="p-3 align-middle time-cell hide-md">{{ formatDateTime(order.dateCreated) }}</td>
            <td class="p-3 align-middle">
              <div class="flex gap-1 justify-content-end actions-cell">
                <template v-if="order.state === 'pending'">
                  <Button icon="pi pi-play" severity="info" size="small" rounded text :tooltip="t('restaurantManagement.kitchenTicketsPage.markInPreparation')" @click="handleStatusChange(order.id, 'in_preparation')" />
                  <Button icon="pi pi-times" severity="danger" size="small" rounded text :tooltip="t('restaurantManagement.kitchenTicketsPage.cancel')" @click="handleStatusChange(order.id, 'cancelled')" />
                </template>
                <template v-else-if="order.state === 'in_preparation'">
                  <Button icon="pi pi-check" severity="success" size="small" rounded text :tooltip="t('restaurantManagement.kitchenTicketsPage.markReady')" @click="handleStatusChange(order.id, 'ready')" />
                  <Button icon="pi pi-times" severity="danger" size="small" rounded text :tooltip="t('restaurantManagement.kitchenTicketsPage.cancel')" @click="handleStatusChange(order.id, 'cancelled')" />
                </template>
                <template v-else-if="order.state === 'ready'">
                  <Button icon="pi pi-send" severity="secondary" size="small" rounded text :tooltip="t('restaurantManagement.kitchenTicketsPage.markDelivered')" @click="handleStatusChange(order.id, 'delivered')" />
                </template>
                <Button icon="pi pi-pencil" severity="contrast" size="small" rounded :tooltip="t('restaurantManagement.kitchenTicketsPage.edit')" @click="handleEdit(order)" />
                <Button icon="pi pi-trash" severity="danger" size="small" rounded :tooltip="t('restaurantManagement.kitchenTicketsPage.delete')" @click="handleDelete(order.id)" />
              </div>
            </td>
          </tr>
          <tr v-if="allOrders.length === 0">
            <td colspan="7" class="text-center p-5 empty-state">{{ t('restaurantManagement.kitchenTicketsPage.noOrders') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.kicker-text { color: #a07832; font-size: 12px; letter-spacing: 0.08em; }
.page-title { color: #342923; font-size: clamp(2rem, 2.2vw, 2.4rem); font-family: 'Poppins', system-ui, sans-serif; }
.page-desc { color: #65594f; font-size: 14px; }
.loading-spinner { font-size: 24px; color: #a07832; }
.kpi-value { font-size: 28px; line-height: 1; font-family: 'Poppins', system-ui, sans-serif; }
.kpi-value--amber { color: #e9b824; }
.kpi-value--red { color: #c21204; }
.kpi-value--green { color: #16a34a; }
.kpi-label { color: #7d7065; font-size: 11px; letter-spacing: 0.05em; }
.kpi-card--pending { border-color: #fef3c7; }
.kpi-card--prep { border-color: #fce4ec; }
.kpi-card--ready { border-color: #dcfce7; }
.table-wrapper { border: 1px solid #f0e8dd; }
.main-table { font-size: 13px; }
.main-table th { color: #7d7065; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #faf5ee; border-bottom: 2px solid #efe6da; white-space: nowrap; }
.main-table td { border-bottom: 1px solid #f0e8dd; color: #40342d; }
.table-row:hover { background: #faf5ee; }
.order-number { font-family: 'Poppins', system-ui, sans-serif; font-weight: 600; color: #2d241e; }
.table-badge { font-size: 12px; color: #4b3d34; }
.takeaway-badge { font-size: 12px; color: #a07832; }
.service-cell { color: #65594f; font-size: 12px; }
.time-cell { color: #7d7065; font-size: 12px; white-space: nowrap; text-align: center; }
.actions-cell { white-space: nowrap; }
.empty-state { color: #7d7065; font-size: 13px; }
@media (max-width: 768px) { .hide-md { display: none; } }
@media (max-width: 640px) { .hide-sm { display: none; } }
</style>
