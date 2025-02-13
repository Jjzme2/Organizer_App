<template>
  <div
    class="base-card"
    :class="[
      {
        'completed-task': isComplete,
        'task-completing': isCompleting,
        'task-uncompleting': isUncompleting,
      },
      `priority-${priority}`,
      customClass
    ]"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    ref="cardRef"
  >
    <div class="base-card-content">
      <div class="base-card-header">
        <slot name="header-prefix"></slot>
        <slot name="header">
          <h3 :class="{ 'completed': isComplete }">{{ title }}</h3>
        </slot>
        <slot name="header-actions">
          <div class="base-card-actions" v-if="showDefaultActions">
            <button @click="$emit('edit')" class="btn edit-btn" aria-label="Edit">
              <span class="btn-icon">✎</span>
            </button>
            <button @click="confirmDelete" class="btn delete-btn" aria-label="Delete">
              <span class="btn-icon">🗑</span>
            </button>
          </div>
        </slot>
      </div>

      <div class="scrollable-content" ref="scrollableContent">
        <slot name="body" />
        <slot name="controls" />
        <slot name="footer">
          <div class="base-card-footer" v-if="$slots.meta || $slots['footer-actions']">
            <slot name="meta" />
            <slot name="footer-actions" />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['edit', 'delete', 'mouseleave']);
const cardRef = ref(null);
const scrollableContent = ref(null);
let isScrolling = false;

const props = defineProps({
  isComplete: Boolean,
  isCompleting: Boolean,
  isUncompleting: Boolean,
  priority: {
    type: String,
    default: 'medium'
  },
  title: {
    type: String,
    default: 'Card Title'
  },
  showDefaultActions: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
});

function handleMouseMove(event) {
  if (!scrollableContent.value || !cardRef.value) return;
  
  const cardRect = cardRef.value.getBoundingClientRect();
  const relativeY = event.clientY - cardRect.top;
  const scrollPercent = relativeY / cardRect.height;
  const maxScroll = scrollableContent.value.scrollHeight - scrollableContent.value.clientHeight;
  
  scrollableContent.value.scrollTop = maxScroll * scrollPercent;
}

function handleMouseLeave() {
  if (!scrollableContent.value) return;
  
  // Smooth scroll back to top
  scrollableContent.value.style.scrollBehavior = 'smooth';
  scrollableContent.value.scrollTop = 0;
  
  // Reset scroll behavior after animation
  setTimeout(() => {
    if (scrollableContent.value) {
      scrollableContent.value.style.scrollBehavior = 'auto';
    }
  }, 300);
  
  emit('mouseleave');
}

function confirmDelete() {
  if (confirm('Are you sure you want to delete this item?')) {
    emit('delete');
  }
}
</script>