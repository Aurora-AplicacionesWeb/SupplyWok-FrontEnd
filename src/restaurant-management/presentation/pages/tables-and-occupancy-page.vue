<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import useRestaurantManagementStore from '../../application/restaurant-management.store.js';
import TableCard from '../components/table-card.vue';
import InputText from 'primevue/inputtext';

const { t } = useI18n();
const store = useRestaurantManagementStore();

const {
    tables, tablesByLocation, freeTables, occupiedTables, loading
} = storeToRefs(store);

const { fetchTables } = store;

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
        if (selectedLocation.value && location !== selectedLocation.value) return;

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
</script>

<template>
    <section class="tables-and-occupancy-page">
        <div class="tables-and-occupancy-page__header">
            <div>
                <span class="tables-and-occupancy-page__kicker">{{ t('restaurantManagement.tablesAndOccupancyPage.kicker') }}</span>
                <h1 class="tables-and-occupancy-page__title">{{ t('restaurantManagement.tablesAndOccupancyPage.title') }}</h1>
                <p class="tables-and-occupancy-page__description">{{ t('restaurantManagement.tablesAndOccupancyPage.description') }}</p>
            </div>
        </div>

        <div class="tables-and-occupancy-page__stats">
            <div class="tables-and-occupancy-page__stat-card">
                <span class="tables-and-occupancy-page__stat-value">{{ totalTables }}</span>
                <span class="tables-and-occupancy-page__stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.totalTables') }}</span>
                <span class="tables-and-occupancy-page__stat-sub">{{ occupiedPercent }}% {{ t('restaurantManagement.tablesAndOccupancyPage.occupied') }}</span>
            </div>
            <div class="tables-and-occupancy-page__stat-card tables-and-occupancy-page__stat-card--free">
                <span class="tables-and-occupancy-page__stat-value">{{ freeCount }}</span>
                <span class="tables-and-occupancy-page__stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.freeTables') }}</span>
            </div>
            <div class="tables-and-occupancy-page__stat-card tables-and-occupancy-page__stat-card--occupied">
                <span class="tables-and-occupancy-page__stat-value">{{ occupiedCount }}</span>
                <span class="tables-and-occupancy-page__stat-label">{{ t('restaurantManagement.tablesAndOccupancyPage.occupiedTables') }}</span>
            </div>
        </div>

        <div class="tables-and-occupancy-page__toolbar">
            <span class="tables-and-occupancy-page__search">
                <i class="pi pi-search" />
                <InputText
                    v-model="searchQuery"
                    :placeholder="t('restaurantManagement.tablesAndOccupancyPage.searchPlaceholder')"
                />
            </span>

            <select v-model="selectedLocation" class="tables-and-occupancy-page__location-select">
                <option value="">{{ t('restaurantManagement.tablesAndOccupancyPage.allLocations') }}</option>
                <option v-for="loc in locations" :key="loc" :value="loc">{{ locationLabel(loc) }}</option>
            </select>

            <div class="tables-and-occupancy-page__filters">
                <button
                    type="button"
                    class="tables-and-occupancy-page__filter-btn"
                    :class="{ 'tables-and-occupancy-page__filter-btn--active': filterState === 'all' }"
                    @click="filterState = 'all'"
                >
                    {{ t('restaurantManagement.tablesAndOccupancyPage.all') }}
                </button>
                <button
                    type="button"
                    class="tables-and-occupancy-page__filter-btn tables-and-occupancy-page__filter-btn--free"
                    :class="{ 'tables-and-occupancy-page__filter-btn--active': filterState === 'available' }"
                    @click="filterState = 'available'"
                >
                    {{ t('restaurantManagement.tablesAndOccupancyPage.free') }}
                </button>
                <button
                    type="button"
                    class="tables-and-occupancy-page__filter-btn tables-and-occupancy-page__filter-btn--occupied"
                    :class="{ 'tables-and-occupancy-page__filter-btn--active': filterState === 'busy' }"
                    @click="filterState = 'busy'"
                >
                    {{ t('restaurantManagement.tablesAndOccupancyPage.occupied') }}
                </button>
            </div>
        </div>

        <div v-if="loading" class="tables-and-occupancy-page__loading">
            <i class="pi pi-spin pi-spinner" />
        </div>

        <div v-else-if="Object.keys(filteredLocations).length === 0" class="tables-and-occupancy-page__empty">
            <p>{{ t('restaurantManagement.tablesAndOccupancyPage.noTables') }}</p>
        </div>

        <div v-else v-for="(tbls, location) in filteredLocations" :key="location" class="tables-and-occupancy-page__location-group">
            <h2 class="tables-and-occupancy-page__location-title">{{ locationLabel(location) }}</h2>
            <div class="tables-and-occupancy-page__grid">
                <TableCard
                    v-for="table in tbls"
                    :key="table.id"
                    :table="table"
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
.tables-and-occupancy-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.tables-and-occupancy-page__kicker {
    display: inline-block;
    color: #a07832;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.tables-and-occupancy-page__title {
    margin: 0;
    color: #342923;
    font-size: clamp(2rem, 2.2vw, 2.4rem);
    font-family: 'Poppins', system-ui, sans-serif;
    font-weight: 700;
}

