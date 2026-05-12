<template>
  <IotStatCard
    iconSrc="/images/icons/iot/iot-dining-icon.svg"
    :value="store.occupiedTablePercentage"
    label="iot.stat-cards.active-tables"
  />
</template>

<script setup>
import IotStatCard from './IotStatCard.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();
</script>
