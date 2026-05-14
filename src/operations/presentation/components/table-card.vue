<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const props = defineProps({
  table: { type: Object, required: true }
});

const { t } = useI18n();
const store = useRestaurantManagementStore();
const route = useRoute();
const router = useRouter();

const isFree = computed(() => props.table.state === 'available');
const isOccupied = computed(() => props.table.state === 'busy');

const stateLabel = computed(() => {
  if (isFree.value) return t('restaurantManagement.tablesAndOccupancyPage.free');
  if (isOccupied.value) return t('restaurantManagement.tablesAndOccupancyPage.occupied');
  return props.table.state;
});

const cardStyle = computed(() => ({
  borderColor: isFree.value ? '#bbf7d0' : isOccupied.value ? '#fecaca' : '#f0e8dd',
  backgroundColor: isOccupied.value ? '#fef2f2' : '#fff'
}));

const dotColor = computed(() => isFree.value ? '#16a34a' : isOccupied.value ? '#dc2626' : '#d1d5db');

const stateStyle = computed(() => ({
  color: isFree.value ? '#16a34a' : isOccupied.value ? '#dc2626' : '#6b7280',
  backgroundColor: isFree.value ? 'rgba(22,163,74,0.25)' : isOccupied.value ? 'rgba(220,38,38,0.25)' : 'rgba(107,114,128,0.15)'
}));

const tablePathPrefix = computed(() => `/operations/tables/${props.table.id}`);
const showDetails = computed({
  get: () => route.path === `${tablePathPrefix.value}/view`,
  set: (visible) => {
    if (visible) {
      router.push(`${tablePathPrefix.value}/view`);
    } else if (route.path.startsWith(tablePathPrefix.value)) {
      router.push('/operations/tables');
    }
  }
});

function handleDelete() {
  if (!confirm(t('restaurantManagement.tablesAndOccupancyPage.deleteTable'))) return;
  store.deleteTable(props.table.id).then(() => router.push('/operations/tables'));
}
</script>

<template>
  <article
      class="flex flex-column bg-white border-round shadow-1 border-2 p-3 relative overflow-hidden"
      :style="{ width: '200px', minHeight: '80px', borderRadius: '18px', ...cardStyle }"
  >
    <div class="flex align-items-center gap-1">
      <div class="border-circle" :style="{ width: '8px', height: '8px', backgroundColor: dotColor, flexShrink: 0 }" />
      <div class="flex flex-column flex-1" :style="{ gap: '2px' }">
        <strong class="flex align-items-center gap-1 font-heading" :style="{ color: '#40342d', fontSize: '18px' }">
          <i class="pi pi-table" :style="{ fontSize: '14px', color: '#7d7065' }" />
          {{ table.code ||String(table.number).padStart(2, '0') }}
        </strong>
        <span class="flex align-items-center gap-1" :style="{ fontSize: '12px', color: '#8e8177' }">
          <i class="pi pi-users" /> {{ table.capacity }}
        </span>
        <span
            class="inline-block font-bold uppercase border-round px-2 py-1"
            :style="{ fontSize: '11px', letterSpacing: '0.05em', ...stateStyle }"
        >
          {{ stateLabel }}
        </span>
      </div>
    </div>
    <button
        type="button"
        class="border-none bg-transparent cursor-pointer p-0 mt-2 view-details-btn"
        @click="router.push(`${tablePathPrefix}/view`)"
    >
      {{ t('restaurantManagement.tablesAndOccupancyPage.viewDetails') }}
    </button>

    <pv-dialog
        v-model:visible="showDetails"
        modal
        :header="t('restaurantManagement.tablesAndOccupancyPage.tableDetails')"
        :style="{ width: 'min(400px, calc(100vw - 32px))' }"
        :draggable="false"
    >
      <div class="flex flex-column gap-3 p-3">
        <div class="flex flex-column gap-1">
          <label class="detail-label">{{ t('restaurantManagement.tablesAndOccupancyPage.tableNumber') }}</label>
          <span class="detail-value">{{ table.code || String(table.number).padStart(2, '0') }}</span>
        </div>
        <div class="flex flex-column gap-1">
          <label class="detail-label">{{ t('restaurantManagement.tablesAndOccupancyPage.capacity') }}</label>
          <span class="detail-value">{{ table.capacity }} {{ t('restaurantManagement.tablesAndOccupancyPage.people') }}</span>
        </div>
        <div class="flex flex-column gap-1">
          <label class="detail-label">{{ t('restaurantManagement.tablesAndOccupancyPage.state') }}</label>
          <span
              class="inline-block font-bold uppercase border-round px-2 py-1"
              :style="{ fontSize: '12px', letterSpacing: '0.05em', width: 'fit-content', ...stateStyle }"
          >
            {{ stateLabel }}
          </span>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-content-between gap-2">
          <Button
              :label="t('restaurantManagement.tablesAndOccupancyPage.deleteTable')"
              icon="pi pi-trash"
              severity="danger"
              @click="handleDelete"
          />
          <Button
              :label="t('restaurantManagement.tablesAndOccupancyPage.close')"
              severity="secondary"
              outlined
              @click="showDetails = false"
          />
        </div>
      </template>
    </pv-dialog>
  </article>
</template>

<style scoped>
.font-heading {
  font-family: 'Poppins', system-ui, sans-serif;
}
.view-details-btn {
  font-size: 11px;
  color: #a07832;
  text-decoration: underline;
  text-underline-offset: 2px;
  align-self: flex-start;
}
.view-details-btn:hover {
  color: #7d5c1a;
}
.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #7d7065;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.detail-value {
  font-size: 16px;
  color: #40342d;
  font-weight: 600;
}
</style>
