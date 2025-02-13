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
