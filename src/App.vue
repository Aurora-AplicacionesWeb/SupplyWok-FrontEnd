<script setup>
import Layout from './shared/presentation/components/layout.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isAuthRoute = computed(() => ['login', 'register'].includes(route.name));
</script>

<template>
  <Layout v-if="!isAuthRoute">
    <router-view />
  </Layout>
  <router-view v-else />
</template>