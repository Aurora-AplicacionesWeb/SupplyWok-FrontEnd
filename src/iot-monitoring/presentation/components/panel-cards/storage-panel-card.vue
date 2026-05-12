<template>
  <PanelItemCard
    iconSrc="/images/icons/iot/iot-storage-icon.svg"
    title="iot.panel.cold-storage"
    :value="store.averageStorageTemperature"
    unit="°C"
    :progressPercent="progress"
    subtitle="iot.panel.optimal-range"
    :subtitleParams="{ min: 2, max: 8 }"
    valueColor="#2980b9"
  />
</template>

<script setup>
/**
 * Panel item specifically for Cold Storage temperature monitoring.
 * Maps the average storage temperature to a progress percentage.
 */
import { computed } from 'vue';
import PanelItemCard from './panel-item-card.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();

/** 
 * Computes progress based on cold storage temperature range (0°C - 15°C).
 * @returns {number} 0-100 percentage.
 */
const progress = computed(() => {
  const val = store.averageStorageTemperature;
  if (val === null) return 0;
  const percent = ((val - 0) / (15 - 0)) * 100;
  return Math.max(0, Math.min(100, percent));
});
</script>
