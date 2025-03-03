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
        <div v-if="isStructuredError" class="message-box__structured-error">
          <div class="message-box__message">{{ structuredMessage }}</div>
          <div v-if="errorCode" class="message-box__code">Error Code: {{ errorCode }}</div>
          <ul v-if="errorDetails" class="message-box__details">
            <li v-for="(error, index) in errorDetails" :key="index">{{ error }}</li>
          </ul>
        </div>
        <div v-else class="message-box__message">
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
import { watch, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['error', 'success', 'info', 'warning'].includes(value)
  },
  message: {
    type: [String, Object],
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

const isStructuredError = computed(() => {
  return typeof props.message === 'object' && props.message !== null
})

const structuredMessage = computed(() => {
  if (isStructuredError.value) {
    return props.message.message
  }
  return props.message
})

const errorCode = computed(() => {
  if (isStructuredError.value) {
    return props.message.code
  }
  return null
})

const errorDetails = computed(() => {
  if (isStructuredError.value && props.message.errors) {
    return Array.isArray(props.message.errors)
      ? props.message.errors
      : [props.message.errors]
  }
  return null
})

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