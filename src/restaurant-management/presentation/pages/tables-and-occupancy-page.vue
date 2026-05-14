<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import TableCard from '../components/table-card.vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

const { t } = useI18n();
const store = useRestaurantManagementStore();

const {
  tables, tablesByLocation, freeTables, occupiedTables, loading
} = storeToRefs(store);

const { fetchTables, addTable } = store;

const totalTables = computed(() => tables.value.length);
const freeCount = computed(() => freeTables.value.length);
const occupiedCount = computed(() => occupiedTables.value.length);
const occupiedPercent = computed(() => {
  if (totalTables.value === 0) return 0;
  return Math.round((occupiedCount.value / totalTables.value) * 100);
});

const filterState = ref('all');
const searchQuery = ref('');
const selectedLocation = ref('');

const locations = computed(() => {
  const locs = tables.value.map(t => t.location).filter(Boolean);
  return [...new Set(locs)].sort();
});



function locationLabel(loc) {
  const key = loc.toLowerCase().replace(/\s+/g, '_');
  return t(`restaurantManagement.tablesAndOccupancyPage.locations.${key}`) || loc;
}

const filteredLocations = computed(() => {
  const grouped = {};
  Object.entries(tablesByLocation.value).forEach(([location, tbls]) => {
    const selectedLocName = selectedLocation.value || '';
    if (selectedLocName && location !== selectedLocName) return;

    let filtered = filterState.value === 'all'
        ? tbls
        : tbls.filter(t => t.state === filterState.value);

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      filtered = filtered.filter(t =>
          String(t.number).toLowerCase().includes(q) ||
          (t.location && t.location.toLowerCase().includes(q))
      );
    }
    if (filtered.length > 0) grouped[location] = filtered;
  });
  return grouped;
});

onMounted(() => {
  fetchTables();
});

/* ============================================================
 * BEGIN: Add Table functionality
 * ============================================================
 * To remove this feature entirely:
 *   1. Delete the `addTableDialogVisible` ref, `newTable` ref,
 *      `openAddTableDialog()`, and `handleAddTable()` functions below.
 *   2. In <template>, remove the <Button> with @click="openAddTableDialog"
 *      (marked with "REMOVE-IF-ADD-TABLE-REMOVED").
 *   3. Remove the entire <pv-dialog> block (marked with
 *      "REMOVE-IF-ADD-TABLE-REMOVED").
 *   4. Remove `addTable` from the store destructure above.
 *   5. Revert the i18n keys `addTable`, `confirmAddTable`, `cancel`
 *      from the locale JSON files (optional).
 * ============================================================ */
const addTableDialogVisible = ref(false);
const newTable = ref({
  number: '',
  capacity: 4,
  location: ''
});

function openAddTableDialog() {
  newTable.value = { number: '', capacity: 4, location: '' };
  addTableDialogVisible.value = true;
}

function handleAddTable() {
  if (!newTable.value.number) return;
  addTable({
    number: newTable.value.number,
    capacity: newTable.value.capacity,
    location: newTable.value.location || 'Main Hall',
    state: 'available',
    active: true
  }).then(() => {
    addTableDialogVisible.value = false;
    fetchTables();
  });
}
/* ============================================================
 * END: Add Table functionality
 * ============================================================ */
</script>

