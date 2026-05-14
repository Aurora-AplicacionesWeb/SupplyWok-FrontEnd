<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { iotStore } from '../../application/iot-store.js';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const store = iotStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const selectedAlert = ref(null);
const isDetailsVisible = computed({
    get: () => /\/iot\/alerts\/\d+\/view$/.test(route.path),
    set: (visible) => {
        if (!visible && /\/iot\/alerts\/\d+\/view$/.test(route.path)) {
            router.push('/iot/alerts');
        }
    }
});

const filters = ref({
    global: { value: null },
    severity: { value: null }
});

const severityOptions = computed(() => [
    { label: t('iot.alerts.severity-critical'), value: 'Critical' },
    { label: t('iot.alerts.severity-high'), value: 'High' },
    { label: t('iot.alerts.severity-medium'), value: 'Medium' },
    { label: t('iot.alerts.severity-low'), value: 'Low' }
]);

const getSeverityClass = (severity) => {
    switch (severity) {
        case 'Critical': return 'severity-critical';
        case 'High': return 'severity-high';
        case 'Medium': return 'severity-medium';
        case 'Low': return 'severity-low';
        default: return '';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'Open': return t('iot.alerts-page.table.status.open');
        case 'Resolved': return t('iot.alerts-page.table.status.resolved');
        case 'Acknowledged': return t('iot.alerts-page.table.status.acknowledged');
        default: return status;
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Open': return 'warn';
        case 'Resolved': return 'success';
        case 'Acknowledged': return 'info';
        default: return 'secondary';
    }
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const openDetails = (alert) => {
    router.push(`/iot/alerts/${alert.id}/view`);
};

const acknowledgeAlert = (id) => {
    store.acknowledgeAlert(id);
    if (selectedAlert.value && selectedAlert.value.id === id) {
        isDetailsVisible.value = false;
    }
};

onMounted(() => {
    store.loadSensors();
});

watch(
    [() => route.path, () => store.allAlerts],
    () => {
        const match = route.path.match(/^\/iot\/alerts\/(\d+)\/view$/);
        if (!match) {
            selectedAlert.value = null;
            return;
        }
        const id = Number(match[1]);
        const alert = store.allAlerts.find((item) => Number(item.id) === id);
        if (alert) {
            selectedAlert.value = alert;
        } else if (store.allAlerts.length > 0) {
            router.push('/iot/alerts');
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="alerts-page">
        <header class="alerts-header">
            <span class="alerts-header__kicker">{{ t('iot.alerts-page.kicker') }}</span>
            <h1 class="alerts-header__title">{{ t('iot.alerts-page.title') }}</h1>
            <p class="alerts-header__description">{{ t('iot.alerts-page.description') }}</p>
        </header>

        <div class="alerts-filters card">
            <div class="filter-group">
                <label>{{ t('iot.alerts-page.search-label') }}</label>
                <pv-icon-field iconPosition="left">
                    <pv-input-icon class="pi pi-search" />
                    <pv-input-text v-model="filters['global'].value" :placeholder="t('iot.alerts-page.search-placeholder')" class="w-full" />
                </pv-icon-field>
            </div>
            <div class="filter-group">
                <label>{{ t('iot.alerts-page.severity-label') }}</label>
                <pv-select v-model="filters['severity'].value" :options="severityOptions" optionLabel="label" optionValue="value" :placeholder="t('iot.alerts-page.severity-placeholder')" showClear class="w-full" />
            </div>
        </div>

        <div class="alerts-table-container card">
            <pv-datatable 
                :value="store.allAlerts" 
                :filters="filters" 
                paginator 
                :rows="10" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                :currentPageReportTemplate="t('iot.alerts-page.table.footer', { first: '{first}', last: '{last}', total: '{totalRecords}' })"
                responsiveLayout="scroll"
                class="p-datatable-sm">
                
                <pv-column field="severity" :header="t('iot.alerts-page.table.columns.severity')" sortable>
                    <template #body="slotProps">
                        <div class="severity-cell">
                            <span class="severity-dot" :class="getSeverityClass(slotProps.data.severity)"></span>
                            <span class="severity-text">{{ t(`iot.alerts.severity-${slotProps.data.severity.toLowerCase()}`) }}</span>
                        </div>
                    </template>
                </pv-column>

                <pv-column field="title" :header="t('iot.alerts-page.table.columns.detail')">
                    <template #body="slotProps">
                        <div class="detail-cell">
                            <div class="detail-title">{{ t(slotProps.data.titleKey) }}</div>
                            <div class="detail-subtitle">{{ t(slotProps.data.messageKey, slotProps.data.messageParams) }}</div>
                        </div>
                    </template>
                </pv-column>

                <pv-column field="source" :header="t('iot.alerts-page.table.columns.source')" sortable></pv-column>

                <pv-column field="timestamp" :header="t('iot.alerts-page.table.columns.date')" sortable>
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.timestamp) }}
                    </template>
                </pv-column>

                <pv-column field="status" :header="t('iot.alerts-page.table.columns.status')" sortable>
                    <template #body="slotProps">
                        <pv-tag :value="getStatusLabel(slotProps.data.status)" :severity="getStatusSeverity(slotProps.data.status)" />
                    </template>
                </pv-column>

                <pv-column :header="t('iot.alerts-page.table.columns.actions')">
                    <template #body="slotProps">
                        <div class="actions-cell">
                            <button class="action-link" @click="openDetails(slotProps.data)">{{ t('iot.alerts-page.table.actions.view-details') }}</button>
                            <button v-if="slotProps.data.status === 'Open'" class="action-link" @click="acknowledgeAlert(slotProps.data.id)">{{ t('iot.alerts-page.table.actions.acknowledge') }}</button>
                        </div>
                    </template>
                </pv-column>
            </pv-datatable>
        </div>

        <!-- View Details Popup -->
        <pv-dialog v-model:visible="isDetailsVisible" modal :header="t('iot.alerts-page.dialog.header')" :style="{ width: '450px' }" class="alert-details-dialog">
            <div v-if="selectedAlert" class="details-content">
                <div class="details-header">
                    <div class="severity-indicator">
                        <span class="severity-dot" :class="getSeverityClass(selectedAlert.severity)"></span>
                        <span class="severity-text">{{ t(`iot.alerts.severity-${selectedAlert.severity.toLowerCase()}`) }}</span>
                    </div>
                    <pv-tag :value="getStatusLabel(selectedAlert.status)" :severity="getStatusSeverity(selectedAlert.status)" />
                </div>

                <div class="details-body">
                    <h2 class="alert-title">{{ t(selectedAlert.titleKey) }}</h2>
                    <p class="alert-message">{{ t(selectedAlert.messageKey, selectedAlert.messageParams) }}</p>

                    <div class="meta-info">
                        <div class="meta-item">
                            <span class="meta-label">{{ t('iot.alerts-page.dialog.meta.source') }}:</span>
                            <span class="meta-value">{{ selectedAlert.source }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">{{ t('iot.alerts-page.dialog.meta.date') }}:</span>
                            <span class="meta-value">{{ formatDate(selectedAlert.timestamp) }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">{{ t('iot.alerts-page.dialog.meta.sensor-id') }}:</span>
                            <span class="meta-value">{{ selectedAlert.sensorId }}</span>
                        </div>
                    </div>
                </div>

                <div class="details-footer">
                    <pv-button :label="t('iot.alerts-page.dialog.actions.close')" text @click="isDetailsVisible = false" />
                    <pv-button v-if="selectedAlert.status === 'Open'" :label="t('iot.alerts-page.dialog.actions.acknowledge')" @click="acknowledgeAlert(selectedAlert.id)" />
                </div>
            </div>
        </pv-dialog>
    </div>
</template>

<style scoped>
.alerts-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.alerts-header__kicker {
    color: #b56a16;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.alerts-header__title {
    margin: 8px 0 4px;
    font-size: 32px;
    font-weight: 700;
    color: #2f241d;
}

.alerts-header__description {
    margin: 0;
    color: #7f7064;
    font-size: 16px;
}

.card {
    background: #ffffff;
    padding: 24px;
    border-radius: 18px;
    box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.alerts-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-group label {
    font-weight: 600;
    color: #2f241d;
}

.severity-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.severity-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.severity-critical { background-color: #8b0000; }
.severity-high { background-color: #d32f2f; }
.severity-medium { background-color: #ff9800; }
.severity-low { background-color: #4caf50; }

.detail-cell {
    display: flex;
    flex-direction: column;
}

.detail-title {
    font-weight: 700;
    color: #2f241d;
}

.detail-subtitle {
    font-size: 12px;
    color: #7f7064;
}

.actions-cell {
    display: flex;
    gap: 16px;
}

.action-link {
    background: none;
    border: none;
    color: #c0392b;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    text-transform: uppercase;
}

.action-link:hover {
    text-decoration: underline;
}

:deep(.p-datatable-header) {
    background: transparent;
    border: none;
    padding: 0;
}

:deep(.p-datatable-thead > tr > th) {
    background: #fdfaf6;
    color: #7f7064;
    font-size: 12px;
    font-weight: 700;
    padding: 16px;
    border-bottom: 2px solid #efe6da;
}

:deep(.p-tag) {
    border-radius: 8px;
    padding: 4px 12px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10px;
}

.alert-details-dialog :deep(.p-dialog-header) {
    border-bottom: 1px solid #efe6da;
    padding: 1.5rem;
}

.details-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 1rem;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.details-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.alert-title {
    margin: 0;
    font-size: 1.25rem;
    color: #2f241d;
}

.alert-message {
    margin: 0;
    color: #7f7064;
    line-height: 1.5;
}

.meta-info {
    margin-top: 1rem;
    padding: 1rem;
    background: #fdfaf6;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
}

.meta-label {
    color: #7f7064;
    font-weight: 600;
}

.meta-value {
    color: #2f241d;
}

.details-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .alerts-filters {
        grid-template-columns: 1fr;
    }
}
</style>
