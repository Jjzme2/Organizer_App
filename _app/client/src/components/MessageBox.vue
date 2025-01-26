<template>
  <div 
    v-if="show"
    class="message-box"
    :class="[`message-box--${type}`, { 'message-box--dismissible': dismissible }]"
    role="alert"
  >
    <div class="message-box__content">
      <div class="message-box__icon" v-if="showIcon">
        <!-- Error Icon -->
        <svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
        </svg>
        <!-- Success Icon -->
        <svg v-else-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-7.86l-2.765-2.767L7 12.431l3.119 3.121a1 1 0 001.414 0l5.952-5.95-1.062-1.062-5.6 5.6z"/>
        </svg>
        <!-- Info Icon -->
        <svg v-else-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
        </svg>
        <!-- Warning Icon -->
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
        </svg>
      </div>
      
      <div class="message-box__text">
        <div v-if="title" class="message-box__title">{{ title }}</div>
        <div class="message-box__message">
          <slot>{{ message }}</slot>
        </div>
      </div>

      <button 
        v-if="dismissible"
        class="message-box__close"
        @click="dismiss"
        aria-label="Dismiss message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['error', 'success', 'info', 'warning'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  timeout: {
    type: Number,
    default: 0
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss', 'update:show'])

const dismiss = () => {
  emit('dismiss')
  emit('update:show', false)
}

// Auto-dismiss functionality
watch(() => props.show, (newValue) => {
  if (newValue && props.timeout > 0) {
    setTimeout(() => {
      dismiss()
    }, props.timeout)
  }
})
</script>

<style scoped>
.message-box {
  margin: var(--spacing-md) 0;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.message-box__content {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
}

.message-box__icon {
  flex-shrink: 0;
}

.message-box__text {
  flex: 1;
}

.message-box__title {
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.message-box__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.message-box__close:hover {
  opacity: 1;
}

.icon {
  width: 24px;
  height: 24px;
}

/* Types */
.message-box--error {
  background-color: var(--color-error);
  color: white;
}

.message-box--success {
  background-color: var(--color-success);
  color: white;
}

.message-box--info {
  background-color: var(--color-info);
  color: white;
}

.message-box--warning {
  background-color: var(--color-warning);
  color: var(--color-text);
}

/* Animation */
.message-box {
  animation: slideIn var(--transition-normal) ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .message-box__content {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
