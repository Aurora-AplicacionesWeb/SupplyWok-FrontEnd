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
/**
 * Specialized Stat Card for displaying active temperature alerts.
 * Shows an alert badge if any temperature sensor is out of its optimal range.
 */
import IotStatCard from './iot-stat-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();
</script>
