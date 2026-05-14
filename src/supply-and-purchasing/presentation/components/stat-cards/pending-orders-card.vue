<template>
  <IotStatCard
    iconSrc="/images/icons/orders-icon.svg"
    :value="pendingCount"
    label="supplyAndPurchasing.dashboard.pendingOrders.label"
  />
</template>

<script setup>
import { computed } from 'vue';
import IotStatCard from '../../../../iot-monitoring/presentation/components/stat-cards/iot-stat-card.vue';
import usePurchaseOrderStore from '../../../application/purchase-order.store.js';

const store = usePurchaseOrderStore();

const pendingCount = computed(() => store.pendingPurchaseOrdersCount);
</script>
