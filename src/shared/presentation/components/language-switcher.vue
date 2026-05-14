<script setup>
import SelectButton from 'primevue/selectbutton';
import { useI18n } from 'vue-i18n';

const { locale, availableLocales } = useI18n();
</script>

<template>
  <SelectButton v-model="locale" :options="availableLocales" class="language-switcher">
    <template #option="slotProps">
      <span>{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </SelectButton>
</template>

<style scoped>
.language-switcher {
  font-family: 'Montserrat', system-ui, sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
