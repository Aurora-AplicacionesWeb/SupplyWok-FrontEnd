<template>
  <div class="header-alerts-wrapper">
    <!-- Icono de notificaciones -->
    <div class="notification-icon" @click="togglePanel">
      <img src="/images/icons/alerts-icon.svg" alt="Alerts" />
      <span v-if="store.topCriticalAlerts.length > 0" class="badge">
        {{ store.topCriticalAlerts.length }}
      </span>
    </div>

    <!-- Panel de notificaciones -->
    <div v-if="isOpen" class="alerts-popup-panel" @click.self="togglePanel">
      <div class="alerts-popup-header">
        <h4>{{ $t('iot.alerts.notifications') }}</h4>
        <button class="close-btn" @click="togglePanel">&times;</button>
      </div>
      <div class="alerts-popup-body">
        <div v-if="store.topCriticalAlerts.length === 0" class="empty-state">
          {{ $t('iot.alerts.no-active-alerts') }}
        </div>
        <AlertItem 
          v-for="alert in store.topCriticalAlerts" 
          :key="alert.id"
          :alert="alert"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Dropdown/Popup component for displaying critical IoT alerts in the application header.
 * Provides a notification icon with a badge and a scrollable list of recent alerts.
 */
import { ref } from 'vue';
import AlertItem from './alert-item.vue';
import { iotStore } from '../../../application/iot-store.js';

const store = iotStore();

/** Controls the visibility of the alerts popup. */
const isOpen = ref(false);

/** Toggles the popup panel open/closed. */
const togglePanel = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.header-alerts-wrapper {
  position: relative;
  display: inline-block;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  padding: 8px;
}

.notification-icon img {
  width: 24px;
  height: 24px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
}

.alerts-popup-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  margin-top: 10px;
}

.alerts-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.alerts-popup-header h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}

.alerts-popup-body {
  padding: 8px 16px;
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  padding: 16px 0;
  text-align: center;
  color: #888;
  font-size: 13px;
}
</style>
