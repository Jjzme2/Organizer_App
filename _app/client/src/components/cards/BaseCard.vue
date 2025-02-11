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

<style scoped>
.base-card {
  background: var(--color-surface, white);
  border: 1px solid var(--color-border, #ddd);
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  max-height: 80vh;
}

.base-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.base-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar, rgba(0, 0, 0, 0.2)) transparent;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: var(--color-scrollbar, rgba(0, 0, 0, 0.2));
  border-radius: 3px;
}

.base-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  background: var(--color-surface, white);
  z-index: 1;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border, #ddd);
}

.base-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-primary, #2c3e50);
}

.base-card-header h3.completed {
  text-decoration: line-through;
  color: var(--color-text-secondary, #666);
}

.base-card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: var(--color-text-secondary, #666);
}

.btn:hover {
  background: var(--color-background-hover, #f5f5f5);
}

.btn:focus {
  outline: 2px solid var(--color-primary, #4a90e2);
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(1px);
}

.btn-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.edit-btn {
  color: var(--color-primary, #4a90e2);
}

.edit-btn:hover {
  color: var(--color-primary-dark, #357abd);
}

.delete-btn {
  color: var(--color-danger, #e25555);
}

.delete-btn:hover {
  color: var(--color-danger-dark, #c83737);
}

.base-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #ddd);
  position: sticky;
  bottom: 0;
  background: var(--color-surface, white);
  z-index: 1;
}

.priority-high {
  border-left: 4px solid var(--color-priority-high, #e25555);
}

.priority-medium {
  border-left: 4px solid var(--color-priority-medium, #f0ad4e);
}

.priority-low {
  border-left: 4px solid var(--color-priority-low, #5cb85c);
}

.completed-task {
  opacity: 0.7;
}

.task-completing::after,
.task-uncompleting::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-background, #fff);
  opacity: 0.5;
  backdrop-filter: blur(2px);
  border-radius: 8px;
}
</style>
