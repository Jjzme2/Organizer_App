<template>
  <transition name="toast">
    <div v-if="show" :class="['toast', type, position]" role="alert">
      <div class="toast-content">
        <span class="toast-icon" v-if="showIcon">
          <i v-if="type === 'error'" class="fas fa-exclamation-circle"></i>
          <i v-else-if="type === 'success'" class="fas fa-check-circle"></i>
          <i v-else-if="type === 'info'" class="fas fa-info-circle"></i>
          <i v-else-if="type === 'warning'" class="fas fa-exclamation-triangle"></i>
        </span>
        <div class="toast-text">
          <strong v-if="title" class="toast-title">{{ title }}</strong>
          <p class="toast-message">{{ message }}</p>
        </div>
        <button v-if="dismissible" class="toast-close" @click="dismiss" aria-label="Dismiss">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div v-if="progress" class="toast-progress" :style="progressStyle"></div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';

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
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left'
    ].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  progress: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:show', 'dismiss']);
const progressWidth = ref(100);

const dismiss = () => {
  emit('update:show', false);
  emit('dismiss');
};

const progressStyle = {
  width: `${progressWidth.value}%`
};

onMounted(() => {
  if (props.duration > 0) {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      progressWidth.value = 100 - (elapsed / props.duration) * 100;
      
      if (elapsed < props.duration) {
        requestAnimationFrame(animate);
      } else {
        dismiss();
      }
    };
    
    requestAnimationFrame(animate);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  min-width: 300px;
  max-width: 400px;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.toast-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.toast-text {
  flex: 1;
}

.toast-title {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.toast-message {
  margin: 0;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.toast-close:hover {
  opacity: 1;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  transition: width linear;
}

/* Toast types */
.error {
  background-color: var(--color-error);
  color: white;
}

.success {
  background-color: var(--color-success);
  color: white;
}

.info {
  background-color: var(--color-info);
  color: white;
}

.warning {
  background-color: var(--color-warning);
  color: white;
}

/* Positions */
.top-right {
  top: var(--spacing-md);
  right: var(--spacing-md);
}

.top-left {
  top: var(--spacing-md);
  left: var(--spacing-md);
}

.bottom-right {
  bottom: var(--spacing-md);
  right: var(--spacing-md);
}

.bottom-left {
  bottom: var(--spacing-md);
  left: var(--spacing-md);
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.top-left .toast-enter-from,
.top-left .toast-leave-to,
.bottom-left .toast-enter-from,
.bottom-left .toast-leave-to {
  transform: translateX(-100%);
}
</style>
