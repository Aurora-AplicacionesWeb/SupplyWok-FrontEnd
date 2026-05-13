<template>
  <div class="stat-card">
    <div class="card-header">
      <img :src="iconSrc" alt="sensor icon" class="card-icon" />
      <span
        v-if="showBadge && badgeLabel"
        class="card-badge"
        :class="'badge--' + badgeSeverity"
      >
        {{ $t(badgeLabel) }}
      </span>
    </div>

    <div class="card-value">{{ displayValue }}</div>
    <div class="card-label">{{ $t(label) }}</div>
  </div>
</template>

<script setup>
/**
 * Generic Stat Card for displaying simple IoT metrics.
 * Supports an icon, a large value, a localized label, and an optional status badge.
 */
import { computed } from 'vue';

const props = defineProps({
  /** Source path for the card's icon. */
  iconSrc: {
    type: String,
    required: true
  },
  /** The numerical or string value to display. */
  value: {
    type: [Number, String],
    default: null
  },
  /** i18n key for the label below the value. */
  label: {
    type: String,
    required: true
  },
  /** i18n key for the badge text. */
  badgeLabel: {
    type: String,
    default: ''
  },
  /** Visual style of the badge ('urgent', 'alert', 'ok', 'info'). */
  badgeSeverity: {
    type: String,
    default: 'info'
  },
  /** Whether to show the badge even if label is present. */
  showBadge: {
    type: Boolean,
    default: true
  }
});

const displayValue = computed(() => {
  return props.value !== null && props.value !== undefined ? String(props.value) : '—';
});
</script>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-width: 130px;
}

/* Header row: icon + badge */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* Badge */
.card-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.badge--urgent {
  background-color: #fdecea;
  color: #c0392b;
}

.badge--alert {
  background-color: #e8f4fd;
  color: #2980b9;
}

.badge--ok {
  background-color: #eafaf1;
  color: #1e8449;
}

.badge--info {
  background-color: #f4f4f4;
  color: #555;
}

/* Value */
.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

/* Label */
.card-label {
  font-size: 10px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
