<template>
  <IotStatCard
    iconSrc="/images/icons/iot/iot-dining-icon.svg"
    :value="store.occupiedTablePercentage"
    label="iot.stat-cards.active-tables"
  />
</template>

<script setup>
/**
 * Specialized Stat Card for displaying the number of active/occupied tables.
 */
import IotStatCard from './iot-stat-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();
</script>
