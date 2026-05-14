<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import useSupplierManagementStore from '../../application/supply-management.store.js';

const { t } = useI18n();
const store = useSupplierManagementStore();
const { supplierSubscription, supplierSubscriptionLoaded } = storeToRefs(store);
const { fetchSupplierSubscription } = store;

const summaryIconByKey = {
    'current-plan': 'pi-briefcase',
    users: 'pi-users',
    locations: 'pi-map-marker',
    sensors: 'pi-bolt'
};

const planCards = computed(() => supplierSubscription.value?.summary ?? []);
const plans = computed(() => supplierSubscription.value?.plans ?? []);

function getSummaryIcon(key) {
    return summaryIconByKey[key] ?? 'pi-info-circle';
}

function getSummaryLabel(key) {
    return t(`supplier-management.subscription.summary.${key}.label`);
}

onMounted(() => {
    if (!supplierSubscriptionLoaded.value) {
        fetchSupplierSubscription();
    }
});
</script>

<template>
    <section class="subscription-page">
        <header class="subscription-page__header">
            <p class="subscription-page__eyebrow">{{ t('supplier-management.subscription.breadcrumb') }}</p>
            <h1 class="subscription-page__title">{{ t('supplier-management.subscription.title') }}</h1>
            <p class="subscription-page__subtitle">{{ t('supplier-management.subscription.subtitle') }}</p>
        </header>

        <section class="subscription-page__summary">
            <article v-for="card in planCards" :key="card.key" class="summary-card">
                <i class="pi summary-card__icon" :class="getSummaryIcon(card.key)"></i>
                <div>
                    <p class="summary-card__label">{{ getSummaryLabel(card.key) }}</p>
                    <h2 class="summary-card__value">{{ card.value }}</h2>
                </div>
            </article>
        </section>

        <section class="subscription-page__plans">
            <article v-for="plan in plans" :key="plan.id" class="plan-card" :class="{ 'plan-card--active': plan.isActive }">
                <div class="plan-card__head">
                    <h3>{{ plan.name }}</h3>
                    <span v-if="plan.isActive" class="plan-card__badge">{{ t('supplier-management.subscription.active') }}</span>
                </div>
                <p class="plan-card__price">{{ plan.price }}</p>
                <ul class="plan-card__features">
                    <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped>
.subscription-page {
    color: #2d241e;
}

.subscription-page__header {
    margin-bottom: 20px;
}

.subscription-page__eyebrow {
    margin: 0 0 8px;
    color: #b0762a;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.subscription-page__title {
    margin: 0;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 48px;
    line-height: 1;
}

.subscription-page__subtitle {
    margin: 10px 0 0;
    color: #6f665d;
    font-size: 14px;
}

.subscription-page__summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
}

.summary-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid #efe4d4;
    border-radius: 14px;
    background: #fffdf9;
    box-shadow: 0 16px 34px rgba(58, 42, 20, 0.08);
}

.summary-card__icon {
    margin-top: 2px;
    color: #b07b2b;
}

.summary-card__label {
    margin: 0;
    color: #6f665d;
    font-size: 13px;
}

.summary-card__value {
    margin: 6px 0 0;
    font-size: 24px;
    color: #201812;
}

.subscription-page__plans {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.plan-card {
    min-height: 260px;
    padding: 18px;
    border: 1px solid #efe4d4;
    border-radius: 16px;
    background: #fffdf9;
    box-shadow: 0 16px 34px rgba(58, 42, 20, 0.08);
}

.plan-card--active {
    border-color: #f0cb79;
}

.plan-card__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.plan-card__head h3 {
    margin: 0;
    font-size: 38px;
    line-height: 1;
}

.plan-card__badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: #26b55f;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
}

.plan-card__price {
    margin: 10px 0 14px;
    color: #4e4a46;
}

.plan-card__features {
    margin: 0;
    padding-left: 20px;
    color: #3f3a35;
    line-height: 1.45;
}

@media (max-width: 1120px) {
    .subscription-page__summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 900px) {
    .subscription-page__title,
    .plan-card__head h3 {
        font-size: 34px;
    }

    .subscription-page__summary,
    .subscription-page__plans {
        grid-template-columns: 1fr;
    }
}
</style>
