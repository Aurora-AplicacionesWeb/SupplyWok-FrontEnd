<template>
  <div class="panel-alerts-container">
    <AlertItem 
      v-for="alert in store.recentAlerts" 
      :key="alert.id"
      :alert="alert"
    />
  </div>
</template>

<script setup>
/**
 * Container component for the live alerts feed within the IoT Panel.
 * Renders the 3 most recent alerts using AlertItem.
 */
import AlertItem from './alert-item.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();
</script>

<style scoped>
.panel-alerts-container {
  padding: 0 24px;
  margin-top: 8px;
}
</style>
