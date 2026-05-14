<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  table: { type: Object, required: true }
});

const { t } = useI18n();

const isFree = computed(() => props.table.state === 'available');
const isOccupied = computed(() => props.table.state === 'busy');

const stateLabel = computed(() => {
  if (isFree.value) return t('restaurantManagement.tablesAndOccupancyPage.free');
  if (isOccupied.value) return t('restaurantManagement.tablesAndOccupancyPage.occupied');
  return props.table.state;
});

const cardStyle = computed(() => ({
  borderColor: isFree.value ? '#bbf7d0' : isOccupied.value ? '#fecaca' : '#f0e8dd',
  backgroundColor: isOccupied.value ? '#fef2f2' : '#fff'
}));

const dotColor = computed(() => isFree.value ? '#16a34a' : isOccupied.value ? '#dc2626' : '#d1d5db');

const stateStyle = computed(() => ({
  color: isFree.value ? '#16a34a' : isOccupied.value ? '#dc2626' : '#6b7280',
  backgroundColor: isFree.value ? 'rgba(22,163,74,0.25)' : isOccupied.value ? 'rgba(220,38,38,0.25)' : 'rgba(107,114,128,0.15)'
}));
</script>

<template>
  <article
      class="flex align-items-center gap-1 bg-white border-round shadow-1 border-2 p-3 relative overflow-hidden"
      :style="{ width: '200px', minHeight: '80px', borderRadius: '18px', ...cardStyle }"
  >
    <div class="border-circle" :style="{ width: '8px', height: '8px', backgroundColor: dotColor, flexShrink: 0 }" />
    <div class="flex flex-column flex-1" :style="{ gap: '2px' }">
      <strong class="flex align-items-center gap-1 font-heading" :style="{ color: '#40342d', fontSize: '18px' }">
        <i class="pi pi-table" :style="{ fontSize: '14px', color: '#7d7065' }" />
        {{ table.code ||String(table.number).padStart(2, '0') }}
      </strong>
      <span class="flex align-items-center gap-1" :style="{ fontSize: '12px', color: '#8e8177' }">
                <i class="pi pi-users" /> {{ table.capacity }}
            </span>
      <span
          class="inline-block font-bold uppercase border-round px-2 py-1"
          :style="{ fontSize: '11px', letterSpacing: '0.05em', ...stateStyle }"
      >
                {{ stateLabel }}
            </span>
    </div>
  </article>
</template>

<style scoped>
.font-heading {
  font-family: 'Poppins', system-ui, sans-serif;
}
</style>
