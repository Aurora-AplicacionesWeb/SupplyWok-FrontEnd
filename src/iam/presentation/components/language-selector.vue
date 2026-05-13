<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';

const { locale, t } = useI18n();

const languages = ref([
  { name: 'English (US)', code: 'en', icon: '/images/icons/selector-iam/en-selector-icon.svg' },
  { name: 'Spanish (ES)', code: 'es', icon: '/images/icons/selector-iam/es-selector-icon.svg' },
  { name: 'Chinese (ZH)', code: 'zh', icon: '/images/icons/selector-iam/zh-selector-icon.svg' }
]);

const selectedLanguage = computed({
  get: () => languages.value.find(lang => lang.code === locale.value) || languages.value[0],
  set: (val) => {
    locale.value = val.code;
  }
});
</script>

<template>
  <div class="language-selector">
    <pv-select
      v-model="selectedLanguage"
      :options="languages"
      optionLabel="name"
      class="w-full md:w-14rem custom-select"
      panelClass="custom-select-panel"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex align-items-center gap-2">
          <img :src="slotProps.value.icon" :alt="slotProps.value.code" class="lang-icon" />
          <div class="lang-name">{{ slotProps.value.name }}</div>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex align-items-center gap-2">
          <img :src="slotProps.option.icon" :alt="slotProps.option.code" class="lang-icon" />
          <div class="lang-name">{{ slotProps.option.name }}</div>
        </div>
      </template>
    </pv-select>
  </div>
</template>

<style scoped>
.language-selector {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
}

:deep(.custom-select) {
  background: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05) !important;
  color: #1a1a1a !important;
}

:deep(.p-select-label) {
  padding: 0.5rem 1rem !important;
  font-weight: 500 !important;
  color: #1a1a1a !important;
}

:deep(.p-select-dropdown) {
  color: #1a1a1a !important;
}

.lang-icon {
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
}

.lang-name {
  font-size: 0.9rem;
  color: #1a1a1a;
}
</style>

<style>
/* Global styles for the dropdown panel to force light mode */
.custom-select-panel {
  background: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
}
.custom-select-panel .p-select-option {
  color: #1a1a1a !important;
}
.custom-select-panel .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
  background: #f4f0e6 !important;
  color: #1a1a1a !important;
}
.custom-select-panel .p-select-option-selected {
  background: #e9f5ec !important;
  color: #1a1a1a !important;
}
</style>
