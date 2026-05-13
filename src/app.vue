<script setup>
import Layout from './shared/presentation/components/layout.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import {useI18n} from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <ConfirmDialog />
  <Layout />
</template>