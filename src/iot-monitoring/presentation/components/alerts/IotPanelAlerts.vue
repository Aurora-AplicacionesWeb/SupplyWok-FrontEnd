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
import AlertItem from './AlertItem.vue';
import { useIotStore } from '../../../application/stores/useIotStore.js';

const store = useIotStore();
</script>

<style scoped>
.panel-alerts-container {
  padding: 0 24px;
  margin-top: 8px;
}
</style>
