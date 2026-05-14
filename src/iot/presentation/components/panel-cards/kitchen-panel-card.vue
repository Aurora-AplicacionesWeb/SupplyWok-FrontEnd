<template>
  <PanelItemCard
    iconSrc="/images/icons/iot/iot-kitchen-icon.svg"
    title="iot.panel.kitchen"
    :value="store.averageKitchenTemperature"
    unit="°C"
    :progressPercent="progress"
    subtitle="iot.panel.optimal-range"
    :subtitleParams="{ min: 20, max: 26 }"
  />
</template>

<script setup>
/**
 * Panel item specifically for Kitchen temperature monitoring.
 * Maps the average kitchen temperature to a progress percentage.
 */
import { computed } from 'vue';
import PanelItemCard from './panel-item-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();

/** 
 * Computes progress based on kitchen temperature range (15°C - 30°C).
 * @returns {number} 0-100 percentage.
 */
const progress = computed(() => {
  const val = store.averageKitchenTemperature;
  if (val === null) return 0;
  const percent = ((val - 15) / (30 - 15)) * 100;
  return Math.max(0, Math.min(100, percent));
});
</script>
