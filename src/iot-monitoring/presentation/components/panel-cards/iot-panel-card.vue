<template>
  <div class="iot-panel-card">
    <div class="panel-header-section">
      <div class="panel-title-container">
        <img src="/images/icons/iot/iot-panel-icon.svg" alt="panel icon" class="panel-icon" />
        <h2 class="panel-title">{{ $t('iot.panel.title') }}</h2>
      </div>
      <p class="panel-description">
        {{ $t('iot.panel.description') }}
      </p>
    </div>

    <div class="panel-content">
      <KitchenPanelCard class="panel-item" />
      <StoragePanelCard class="panel-item" />
      <DiningPanelCard class="panel-item" />
    </div>

    <IotPanelAlerts />
  </div>
</template>

<script setup>
/**
 * Main IoT Dashboard Panel.
 * Aggregates specific area panels (Kitchen, Storage, Dining) and the live alerts feed.
 */
import KitchenPanelCard from './kitchen-panel-card.vue';
import StoragePanelCard from './storage-panel-card.vue';
import DiningPanelCard from './dining-panel-card.vue';
import IotPanelAlerts from '../alerts/iot-panel-alerts.vue';
</script>

<style scoped>
.iot-panel-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
}

.panel-header-section {
  padding: 24px 24px 20px 24px;
  border-bottom: 1px solid #f5f5f5;
}

.panel-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.panel-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.panel-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #3b4256;
}

.panel-description {
  margin: 0;
  font-size: 14px;
  color: #888888;
  line-height: 1.5;
}

.panel-content {
  display: flex;
  gap: 16px;
  padding: 24px;
  background-color: #fafafa;
  overflow-x: auto;
}

.panel-item {
  flex: 1;
  min-width: 0; /* Prevents flex items from overflowing their container */
}
</style>
