<template>
  <div
    class="task-card"
    :class="{
      'completed-task': task.isComplete,
      'task-completing': task.isCompleting,
      'task-uncompleting': task.isUncompleting,
      [`priority-${task.priority}`]: true
    }"
  >
    <div class="task-card-header">
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          :checked="task.isComplete"
          @change="$emit('toggle', task.id)"
          :disabled="task.isCompleting || task.isUncompleting"
        >
        <span class="checkbox-custom"></span>
      </label>
      <h3 :class="{ 'completed': task.isComplete }">{{ task.name }}</h3>
    </div>

    <p v-if="task.description" class="task-card-description">
      {{ task.description }}
    </p>

    <div v-if="task.notes" class="task-card-notes" :class="{ 'expanded': isNotesExpanded }" @click="isNotesExpanded = !isNotesExpanded">
      <div class="notes-header">
        📝
        <span>Notes</span>
        <span class="expand-icon">▼</span>
      </div>
      <p class="notes-content">{{ task.notes }}</p>
    </div>

    <div class="task-card-footer">
      <div class="task-meta">
        <span v-if="task.isComplete && task.completedAt" class="completion-date">
          ✅ Completed {{ formatCompletionInfo }}
        </span>
        <span v-else-if="task.dueDate" class="due-date" :class="{ 'overdue': isOverdue }">
          ⏰ {{ formatDueDate }}
        </span>
        <span v-if="task.tags && task.tags.length" class="tags">
          <span v-for="tag in task.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </span>
      </div>
      <div class="task-actions" v-if="!task.isComplete">
        <button @click="$emit('edit', task)" class="btn edit-btn" aria-label="Edit task">
          ✎
        </button>
        <button @click="$emit('delete', task.id)" class="btn delete-btn" aria-label="Delete task">
          🗑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const isNotesExpanded = ref(false)

defineEmits(['toggle', 'edit', 'delete'])

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  return new Date(props.task.dueDate) < new Date()
})

const formatDueDate = computed(() => {
  if (!props.task.dueDate) return ''
  const date = new Date(props.task.dueDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
})

const formatCompletionInfo = computed(() => {
  if (!props.task.completedAt || !props.task.dueDate) {
    return new Date(props.task.completedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const completedDate = new Date(props.task.completedAt)
  const dueDate = new Date(props.task.dueDate)
  const diffDays = Math.round((dueDate - completedDate) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'on time'
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} early`
  } else {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} late`
  }
})
</script>

<style scoped>
.task-card {
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  transition: all 0.3s ease;
  opacity: 0.85;
  transform: translateY(0);
  position: relative;
  overflow: hidden;
}

/* Priority indicator bar */
.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  opacity: 0.8;
  transition: width 0.3s ease;
}

/* Priority colors with patterns for better distinction */
.task-card.priority-low::before {
  background: repeating-linear-gradient(
    45deg,
    #4CAF50,
    #4CAF50 10px,
    #45a049 10px,
    #45a049 20px
  );
}

.task-card.priority-medium::before {
  background: repeating-linear-gradient(
    45deg,
    #FFA726,
    #FFA726 10px,
    #fb8c00 10px,
    #fb8c00 20px
  );
}

.task-card.priority-high::before {
  background: repeating-linear-gradient(
    45deg,
    #f44336,
    #f44336 10px,
    #d32f2f 10px,
    #d32f2f 20px
  );
}

/* Hover effect for priority indicator */
.task-card:hover::before {
  width: 8px;
}

/* Shine animation */
.task-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  transform: skewX(-25deg);
  animation: shine 3s infinite;
}

/* Gold styling for completed tasks */
.task-card.completed-task::before {
  background: linear-gradient(
    to bottom,
    #FFD700,  /* Pure gold */
    #DAA520,  /* Golden rod */
    #B8860B   /* Dark golden rod */
  );
  width: 4px;
  opacity: 1;
}

.task-card.completed-task:hover::before {
  width: 6px;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Ensure content stays above effects */
.task-card > * {
  position: relative;
  z-index: 1;
}

.task-card:hover {
  opacity: 1;
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  background: var(--color-surface);
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed:hover {
  opacity: 0.8;
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.checkbox-wrapper {
  padding-top: 4px;
}

.task-card-description {
  color: var(--color-text-light);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.task-card-notes {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.task-card-notes:hover,
.task-card-notes.expanded {
  opacity: 1;
  background: var(--color-surface-hover);
  margin-left: calc(var(--spacing-md) * -1);
  margin-right: calc(var(--spacing-md) * -1);
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
}

.notes-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-xs);
}

.notes-header .icon {
  width: 1rem;
  height: 1rem;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.expanded .expand-icon {
  transform: rotate(180deg);
}

.notes-content {
  color: var(--color-text-light);
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.expanded .notes-content {
  max-height: 500px;
  margin-top: var(--spacing-sm);
}

.task-card-notes:hover .notes-content {
  max-height: 500px;
  margin-top: var(--spacing-sm);
}

.task-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
}

.completion-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-success);
  font-weight: 500;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-light);
}

.overdue {
  color: var(--color-error);
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--color-surface);
  color: var(--color-text) !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.edit-btn:hover {
  color: var(--color-primary);
}

.delete-btn:hover {
  color: var(--color-error);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: block;
}

/* Checkbox styling */
.checkbox-wrapper {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.checkbox-wrapper:hover .checkbox-custom {
  border-color: var(--color-primary);
}

.checkbox-wrapper input:checked ~ .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%, -50%);
  fill: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox-wrapper input:checked ~ .checkbox-custom .checkmark-icon {
  opacity: 1;
}

/* Task state transitions */
.task-completing::after,
.task-uncompleting::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-background);
  opacity: 0.5;
  backdrop-filter: blur(4px);
}

.completed h3 {
  text-decoration: line-through;
  color: var(--color-text-light);
}
</style>
