<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  cancelLabel: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'confirm']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

function confirmDelete() {
  emit('confirm');
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
    v-model:visible="dialogVisible"
    modal
    :draggable="false"
    :header="title"
    :style="{ width: 'min(420px, calc(100vw - 32px))' }"
  >
    <p class="confirm-delete-dialog__message">{{ message }}</p>
    <template #footer>
      <div class="confirm-delete-dialog__actions">
        <pv-button
          :label="cancelLabel"
          severity="secondary"
          outlined
          type="button"
          @click="dialogVisible = false"
        />
        <pv-button
          :label="confirmLabel"
          severity="danger"
          type="button"
          @click="confirmDelete"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.confirm-delete-dialog__message {
  margin: 0;
  color: #4f4339;
  line-height: 1.5;
}

.confirm-delete-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
