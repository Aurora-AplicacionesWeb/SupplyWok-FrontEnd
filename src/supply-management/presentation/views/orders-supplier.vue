<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import useSupplierManagementStore from '../../application/supply-management.store.js';

const { t } = useI18n();
const store = useSupplierManagementStore();
const { purchaseOrders, purchaseOrdersLoaded } = storeToRefs(store);
const { fetchPurchaseOrders } = store;

const searchQuery = ref('');
const statusFilter = ref('all');
const selectedOrder = ref(null);
const isDetailsDialogVisible = ref(false);

const statusOptions = computed(() => [
  { label: t('supplier-management.orders.filters.all'), value: 'all' },
  { label: t('supplier-management.orders.filters.confirmed'), value: 'Confirmed' },
  { label: t('supplier-management.orders.filters.pending'), value: 'Pending' },
  { label: t('supplier-management.orders.filters.in-transit'), value: 'In Transit' },
  { label: t('supplier-management.orders.filters.delivered'), value: 'Delivered' },
  { label: t('supplier-management.orders.filters.delayed'), value: 'Delayed' }
]);

const orderStats = computed(() => {
  const total = purchaseOrders.value.length;
  const pending = purchaseOrders.value.filter((order) => order.status === 'Pending').length;
  const inTransit = purchaseOrders.value.filter((order) => order.status === 'In Transit').length;
  const delivered = purchaseOrders.value.filter((order) => order.status === 'Delivered').length;

  return { total, pending, inTransit, delivered };
});

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return purchaseOrders.value.filter((order) => {
    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value;
    if (!matchesStatus) return false;

    if (!query) return true;

    return [
      order.code,
      order.restaurantName,
      order.supplierName,
      order.status,
      order.priority
    ].some((value) => String(value).toLowerCase().includes(query));
  });
});

const visibleOrdersText = computed(() =>
  t('supplier-management.orders.visible-count', {
    visible: filteredOrders.value.length,
    total: purchaseOrders.value.length
  })
);

function openOrderDetails(order) {
  selectedOrder.value = order;
  isDetailsDialogVisible.value = true;
}

function setOrderStatus(order, status) {
  order.status = status;
}

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '-';
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function formatDateTime(dateValue) {
  if (!dateValue) return '-';
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '-';
  return parsedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(amount) {
  return `$${Number(amount ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: Number(amount ?? 0) % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2
  })}`;
}

function priorityClass(priority) {
  const value = String(priority || '').toLowerCase();
  if (value === 'high') return 'orders-page__pill--high';
  if (value === 'medium') return 'orders-page__pill--medium';
  return 'orders-page__pill--low';
}

function statusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'pending') return 'orders-page__pill--pending';
  if (value === 'confirmed') return 'orders-page__pill--confirmed';
  if (value === 'in transit') return 'orders-page__pill--transit';
  if (value === 'delivered') return 'orders-page__pill--delivered';
  return 'orders-page__pill--delayed';
}

onMounted(() => {
  if (!purchaseOrdersLoaded.value) fetchPurchaseOrders();
});

</script>

