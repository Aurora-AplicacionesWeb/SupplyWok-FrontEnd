<template>
  <div class="panel-item-card">
    <div class="header">
      <img :src="iconSrc" alt="icon" class="icon" />
      <span class="title">{{ $t(title) }}</span>
    </div>

    <div class="value-container">
      <span class="value" :style="{ color: valueColor }">{{ displayValue }}</span>
      <span class="unit" :style="{ color: valueColor }">{{ unit }}</span>
    </div>

    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="subtitle">{{ $t(subtitle, subtitleParams) }}</div>
  </div>
</template>

<script setup>
/**
 * Card component used within the IoT Panel to display sensor readings with a progress bar.
 * Primarily used for temperature and occupancy metrics.
 */
import { computed } from 'vue';

const props = defineProps({
  /** Icon representing the sensor location or type. */
  iconSrc: {
    type: String,
    required: true
  },
  /** i18n key for the sensor's title. */
  title: {
    type: String,
    required: true
  },
  /** The current sensor reading value. */
  value: {
    type: Number,
    default: null
  },
  /** Unit of measurement (e.g., '°C', '%'). */
  unit: {
    type: String,
    required: true
  },
  /** Specific color for the value text. */
  valueColor: {
    type: String,
    default: ''
  },
  /** Fill percentage for the progress bar (0-100). */
  progressPercent: {
    type: Number,
    required: true
  },
  /** i18n key for the subtitle/range info. */
  subtitle: {
    type: String,
    required: true
  },
  /** Optional interpolation parameters for the subtitle translation. */
  subtitleParams: {
    type: Object,
    default: () => ({})
  }
});

const displayValue = computed(() => {
  return props.value !== null && props.value !== undefined ? String(props.value) : '—';
});
</script>

<style scoped>
.panel-item-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-width: 180px;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0.7;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  letter-spacing: 0.5px;
}

.value-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 16px;
}

.value {
  font-size: 36px;
  font-weight: 700;
  color: #2b2b2b;
  line-height: 1;
}

.unit {
  font-size: 18px;
  font-weight: 500;
  color: #888888;
}

.progress-track {
  width: 100%;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background-color: #f59e0b; /* Default orange */
  border-radius: 6px;
  transition: width 0.4s ease;
}

.subtitle {
  font-size: 11px;
  color: #888888;
}
</style>
