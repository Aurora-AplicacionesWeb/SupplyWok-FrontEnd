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
  <Layout v-if="!isAuthRoute">
    <router-view />
  </Layout>
  <router-view v-else />
</template>