<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const activePlan = ref('Premium');
const planUpdateMessage = ref('');

const planCatalog = [
    {
        id: 'Premium',
        name: 'Premium',
        price: '$49 / mes',
        users: 8,
        locations: 1,
        sensors: 12,
        tone: 'primary',
        features: [
            t('shared.subscriptionPage.plans.premium.features.0'),
            t('shared.subscriptionPage.plans.premium.features.1'),
            t('shared.subscriptionPage.plans.premium.features.2'),
            t('shared.subscriptionPage.plans.premium.features.3')
        ]
    },
    {
        id: 'Enterprise',
        name: 'Enterprise',
        price: '$89 / mes',
        users: 20,
        locations: 4,
        sensors: 40,
        tone: 'secondary',
        features: [
            t('shared.subscriptionPage.plans.enterprise.features.0'),
            t('shared.subscriptionPage.plans.enterprise.features.1'),
            t('shared.subscriptionPage.plans.enterprise.features.2'),
            t('shared.subscriptionPage.plans.enterprise.features.3')
        ]
    }
];

const currentPlan = computed(() => {
    return planCatalog.find((plan) => plan.id === activePlan.value) ?? planCatalog[0];
});

const currentPlanSummary = computed(() => ([
    { label: t('shared.subscriptionPage.summary.currentPlan'), value: currentPlan.value.name },
    { label: t('shared.subscriptionPage.summary.users'), value: currentPlan.value.users },
    { label: t('shared.subscriptionPage.summary.locations'), value: currentPlan.value.locations },
    { label: t('shared.subscriptionPage.summary.sensors'), value: currentPlan.value.sensors }
]));

function selectPlan(planId) {
    if (planId === activePlan.value) {
        return;
    }

    activePlan.value = planId;
    planUpdateMessage.value = t('shared.subscriptionPage.messages.switchSuccess', { plan: planId });
}
</script>

<template>
    <section class="subscription-page">
        <header class="subscription-page__hero">
            <span class="subscription-page__kicker">{{ t('shared.subscriptionPage.kicker') }}</span>
            <h1 class="subscription-page__title">{{ t('shared.subscriptionPage.title') }}</h1>
            <p class="subscription-page__description">
                {{ t('shared.subscriptionPage.description') }}
            </p>
        </header>

        <div class="subscription-page__summary">
            <article v-for="item in currentPlanSummary" :key="item.label" class="summary-card">
                <span class="summary-card__label">{{ item.label }}</span>
                <strong class="summary-card__value">{{ item.value }}</strong>
            </article>
        </div>

        <div class="subscription-page__plans">
            <article v-for="plan in planCatalog" :key="plan.id" class="plan-card" :class="`plan-card--${plan.tone}`">
                <div class="plan-card__header">
                    <div>
                        <span class="plan-card__eyebrow">{{ plan.id === activePlan.value ? t('shared.subscriptionPage.plans.eyebrowCurrent') : t('shared.subscriptionPage.plans.eyebrowAvailable') }}</span>
                        <h2>{{ plan.name }}</h2>
                    </div>
                    <span class="plan-card__price">{{ plan.price }}</span>
                </div>

                <ul class="plan-card__features">
                    <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
                </ul>

                <div class="plan-card__meta">
                    <span>{{ t('shared.subscriptionPage.plans.metaUsers', { count: plan.users }) }}</span>
                    <span>{{ t('shared.subscriptionPage.plans.metaLocations', { count: plan.locations }) }}</span>
                    <span>{{ t('shared.subscriptionPage.plans.metaSensors', { count: plan.sensors }) }}</span>
                </div>

                <button
                    type="button"
                    class="plan-card__action"
                    :disabled="plan.id === activePlan.value"
                    @click="selectPlan(plan.id)"
                >
                    {{ plan.id === activePlan.value ? t('shared.subscriptionPage.plans.actionCurrent') : t('shared.subscriptionPage.plans.actionSelect') }}
                </button>
            </article>
        </div>

        <p v-if="planUpdateMessage" class="subscription-page__message">{{ planUpdateMessage }}</p>
    </section>
</template>

<style scoped>
/* styles remain the same */
.subscription-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.subscription-page__hero {
    padding: 24px 28px;
    border-radius: 24px;
    background:
        radial-gradient(circle at top left, rgba(233, 184, 36, 0.18), transparent 30%),
        linear-gradient(135deg, #ffffff 0%, #f8f1e8 100%);
    box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.subscription-page__kicker,
.plan-card__eyebrow {
    display: inline-block;
    color: #a07832;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.subscription-page__title {
    margin: 8px 0 10px;
    color: #2f241d;
    font-size: clamp(2rem, 3vw, 2.7rem);
}

.subscription-page__description {
    color: #6e6157;
    line-height: 1.6;
}

.subscription-page__summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
}

.summary-card,
.plan-card {
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.summary-card {
    padding: 20px;
}

.summary-card__label {
    color: #8b7a6d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.summary-card__value {
    display: block;
    margin-top: 12px;
    color: #2f241d;
    font-size: 2rem;
}

.subscription-page__plans {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

.plan-card {
    padding: 22px;
    border: 1px solid transparent;
}

.plan-card--primary {
    border-color: rgba(194, 18, 4, 0.18);
}

.plan-card--secondary {
    border-color: rgba(160, 120, 50, 0.24);
}

.plan-card__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
}

.plan-card__header h2 {
    margin: 8px 0 0;
    color: #2f241d;
    font-size: 1.45rem;
}

.plan-card__price {
    color: #2f241d;
    font-size: 1.25rem;
    font-weight: 700;
}

.plan-card__features {
    display: grid;
    gap: 12px;
    margin: 20px 0;
    padding-left: 18px;
    color: #5f5146;
    line-height: 1.5;
}

.plan-card__meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 18px;
    color: #7f7064;
    font-weight: 600;
}

.plan-card__action {
    min-height: 44px;
    width: 100%;
    border: none;
    border-radius: 12px;
    background: #c21204;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
}

.plan-card__action:disabled {
    background: #e9dfd4;
    color: #6e6157;
    cursor: default;
}

.subscription-page__message {
    margin: 0;
    padding: 14px 16px;
    border-radius: 14px;
    background: #fef4dc;
    color: #8f5a00;
    font-weight: 600;
}

@media (max-width: 960px) {
    .subscription-page__summary,
    .subscription-page__plans {
        grid-template-columns: 1fr;
    }
}
</style>
