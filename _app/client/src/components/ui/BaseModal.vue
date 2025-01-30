<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="closeOnOverlayClick ? close() : null">
      <div class="modal-content" :class="contentClass" @click.stop>
        <div class="modal-header" v-if="$slots.header || title">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
          <button v-if="showCloseButton" class="btn close-btn" @click="close" aria-label="Close modal">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  contentClass: {
    type: [String, Object, Array],
    default: ''
  }
})

const emit = defineEmits(['update:show', 'close'])

const close = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 50;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
}

.modal-body {
  padding: var(--spacing-lg);
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.close-btn {
  padding: var(--spacing-xs);
  color: var(--color-text-light);
}

.close-btn:hover {
  color: var(--color-text);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

@media (max-width: 768px) {
  .modal-content {
    margin: var(--spacing-sm);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-md);
  }
}
</style>
