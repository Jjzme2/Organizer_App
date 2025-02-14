<template>
  <transition name="fade">
    <div v-if="message" :class="['field-message', type]" role="alert">
      <span class="message-icon" v-if="showIcon">
        <i v-if="type === 'error'" class="fas fa-exclamation-circle"></i>
        <i v-else-if="type === 'success'" class="fas fa-check-circle"></i>
        <i v-else-if="type === 'info'" class="fas fa-info-circle"></i>
        <i v-else-if="type === 'warning'" class="fas fa-exclamation-triangle"></i>
      </span>
      <span class="message-text">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'info', 'warning'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.field-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.message-icon {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.error {
  color: var(--color-error);
  background-color: var(--color-error-light);
}

.success {
  color: var(--color-success);
  background-color: var(--color-success-light);
}

.info {
  color: var(--color-info);
  background-color: var(--color-info-light);
}

.warning {
  color: var(--color-warning);
  background-color: var(--color-warning-light);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
