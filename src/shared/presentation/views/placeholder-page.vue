<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LowStockCard from '../../../iot-monitoring/presentation/components/stat-cards/low-stock-card.vue';
import TempAlertCard from '../../../iot-monitoring/presentation/components/stat-cards/temp-alert-card.vue';
import ActiveTablesCard from '../../../iot-monitoring/presentation/components/stat-cards/active-tables-card.vue';
import IotPanelCard from '../../../iot-monitoring/presentation/components/panel-cards/iot-panel-card.vue';
import HeaderAlertsPopup from '../../../iot-monitoring/presentation/components/alerts/header-alerts-popup.vue';
import OrdersSummaryCard from '../../../supply-and-purchasing/presentation/components/orders-summary-card.vue';

const route = useRoute();
const pageTitle = computed(() => route.meta?.title ?? 'Module');
</script>

<template>
    <div v-if="route.name === 'dashboard'" class="iot-dashboard-layout">
        <div class="dashboard-header">
            <h2>Kitchen Dashboard</h2>
            <p>Real-time supply chain and floor monitoring.</p>
        </div>
        
        <div class="stat-cards-row">
            <LowStockCard />
            <TempAlertCard />
            <ActiveTablesCard />
        </div>

        <div class="dashboard-grid">
            <IotPanelCard class="grid-item-tl" />
            <div class="placeholder-box grid-item-tr"></div>
            <div class="placeholder-box grid-item-bl"></div>
            <OrdersSummaryCard class="dashboard-orders-card grid-item-br" />
        </div>
    </div>

    <section v-else class="placeholder-page">
        <span class="placeholder-page__kicker">Frontend first version</span>
        <h1>{{ pageTitle }}</h1>
        <p>This module is reserved and can be completed in the next sprint tasks.</p>
    </section>
</template>

<style scoped>
.placeholder-page {
    padding: 20px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.placeholder-page__kicker {
    color: #b56a16;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.placeholder-page h1 {
    margin: 8px 0 0;
    color: #2f241d;
}

.placeholder-page p {
    margin: 8px 0 0;
    color: #7f7064;
}

/* IoT Layout Styles */
.iot-dashboard-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.dashboard-header h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #3b4256;
}

.dashboard-header p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #888888;
}

.stat-cards-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
}

.placeholder-box {
    background-color: #1a1a1a;
    border-radius: 20px;
    height: 300px;
    width: 100%;
    opacity: 0.1;
}

.grid-item-tl { grid-column: 1; grid-row: 1; }
.grid-item-tr { grid-column: 2; grid-row: 1; }
.grid-item-bl { grid-column: 1; grid-row: 2; }
.grid-item-br { grid-column: 2; grid-row: 2; }

.dashboard-orders-card {
    width: 100%;
}

@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    .grid-item-tl, .grid-item-tr, .grid-item-bl, .grid-item-br {
        grid-column: auto;
        grid-row: auto;
    }
}
</style>
