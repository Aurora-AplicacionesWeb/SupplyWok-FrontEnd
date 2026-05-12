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
</script>

<template>
    <article
        class="table-card"
        :class="{
            'table-card--free': isFree,
            'table-card--occupied': isOccupied
        }"
    >
        <div class="table-card__indicator" />
        <div class="table-card__body">
            <strong class="table-card__number">
                <i class="pi pi-table" />
                {{ table.code || `T-${String(table.number).padStart(2, '0')}` }}
            </strong>
            <span class="table-card__capacity">
                <i class="pi pi-users" /> {{ table.capacity }}
            </span>
            <span class="table-card__state">{{ stateLabel }}</span>
        </div>
    </article>
</template>

<style scoped>
.table-card {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(45, 36, 30, 0.06);
    border: 2px solid #f0e8dd;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    width: 200px;
    min-height: 80px;
    box-sizing: border-box;
}

.table-card--free {
    border-color: #bbf7d0;
}

.table-card--free:hover {
    border-color: #16a34a;
    box-shadow: 0 8px 24px rgba(22, 163, 74, 0.12);
}

.table-card--occupied {
    border-color: #fecaca;
    background: #fef2f2;
}

.table-card--occupied:hover {
    border-color: #dc2626;
}

.table-card__indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.table-card--free .table-card__indicator {
    background: #16a34a;
}

.table-card--occupied .table-card__indicator {
    background: #dc2626;
}

.table-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.table-card__number {
    color: #40342d;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Poppins', system-ui, sans-serif;
}

.table-card__number i {
    font-size: 14px;
    color: #7d7065;
}

.table-card__capacity {
    font-size: 12px;
    color: #8e8177;
    display: flex;
    align-items: center;
    gap: 4px;
}

.table-card__state {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: 6px;
    display: inline-block;
}

.table-card--free .table-card__state {
    color: #16a34a;
    background: rgba(22, 163, 74, 0.25);
}

.table-card--occupied .table-card__state {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.25);
}

.table-card__action {
    flex-shrink: 0;
}
</style>
