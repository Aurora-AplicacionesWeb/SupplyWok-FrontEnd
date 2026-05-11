<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="suppliers-page">
        <span class="suppliers-page__kicker">{{ t('supply-and-purchasing.suppliers-page.kicker') }}</span>
        <h1>{{ t('supply-and-purchasing.suppliers-page.title') }}</h1>
        <p>{{ t('supply-and-purchasing.suppliers-page.description') }}</p>
    </section>
</template>

<style scoped>
.suppliers-page {
    padding: 20px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.suppliers-page__kicker {
    color: #b56a16;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.suppliers-page h1 {
    margin: 8px 0 0;
    color: #2f241d;
}

.suppliers-page p {
    margin: 8px 0 0;
    color: #7f7064;
}
</style>
