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
import { computed } from 'vue';
import PanelItemCard from './PanelItemCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();

const progress = computed(() => {
  const val = store.averageStorageTemperature;
  if (val === null) return 0;
  const percent = ((val - 0) / (15 - 0)) * 100;
  return Math.max(0, Math.min(100, percent));
});
</script>