<template>
  <section class="orders-page">
    <header class="orders-page__header">
      <div>
        <p class="orders-page__eyebrow">{{ t('supplier-management.orders.breadcrumb') }}</p>
        <h1 class="orders-page__title">{{ t('supplier-management.orders.title') }}</h1>
        <p class="orders-page__subtitle">{{ t('supplier-management.orders.subtitle') }}</p>
      </div>
    </header>

    <section class="orders-page__stats">
      <article class="orders-page__stat-card">
        <span class="orders-page__stat-label">{{ t('supplier-management.orders.stats.total') }}</span>
        <strong class="orders-page__stat-value">{{ orderStats.total }}</strong>
      </article>
      <article class="orders-page__stat-card">
        <span class="orders-page__stat-label">{{ t('supplier-management.orders.stats.pending') }}</span>
        <strong class="orders-page__stat-value">{{ orderStats.pending }}</strong>
      </article>
      <article class="orders-page__stat-card">
        <span class="orders-page__stat-label">{{ t('supplier-management.orders.stats.in-transit') }}</span>
        <strong class="orders-page__stat-value">{{ orderStats.inTransit }}</strong>
      </article>
      <article class="orders-page__stat-card">
        <span class="orders-page__stat-label">{{ t('supplier-management.orders.stats.delivered') }}</span>
        <strong class="orders-page__stat-value">{{ orderStats.delivered }}</strong>
      </article>
    </section>

    <section class="orders-page__filters">
      <div class="orders-page__search">
        <label for="orders-search">{{ t('supplier-management.orders.search') }}</label>
        <pv-input-text id="orders-search" v-model="searchQuery" type="search" />
      </div>
      <label class="orders-page__status-filter">
        <span>{{ t('supplier-management.orders.filters.status') }}</span>
        <select v-model="statusFilter">
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </section>

    <pv-datatable
      class="orders-table"
      :loading="!purchaseOrdersLoaded"
      :value="filteredOrders"
      responsive-layout="scroll"
    >
      <pv-column field="code" :header="t('supplier-management.orders.columns.code')" />
      <pv-column field="restaurantName" :header="t('supplier-management.orders.columns.restaurant')" />
      <pv-column :header="t('supplier-management.orders.columns.order-date')">
        <template #body="{ data }">
          {{ formatDate(data.orderDate) }}
        </template>
      </pv-column>
      <pv-column :header="t('supplier-management.orders.columns.priority')">
        <template #body="{ data }">
          <span class="orders-page__pill" :class="priorityClass(data.priority)">{{ data.priority }}</span>
        </template>
      </pv-column>
      <pv-column :header="t('supplier-management.orders.columns.status')">
        <template #body="{ data }">
          <span class="orders-page__pill" :class="statusClass(data.status)">{{ data.status }}</span>
        </template>
      </pv-column>
      <pv-column :header="t('supplier-management.orders.columns.items')">
        <template #body="{ data }">
          {{ data.items?.length ?? 0 }}
        </template>
      </pv-column>
      <pv-column :header="t('supplier-management.orders.columns.actions')">
        <template #body="{ data }">
          <div class="orders-page__actions">
            <pv-button
              :label="t('supplier-management.orders.actions.confirm')"
              class="orders-page__action-btn"
              text
              type="button"
              :disabled="data.status === 'Confirmed'"
              @click="setOrderStatus(data, 'Confirmed')"
            />
            <pv-button
              :label="t('supplier-management.orders.actions.mark-in-transit')"
              class="orders-page__action-btn"
              text
              type="button"
              :disabled="data.status === 'In Transit'"
              @click="setOrderStatus(data, 'In Transit')"
            />
            <pv-button
              :label="t('supplier-management.orders.actions.mark-delivered')"
              class="orders-page__action-btn"
              text
              type="button"
              :disabled="data.status === 'Delivered'"
              @click="setOrderStatus(data, 'Delivered')"
            />
            <pv-button
              :label="t('supplier-management.orders.actions.view')"
              class="orders-page__action-btn"
              text
              type="button"
              @click="openOrderDetails(data)"
            />
          </div>
        </template>
      </pv-column>
      <template #empty>
        <span class="orders-page__empty">{{ t('supplier-management.orders.empty') }}</span>
      </template>
    </pv-datatable>

    <p class="orders-page__visible-count">{{ visibleOrdersText }}</p>

    <pv-dialog
      v-model:visible="isDetailsDialogVisible"
      modal
      :draggable="false"
      :header="t('supplier-management.orders.details.title')"
      :style="{ width: 'min(900px, calc(100vw - 32px))' }"
    >
      <template v-if="selectedOrder">
        <section class="orders-page__detail-header">
          <div>
            <p class="orders-page__detail-code">{{ selectedOrder.code }}</p>
            <p class="orders-page__detail-restaurant">{{ selectedOrder.restaurantName }}</p>
          </div>
          <span class="orders-page__pill" :class="statusClass(selectedOrder.status)">{{ selectedOrder.status }}</span>
        </section>

        <section class="orders-page__detail-meta">
          <article>
            <span>{{ t('supplier-management.orders.details.order-date') }}</span>
            <strong>{{ formatDate(selectedOrder.orderDate) }}</strong>
          </article>
          <article>
            <span>{{ t('supplier-management.orders.details.delivery-date') }}</span>
            <strong>{{ formatDateTime(selectedOrder.estimatedDate) }}</strong>
          </article>
          <article>
            <span>{{ t('supplier-management.orders.details.priority') }}</span>
            <strong>{{ selectedOrder.priority }}</strong>
          </article>
          <article>
            <span>{{ t('supplier-management.orders.details.supplier') }}</span>
            <strong>{{ selectedOrder.supplierName }}</strong>
          </article>
        </section>

        <pv-datatable class="orders-detail-table" :value="selectedOrder.items ?? []" responsive-layout="scroll">
          <pv-column field="productName" :header="t('supplier-management.orders.details.columns.product')" />
          <pv-column field="quantity" :header="t('supplier-management.orders.details.columns.quantity')" />
          <pv-column field="unitType" :header="t('supplier-management.orders.details.columns.unit')" />
          <pv-column :header="t('supplier-management.orders.details.columns.unit-price')">
            <template #body="{ data }">
              {{ formatCurrency(data.unitPrice) }}
            </template>
          </pv-column>
          <pv-column :header="t('supplier-management.orders.details.columns.subtotal')">
            <template #body="{ data }">
              {{ formatCurrency((data.quantity ?? 0) * (data.unitPrice ?? 0)) }}
            </template>
          </pv-column>
        </pv-datatable>
      </template>
      <template #footer>
        <pv-button
          :label="t('supplier-management.orders.details.close')"
          severity="secondary"
          outlined
          type="button"
          @click="isDetailsDialogVisible = false"
        />
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.orders-page {
  min-height: 100%;
  color: #2d241e;
  font-family: 'Montserrat', system-ui, sans-serif;
}

