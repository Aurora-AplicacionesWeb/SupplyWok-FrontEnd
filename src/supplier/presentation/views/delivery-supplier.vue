<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import useSupplierManagementStore from '../../application/supply-management.store.js';

const { t } = useI18n();
const store = useSupplierManagementStore();
const { deliveryRoutes, deliveryRoutesLoaded } = storeToRefs(store);
const { fetchDeliveryRoutes } = store;

const dateFilter = ref('all');
const statusFilter = ref('all');

const dateOptions = computed(() => {
    const dates = new Set(deliveryRoutes.value.map(route => route.date).filter(Boolean));
    return ['all', ...Array.from(dates).sort()];
});

const statusOptions = computed(() => [
    { label: t('supplier-management.delivery.filters.all-statuses'), value: 'all' },
    { label: t('supplier-management.delivery.status.planned'), value: 'planned' },
    { label: t('supplier-management.delivery.status.in-progress'), value: 'in-progress' },
    { label: t('supplier-management.delivery.status.completed'), value: 'completed' }
]);

const filteredRoutes = computed(() => deliveryRoutes.value.filter(route => {
    const matchesDate = dateFilter.value === 'all' || route.date === dateFilter.value;
    const matchesStatus = statusFilter.value === 'all' || route.status === statusFilter.value;
    return matchesDate && matchesStatus;
}));

const routeSummary = computed(() => {
    const totalRoutes = filteredRoutes.value.length;
    const totalStops = filteredRoutes.value.reduce((sum, route) => sum + Number(route.totalStops ?? 0), 0);
    const totalOrders = filteredRoutes.value.reduce((sum, route) => sum + Number(route.totalOrders ?? 0), 0);
    return { totalRoutes, totalStops, totalOrders };
});

function formatStatus(status) {
    return t(`supplier-management.delivery.status.${status}`);
}

function formatDate(date) {
    return date || '-';
}

function formatStopLabel(stop) {
    const ordersCount = Number(stop.ordersCount ?? 0);
    return t('supplier-management.delivery.stop-orders', { count: ordersCount });
}

onMounted(() => {
    if (!deliveryRoutesLoaded.value) {
        fetchDeliveryRoutes();
    }
});
</script>

<template>
    <section class="delivery-page">
        <header class="delivery-page__header">
            <p class="delivery-page__eyebrow">{{ t('supplier-management.delivery.breadcrumb') }}</p>
            <h1 class="delivery-page__title">{{ t('supplier-management.delivery.title') }}</h1>
            <p class="delivery-page__subtitle">{{ t('supplier-management.delivery.subtitle') }}</p>
        </header>

        <section class="delivery-page__filters">
            <label class="delivery-page__filter-field">
                <span>{{ t('supplier-management.delivery.filters.date') }}</span>
                <select v-model="dateFilter">
                    <option value="all">{{ t('supplier-management.delivery.filters.all-dates') }}</option>
                    <option v-for="date in dateOptions.filter(value => value !== 'all')" :key="date" :value="date">
                        {{ formatDate(date) }}
                    </option>
                </select>
            </label>
            <label class="delivery-page__filter-field">
                <span>{{ t('supplier-management.delivery.filters.status') }}</span>
                <select v-model="statusFilter">
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </label>
        </section>

        <section class="delivery-page__stats">
            <article class="delivery-page__stat-card">
                <span>{{ t('supplier-management.delivery.stats.routes') }}</span>
                <strong>{{ routeSummary.totalRoutes }}</strong>
            </article>
            <article class="delivery-page__stat-card">
                <span>{{ t('supplier-management.delivery.stats.stops') }}</span>
                <strong>{{ routeSummary.totalStops }}</strong>
            </article>
            <article class="delivery-page__stat-card">
                <span>{{ t('supplier-management.delivery.stats.orders') }}</span>
                <strong>{{ routeSummary.totalOrders }}</strong>
            </article>
        </section>

        <p v-if="deliveryRoutesLoaded && !filteredRoutes.length" class="delivery-page__empty">
            {{ t('supplier-management.delivery.empty') }}
        </p>

        <section v-else class="delivery-page__routes">
            <article v-for="route in filteredRoutes" :key="route.id" class="route-card">
                <header class="route-card__header">
                    <div>
                        <h2 class="route-card__title">{{ route.routeName }}</h2>
                        <p class="route-card__meta">
                            {{ route.supplierName }} · {{ route.vehicle }} · {{ route.estimatedDeparture }} - {{ route.estimatedArrival }}
                        </p>
                    </div>
                    <span class="route-card__status">{{ formatStatus(route.status) }}</span>
                </header>

                <ul class="route-card__stops">
                    <li v-for="stop in route.stops" :key="`${route.id}-${stop.sequence}-${stop.restaurantName}`" class="route-card__stop">
                        <div class="route-card__sequence">{{ stop.sequence }}</div>
                        <div class="route-card__stop-content">
                            <strong>{{ stop.restaurantName }}</strong>
                            <span>{{ stop.district }} · {{ stop.estimatedArrival }}</span>
                        </div>
                        <span class="route-card__stop-orders">{{ formatStopLabel(stop) }}</span>
                    </li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped>
