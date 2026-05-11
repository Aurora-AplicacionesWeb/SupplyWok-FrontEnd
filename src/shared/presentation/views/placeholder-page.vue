<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageTitle = computed(() => route.meta?.title ?? 'Module');
</script>

<template>
  <section class="placeholder-page">
    <span class="placeholder-page__kicker">Frontend first version</span>
    <h1>{{ pageTitle }}</h1>
    <p>This module is reserved and can be completed in the next sprint tasks.</p>
  </section>
</template>

<style scoped>
.placeholder-page {
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(47, 36, 29, 0.08);
}

.placeholder-page__kicker {
  color: #b56a16;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.placeholder-page h1 {
  margin: 8px 0 0;
  color: #2f241d;
}

.placeholder-page p {
  margin: 8px 0 0;
  color: #7f7064;
}
</style>