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
import PanelItemCard from './PanelItemCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();
</script>
