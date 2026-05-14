<script setup>
import { useI18n } from 'vue-i18n';
import PurchaseOrderFormPanel from '../components/purchase-order-form-panel.vue';

const { t } = useI18n();
</script>

<template>
    <section class="purchase-order-form-page">
        <div class="purchase-order-form-page__header">
            <span class="purchase-order-form-page__kicker">{{ t('supply-and-purchasing.purchase-order-form-page.kicker') }}</span>
            <h1>{{ t('supply-and-purchasing.purchase-order-form-page.title') }}</h1>
            <p>{{ t('supply-and-purchasing.purchase-order-form-page.description') }}</p>
        </div>
        <PurchaseOrderFormPanel />
    </section>
</template>

<style scoped>
.purchase-order-form-page {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 720px;
}

.purchase-order-form-page__header h1 {
    margin: 0;
    color: #2f241d;
}

.purchase-order-form-page__header p {
    margin: 8px 0 0;
    color: #7f7064;
}

.purchase-order-form-page__kicker {
    color: #b56a16;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}
</style>
