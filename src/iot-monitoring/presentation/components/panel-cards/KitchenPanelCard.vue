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
import { computed } from 'vue';
import PanelItemCard from './PanelItemCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();

const progress = computed(() => {
  const val = store.averageKitchenTemperature;
  if (val === null) return 0;
  const percent = ((val - 15) / (30 - 15)) * 100;
  return Math.max(0, Math.min(100, percent));
});
</script>
