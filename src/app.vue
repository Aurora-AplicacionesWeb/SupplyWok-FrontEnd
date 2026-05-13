<script setup>
import Layout from './shared/presentation/components/layout.vue';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const { t } = useI18n();
const route = useRoute();

const isAuthRoute = computed(() => ['login', 'register'].includes(route.name));
</script>

<template>
  <router-view v-if="isAuthRoute" />
  <Layout v-else />
</template>