.orders-page__header {
  margin-bottom: 20px;
}

.orders-page__eyebrow {
  margin: 0 0 6px;
  color: #b0762a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
}

.orders-page__title {
  margin: 0;
  color: #241c17;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 30px;
  line-height: 1.1;
}

.orders-page__subtitle {
  margin: 8px 0 0;
  color: #6f665d;
  font-size: 14px;
}

.orders-page__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.orders-page__stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid #efe4d4;
  border-radius: 12px;
  background: #fffdf9;
}

.orders-page__stat-label {
  color: #6f665d;
  font-size: 12px;
  font-weight: 700;
}

.orders-page__stat-value {
  color: #241c17;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 24px;
  line-height: 1;
}

.orders-page__filters {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
  margin-bottom: 16px;
}

.orders-page__search,
.orders-page__status-filter {
  padding: 16px;
  border: 1px solid #efe4d4;
  border-radius: 14px;
  background: #fffdf9;
}

.orders-page__search label,
.orders-page__status-filter span {
  display: block;
  margin-bottom: 8px;
  color: #312820;
  font-size: 12px;
  font-weight: 800;
}

.orders-page__search :deep(.p-inputtext) {
  width: 100%;
  min-height: 40px;
}

.orders-page__status-filter select {
  width: 100%;
  min-height: 40px;
  border: 1px solid #d8dfe8;
  border-radius: 10px;
  color: #344457;
  font: inherit;
  padding: 0 10px;
}

.orders-table :deep(.p-datatable-table) {
  min-width: 980px;
}

.orders-table :deep(.p-datatable-header-cell) {
  background: #f8edce;
  color: #2d241e;
  font-weight: 800;
}

.orders-table :deep(.p-datatable-tbody > tr > td),
.orders-table :deep(.p-datatable-thead > tr > th) {
  padding: 14px 12px;
  border-color: #edf0f3;
  font-size: 14px;
}

.orders-table :deep(.p-datatable-tbody > tr > td) {
  color: #536579;
  font-weight: 600;
}

.orders-page__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.orders-page__pill--high {
  background: #fde2e0;
  color: #9a1e1a;
}

.orders-page__pill--medium {
  background: #fff2db;
  color: #8b5b13;
}

.orders-page__pill--low {
  background: #e6f5e8;
  color: #236834;
}

.orders-page__pill--pending {
  background: #fff2db;
  color: #8b5b13;
}

.orders-page__pill--confirmed {
  background: #dff1ff;
  color: #1f5f8f;
}

.orders-page__pill--transit {
  background: #dff1ff;
  color: #1f5f8f;
}

.orders-page__pill--delivered {
  background: #e6f5e8;
  color: #236834;
}

.orders-page__pill--delayed {
  background: #fde2e0;
  color: #9a1e1a;
}

.orders-page__empty {
  display: block;
  text-align: center;
  color: #536579;
}

.orders-page__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.orders-page__action-btn:deep(.p-button) {
  color: #8b5b13;
  font-weight: 700;
  padding: 0.2rem 0.35rem;
}

.orders-page__action-btn:deep(.p-button):disabled {
  opacity: 0.45;
}

.orders-page__visible-count {
  margin: 8px 2px 0;
  color: #7b7269;
  font-size: 12px;
}

.orders-page__detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.orders-page__detail-code {
  margin: 0;
  color: #241c17;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.orders-page__detail-restaurant {
  margin: 2px 0 0;
  color: #6f665d;
  font-size: 13px;
}

.orders-page__detail-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.orders-page__detail-meta article {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border: 1px solid #efe4d4;
  border-radius: 10px;
  background: #fffdf9;
}

.orders-page__detail-meta span {
  color: #6f665d;
  font-size: 11px;
  font-weight: 700;
}

.orders-page__detail-meta strong {
  color: #2d241e;
  font-size: 13px;
}

.orders-detail-table :deep(.p-datatable-thead > tr > th) {
  background: #f8edce;
  color: #2d241e;
  font-weight: 800;
}

@media (max-width: 1000px) {
  .orders-page__stats {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }

  .orders-page__filters {
    grid-template-columns: 1fr;
  }

  .orders-page__detail-meta {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}

</style>