.tables-and-occupancy-page__description {
    margin: 8px 0 0;
    color: #65594f;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 14px;
}

.tables-and-occupancy-page__toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.tables-and-occupancy-page__search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid #ebe2d7;
    background: #fff;
    border-radius: 10px;
    flex: 1;
    min-width: 180px;
}

.tables-and-occupancy-page__search :deep(.p-inputtext) {
    border: none;
    background: transparent;
    box-shadow: none;
    width: 100%;
    color: #40342d;
}

.tables-and-occupancy-page__search :deep(.p-inputtext::placeholder) {
    color: #a09489;
}

.tables-and-occupancy-page__location-select {
    border: 1px solid #ebe2d7;
    background: #fff;
    border-radius: 10px;
    padding: 0.78rem 0.9rem;
    color: #4b3d34;
    min-width: 140px;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 13px;
}

.tables-and-occupancy-page__filters {
    display: flex;
    gap: 6px;
}

.tables-and-occupancy-page__filter-btn {
    padding: 8px 16px;
    border: 1px solid #e6ddd3;
    border-radius: 8px;
    background: #fff;
    color: #4b3d34;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.tables-and-occupancy-page__filter-btn--active {
    background: #2d241e;
    color: #fff;
    border-color: #2d241e;
}

.tables-and-occupancy-page__filter-btn--free.tables-and-occupancy-page__filter-btn--active {
    background: #16a34a;
    border-color: #16a34a;
}

.tables-and-occupancy-page__filter-btn--occupied.tables-and-occupancy-page__filter-btn--active {
    background: #dc2626;
    border-color: #dc2626;
}

.tables-and-occupancy-page__loading {
    display: flex;
    justify-content: center;
    padding: 48px;
    font-size: 24px;
    color: #a07832;
}

.tables-and-occupancy-page__empty {
    padding: 32px;
    text-align: center;
    color: #7d7065;
    background: #fff;
    border-radius: 16px;
}

.tables-and-occupancy-page__location-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.tables-and-occupancy-page__location-title {
    margin: 0;
    color: #40342d;
    font-size: 18px;
    font-weight: 700;
    padding-bottom: 4px;
    border-bottom: 2px solid #efe6da;
    font-family: 'Poppins', system-ui, sans-serif;
    text-align: center;
    width: 100%;
}

.tables-and-occupancy-page__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    width: 100%;
    justify-content: center;
}

.tables-and-occupancy-page__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.tables-and-occupancy-page__stat-card {
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

.tables-and-occupancy-page__stat-card--free {
    border-color: #bbf7d0;
}

.tables-and-occupancy-page__stat-card--occupied {
    border-color: #fecaca;
}

.tables-and-occupancy-page__stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #2d241e;
    line-height: 1;
    font-family: 'Poppins', system-ui, sans-serif;
}

.tables-and-occupancy-page__stat-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7d7065;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.tables-and-occupancy-page__stat-sub {
    font-size: 13px;
    font-weight: 700;
    color: #7d7065;
}

.tables-and-occupancy-page__stat-card--free .tables-and-occupancy-page__stat-value {
    color: #16a34a;
}

.tables-and-occupancy-page__stat-card--occupied .tables-and-occupancy-page__stat-value {
    color: #dc2626;
}

@media (max-width: 640px) {
    .tables-and-occupancy-page__grid {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    }
    .tables-and-occupancy-page__stats {
        grid-template-columns: 1fr;
    }
}
</style>
