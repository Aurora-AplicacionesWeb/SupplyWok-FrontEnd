<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
    <section class="page-not-found">
        <h1>{{ t('shared.errors.pageNotFoundTitle') }}</h1>
        <p>{{ t('shared.errors.pageNotFoundDesc') }}</p>
    </section>
</template>

<style scoped>
.page-not-found {
    padding: 32px;
    color: #2f241d;
}
</style>