<template>
  <section class="flex flex-column gap-3">
    <div class="flex justify-content-between align-items-start gap-3">
      <div>
        <span class="inline-block font-bold uppercase mb-1 kicker-text">{{ t('restaurantManagement.tablesAndOccupancyPage.kicker') }}</span>
        <h1 class="font-bold m-0 page-title">{{ t('restaurantManagement.tablesAndOccupancyPage.title') }}</h1>
        <p class="mt-2 page-desc">{{ t('restaurantManagement.tablesAndOccupancyPage.description') }}</p>
      </div>
      <!-- REMOVE-IF-ADD-TABLE-REMOVED: delete this Button when removing Add Table -->
      <Button
        :label="t('restaurantManagement.tablesAndOccupancyPage.addTable')"
        icon="pi pi-plus"
        severity="danger"
        @click="openAddTableDialog"
      />
    </div>

    <div class="grid equal-height-row">
      <div class="col-12 sm:col-4 flex">
        <div class="flex flex-column align-items-center gap-1 p-4 bg-white border-round shadow-1 border-2 stat-card flex-1">
          <span class="font-extrabold stat-value">{{ totalTables }}</span>
          <span class="font-bold uppercase stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.totalTables') }}</span>
          <div class="w-full progress-wrapper">
            <ProgressBar :value="occupiedPercent" class="occupied-progress" />
          </div>
          <span class="font-bold stat-sub">{{ occupiedPercent }}% {{ t('restaurantManagement.tablesAndOccupancyPage.occupied') }}</span>
        </div>
      </div>
      <div class="col-12 sm:col-4 flex">
        <div class="flex flex-column align-items-center gap-1 p-4 bg-white border-round shadow-1 border-2 stat-card--free flex-1">
          <span class="font-extrabold stat-value--green">{{ freeCount }}</span>
          <span class="font-bold uppercase stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.freeTables') }}</span>
        </div>
      </div>
      <div class="col-12 sm:col-4 flex">
        <div class="flex flex-column align-items-center gap-1 p-4 bg-white border-round shadow-1 border-2 stat-card--occupied flex-1">
          <span class="font-extrabold stat-value--red">{{ occupiedCount }}</span>
          <span class="font-bold uppercase stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.occupiedTables') }}</span>
        </div>
      </div>
    </div>

    <div class="flex align-items-center gap-2 flex-wrap">
            <span class="flex align-items-center gap-1 p-2 border-1 bg-white border-round flex-1 search-box">
                <i class="pi pi-search search-icon" />
                <InputText
                    v-model="searchQuery"
                    :placeholder="t('restaurantManagement.tablesAndOccupancyPage.searchPlaceholder')"
                    class="w-full border-none bg-transparent search-input"
                />
            </span>

      <Select
        v-model="selectedLocation"
        :options="locations"
        :placeholder="t('restaurantManagement.tablesAndOccupancyPage.allLocations')"
        class="location-select"
        :showClear="true"
      />

      <div class="flex gap-1">
        <button type="button" class="cursor-pointer font-semibold border-round filter-btn" :class="{ 'filter-btn--active filter-btn--all': filterState === 'all' }" @click="filterState = 'all'">
          {{ t('restaurantManagement.tablesAndOccupancyPage.all') }}
        </button>
        <button type="button" class="cursor-pointer font-semibold border-round filter-btn" :class="{ 'filter-btn--active filter-btn--free': filterState === 'available' }" @click="filterState = 'available'">
          {{ t('restaurantManagement.tablesAndOccupancyPage.free') }}
        </button>
        <button type="button" class="cursor-pointer font-semibold border-round filter-btn" :class="{ 'filter-btn--active filter-btn--occupied': filterState === 'busy' }" @click="filterState = 'busy'">
          {{ t('restaurantManagement.tablesAndOccupancyPage.occupied') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-content-center py-5 loading-spinner">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <div v-else-if="Object.keys(filteredLocations).length === 0" class="p-5 text-center bg-white border-round empty-state">
      <p>{{ t('restaurantManagement.tablesAndOccupancyPage.noTables') }}</p>
    </div>

    <div v-else v-for="(tbls, location) in filteredLocations" :key="location" class="flex flex-column align-items-center gap-2">
      <h2 class="font-bold m-0 text-center w-full pb-1 location-title">{{ locationLabel(location) }}</h2>
      <div class="flex flex-wrap justify-content-center" :style="{ gap: '14px', width: '100%' }">
        <TableCard v-for="table in tbls" :key="table.id" :table="table" />
      </div>
    </div>

    <!-- REMOVE-IF-ADD-TABLE-REMOVED: remove this entire <pv-dialog> block -->
    <pv-dialog
      v-model:visible="addTableDialogVisible"
      modal
      :header="t('restaurantManagement.tablesAndOccupancyPage.addTable')"
      :style="{ width: 'min(420px, calc(100vw - 32px))' }"
      :draggable="false"
    >
      <div class="flex flex-column gap-3 p-3">
        <div class="flex flex-column gap-1">
          <label class="dialog-label">{{ t('restaurantManagement.tablesAndOccupancyPage.tableNumber') }}</label>
          <InputText v-model="newTable.number" :placeholder="t('restaurantManagement.tablesAndOccupancyPage.tableNumber')" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="dialog-label">{{ t('restaurantManagement.tablesAndOccupancyPage.capacity') }}</label>
          <InputNumber v-model="newTable.capacity" :min="1" :max="20" class="w-full" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="dialog-label">{{ t('restaurantManagement.tablesAndOccupancyPage.location') }}</label>
          <InputText v-model="newTable.location" :placeholder="t('restaurantManagement.tablesAndOccupancyPage.location')" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            :label="t('restaurantManagement.tablesAndOccupancyPage.cancel')"
            severity="secondary"
            outlined
            @click="addTableDialogVisible = false"
          />
          <Button
            :label="t('restaurantManagement.tablesAndOccupancyPage.confirmAddTable')"
            severity="danger"
            @click="handleAddTable"
            :disabled="!newTable.number"
          />
        </div>
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.kicker-text { color: #a07832; font-size: 12px; letter-spacing: 0.08em; }
.page-title { color: #342923; font-size: clamp(2rem, 2.2vw, 2.4rem); font-family: 'Poppins', system-ui, sans-serif; }
.page-desc { color: #65594f; font-size: 14px; }
.loading-spinner { font-size: 24px; color: #a07832; }
.stat-value { color: #2d241e; font-size: 28px; line-height: 1; font-family: 'Poppins', system-ui, sans-serif; }
.stat-value--green { color: #16a34a; font-size: 28px; line-height: 1; font-family: 'Poppins', system-ui, sans-serif; }
.stat-value--red { color: #dc2626; font-size: 28px; line-height: 1; font-family: 'Poppins', system-ui, sans-serif; }
.stat-label { color: #7d7065; font-size: 11px; letter-spacing: 0.05em; }
.stat-sub { color: #7d7065; font-size: 13px; }
.stat-card { border-color: #f0e8dd; }
.stat-card--free { border-color: #bbf7d0; }
.stat-card--occupied { border-color: #fecaca; }

/* Equal height for stat cards row */
.equal-height-row { display: flex; flex-wrap: wrap; }
.equal-height-row > .flex { display: flex; }

.search-box { border-color: #ebe2d7; min-width: 180px; }
.search-icon { color: #a09489; }
.search-input { box-shadow: none !important; color: #40342d !important; }
.search-input::placeholder { color: #a09489 !important; }

/* Progress bar styles */
.progress-wrapper { margin-top: 2px; }
.occupied-progress :deep(.p-progressbar-value) {
  background: linear-gradient(90deg, #e9b824, #dc2626);
}
.occupied-progress :deep(.p-progressbar) {
  height: 8px;
  border-radius: 4px;
  background: #f0e8dd;
}

/* Select styling */
.location-select {
  min-width: 160px;
}
.location-select :deep(.p-select-label) {
  color: #4b3d34;
  font-size: 13px;
  padding: 0.78rem 0.9rem;
}
.location-select :deep(.p-select-dropdown) {
  color: #4b3d34;
  width: 2rem;
}
.location-select :deep(.p-select) {
  padding: 0;
  border-color: #ebe2d7;
  min-height: 42px;
}

/* Filter buttons */
.filter-btn { padding: 8px 16px; border: 1px solid #e6ddd3; font-size: 13px; background: #fff; color: #4b3d34; transition: all 0.2s; }
.filter-btn--active.filter-btn--all { background: #2d241e; color: #fff; border-color: #2d241e; }
.filter-btn--active.filter-btn--free { background: #16a34a; color: #fff; border-color: #16a34a; }
.filter-btn--active.filter-btn--occupied { background: #dc2626; color: #fff; border-color: #dc2626; }
.empty-state { color: #7d7065; }
.location-title { color: #40342d; font-size: 18px; border-bottom: 2px solid #aa9387; font-family: 'Poppins', system-ui, sans-serif; }

/* Dialog form label */
.dialog-label { font-size: 13px; font-weight: 600; color: #40342d; }
</style>