.delivery-page {
    min-height: 100%;
    color: #2d241e;
    font-family: 'Montserrat', system-ui, sans-serif;
}

.delivery-page__header {
    margin-bottom: 20px;
}

.delivery-page__eyebrow {
    margin: 0 0 8px;
    color: #b0762a;
    font-size: 11px;
    font-weight: 800;
}

.delivery-page__title {
    margin: 0;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 30px;
    color: #241c17;
}

.delivery-page__subtitle {
    margin: 8px 0 0;
    color: #6f665d;
    font-size: 14px;
}

.delivery-page__filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.delivery-page__filter-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border: 1px solid #efe4d4;
    border-radius: 14px;
    background: #fffdf9;
}

.delivery-page__filter-field span {
    color: #312820;
    font-size: 12px;
    font-weight: 800;
}

.delivery-page__filter-field select {
    min-height: 40px;
    border: 1px solid #d8dfe8;
    border-radius: 10px;
    font: inherit;
    padding: 0 10px;
}

.delivery-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.delivery-page__stat-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    border: 1px solid #efe4d4;
    border-radius: 12px;
    background: #fffdf9;
}

.delivery-page__stat-card span {
    color: #6f665d;
    font-size: 12px;
    font-weight: 700;
}

.delivery-page__stat-card strong {
    color: #241c17;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 24px;
}

.delivery-page__routes {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
}

.route-card {
    border: 1px solid #efe4d4;
    border-radius: 12px;
    background: #fffdf9;
    padding: 16px;
}

.route-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
}

.route-card__title {
    margin: 0;
    font-size: 20px;
    font-family: 'Poppins', system-ui, sans-serif;
    color: #2d241e;
}

.route-card__meta {
    margin: 6px 0 0;
    color: #6f665d;
    font-size: 12px;
}

.route-card__status {
    border-radius: 999px;
    background: #f4e4c2;
    color: #855813;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 800;
}

.route-card__stops {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
}

.route-card__stop {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 10px;
    border: 1px solid #efe4d4;
    border-radius: 10px;
    padding: 10px;
}

.route-card__sequence {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: #2d241e;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.route-card__stop-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.route-card__stop-content strong {
    color: #2d241e;
    font-size: 14px;
}

.route-card__stop-content span {
    color: #6f665d;
    font-size: 12px;
}

.route-card__stop-orders {
    color: #8b5b13;
    font-size: 12px;
    font-weight: 700;
}

.delivery-page__empty {
    margin: 0;
    padding: 20px;
    border: 1px solid #efe4d4;
    border-radius: 12px;
    background: #fffdf9;
    color: #6f665d;
}

@media (max-width: 900px) {
    .delivery-page__filters,
    .delivery-page__stats {
        grid-template-columns: 1fr;
    }
}
</style>
