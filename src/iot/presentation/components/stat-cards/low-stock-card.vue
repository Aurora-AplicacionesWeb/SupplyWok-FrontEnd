<template>
  <IotStatCard
    iconSrc="/images/icons/iot/iot-low-stock-icon.svg"
    :value="store.lowStockStorageCount"
    label="iot.stat-cards.low-stock-items"
    :badgeLabel="store.lowStockStorageCount > 0 ? 'iot.stat-cards.urgent' : ''"
    badgeSeverity="urgent"
    :showBadge="store.lowStockStorageCount > 0"
  />
</template>

<script setup>
/**
 * Specialized Stat Card for displaying items with low stock.
 * Shows an urgent badge if any item is below its minimum threshold.
 */
import IotStatCard from './iot-stat-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();
</script>
