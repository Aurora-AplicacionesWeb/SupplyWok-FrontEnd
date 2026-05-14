<template>
  <div class="alert-item">
    <div class="alert-content">
      <div class="alert-title">{{ alert.titleKey ? $t(alert.titleKey, alert.messageParams) : alert.title }}</div>
      <div class="alert-message">{{ alert.messageKey ? $t(alert.messageKey, alert.messageParams) : alert.message }}</div>
    </div>
    <div class="alert-meta">
      <span class="alert-badge" :class="'badge-' + alert.severity.toLowerCase()">
        {{ $t('iot.alerts.severity-' + alert.severity.toLowerCase()) }}
      </span>
      <span class="alert-time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Individual alert row component.
 * Displays the alert title, message, severity badge, and relative time.
 */
import { computed } from 'vue';

const props = defineProps({
  /** The Alert entity instance to display. */
  alert: {
    type: Object,
    required: true
  }
});

/** Formats the alert timestamp to HH:mm. */
const formattedTime = computed(() => {
  if (!props.alert?.timestamp) return '';
  const date = new Date(props.alert.timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});
</script>

<style scoped>
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-content {
  flex: 1;
  padding-right: 16px;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: #3b4256;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 13px;
  color: #737373;
  line-height: 1.4;
}

.alert-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 80px;
}

.alert-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

.badge-critical {
  background-color: #f15252;
}

.badge-warning {
  background-color: #f58a22;
}

.badge-normal {
  background-color: #22c55e;
}

.alert-time {
  font-size: 12px;
  color: #888888;
}
</style>
