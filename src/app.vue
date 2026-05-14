<script setup>
import Layout from './shared/presentation/components/layout.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

/**
 * Auth screens must bypass the application shell.
 * Otherwise the login/register cards are rendered inside the dashboard layout and become visually broken.
 */
const isAuthRoute = computed(() => ['login', 'register'].includes(route.name));
</script>

<template>
  <router-view v-if="isAuthRoute" />
  <Layout v-else />
</template>
