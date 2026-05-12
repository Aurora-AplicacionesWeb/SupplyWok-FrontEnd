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
import IotStatCard from './IotStatCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();
</script>
