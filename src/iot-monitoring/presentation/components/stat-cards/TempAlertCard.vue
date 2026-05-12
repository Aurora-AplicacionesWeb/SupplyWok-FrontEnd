<template>
  <IotStatCard
    iconSrc="/images/icons/iot/iot-temp-alert-icon.svg"
    :value="store.outOfRangeTemperatureCount"
    label="iot.stat-cards.temp-alerts"
    :badgeLabel="store.outOfRangeTemperatureCount > 0 ? 'iot.stat-cards.alert' : ''"
    badgeSeverity="alert"
    :showBadge="store.outOfRangeTemperatureCount > 0"
  />
</template>

<script setup>
import IotStatCard from './IotStatCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();
</script>
