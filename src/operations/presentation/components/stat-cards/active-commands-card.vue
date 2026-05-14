<template>
  <IotStatCard
    iconSrc="/images/icons/kitchen-ticket-icon.svg"
    :value="activeCount"
    label="restaurantManagement.dashboard.activeCommands.label"
  />
</template>

<script setup>
import { computed } from 'vue';
import IotStatCard from '../../../../iot/presentation/components/stat-cards/iot-stat-card.vue';
import useRestaurantManagementStore from '../../../application/restaurant-management.store.js';

const store = useRestaurantManagementStore();

const activeCount = computed(() => store.activeKitchenOrders.length);
</script>
