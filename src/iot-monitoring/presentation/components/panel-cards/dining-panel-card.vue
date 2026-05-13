<template>
  <PanelItemCard
    iconSrc="/images/icons/iot/iot-dining-icon.svg"
    title="iot.panel.dining-room"
    :value="store.occupiedTablePercentage"
    unit="%"
    :progressPercent="store.occupiedTablePercentage || 0"
    subtitle="iot.panel.occupancy-rate"
  />
</template>

<script setup>
/**
 * Panel item specifically for Dining Room occupancy monitoring.
 * Displays the current table occupancy percentage.
 */
import PanelItemCard from './panel-item-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();
</script>
