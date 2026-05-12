<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    status: { type: String, default: '' }
});

const { t } = useI18n();

const severity = computed(() => {
    const map = {
        pending: 'warning',
        in_preparation: 'info',
        ready: 'success',
        delivered: 'secondary',
        cancelled: 'danger'
    };
    return map[props.status] || 'secondary';
});

const label = computed(() => {
    return t(`restaurantManagement.shared.status.${props.status}`) || props.status;
});

const colorMap = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    in_preparation: { bg: '#fce4ec', text: '#c21204' },
    ready: { bg: '#dcfce7', text: '#166534' },
    delivered: { bg: '#f3f4f6', text: '#6b7280' },
    cancelled: { bg: '#fce4ec', text: '#991b1b' }
};
</script>

<template>
    <span
        class="status-badge"
        :style="{ backgroundColor: colorMap[status]?.bg || '#f3f4f6', color: colorMap[status]?.text || '#4b5563' }"
    >
        {{ label }}
    </span>
</template>

<style scoped>
.status-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Montserrat', system-ui, sans-serif;
}
</style>
