<template>
  <transition name="banner">
    <div v-if="show" :class="['banner', type, { dismissible }]" role="alert">
      <div class="banner-content">
        <span class="banner-icon" v-if="showIcon">
          <i v-if="type === 'error'" class="fas fa-exclamation-circle"></i>
          <i v-else-if="type === 'success'" class="fas fa-check-circle"></i>
          <i v-else-if="type === 'info'" class="fas fa-info-circle"></i>
          <i v-else-if="type === 'warning'" class="fas fa-exclamation-triangle"></i>
        </span>
        <div class="banner-text">
          <strong v-if="title" class="banner-title">{{ title }}</strong>
          <p class="banner-message">{{ message }}</p>
        </div>
      </div>
      <button v-if="dismissible" class="banner-close" @click="dismiss" aria-label="Dismiss">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['error', 'success', 'info', 'warning'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Number,
    default: 0 // 0 means no auto-close
  }
});

const emit = defineEmits(['update:show', 'dismiss']);

const dismiss = () => {
  emit('update:show', false);
  emit('dismiss');
};

if (props.autoClose > 0) {
  setTimeout(() => {
    dismiss();
  }, props.autoClose);
}
</script>

<style scoped>
.banner {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  flex: 1;
}

.banner-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.banner-text {
  flex: 1;
}

.banner-title {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.banner-message {
  margin: 0;
  line-height: 1.5;
}

.banner-close {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.banner-close:hover {
  opacity: 1;
}

/* Banner types */
.error {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-left: 4px solid var(--color-error);
}

.success {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border-left: 4px solid var(--color-success);
}

.info {
  background-color: var(--color-info-light);
  color: var(--color-info);
  border-left: 4px solid var(--color-info);
}

.warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
  border-left: 4px solid var(--color-warning);
}

/* Animations */
.banner-enter-active,
.banner-leave-active {
  transition: all var(--transition-normal);
}

.banner-enter-from {
  transform: translateY(-1rem);
  opacity: 0;
}

.banner-leave-to {
  transform: translateY(-1rem);
  opacity: 0;
}
</style>
