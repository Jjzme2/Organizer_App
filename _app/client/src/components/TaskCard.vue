<template>
  <div 
    class="task-card"
    :class="{ 
      'completed-task': task.isComplete,
      'task-completing': task.isCompleting,
      'task-uncompleting': task.isUncompleting
    }"
  >
    <div class="task-card-header">
      <label class="checkbox-container">
        <input
          type="checkbox"
          :checked="task.isComplete"
          @change="$emit('toggle', task.id)"
          :disabled="task.isCompleting || task.isUncompleting"
        />
        <span class="checkmark">
          <svg class="checkmark-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </span>
      </label>
      <h3 :class="{ 'completed': task.isComplete }">{{ task.name }}</h3>
    </div>

    <p v-if="task.description" class="task-card-description">
      {{ task.description }}
    </p>

    <div v-if="task.notes" class="task-card-notes" :class="{ 'expanded': isNotesExpanded }" @click="isNotesExpanded = !isNotesExpanded">
      <div class="notes-header">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        <span>Notes</span>
        <svg class="icon expand-icon" viewBox="0 0 24 24">
          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>
      </div>
      <p class="notes-content">{{ task.notes }}</p>
    </div>

    <div class="task-card-footer">
      <div class="task-meta">
        <span v-if="task.dueDate" class="due-date" :class="{ 'overdue': isOverdue }">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
          </svg>
          {{ formatDueDate }}
        </span>
        <span v-if="task.tags && task.tags.length" class="tags">
          <span v-for="tag in task.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </span>
      </div>
      <div class="task-actions" v-if="!task.isComplete">
        <button @click="$emit('edit', task)" class="btn edit-btn">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button @click="$emit('delete', task.id)" class="btn delete-btn">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
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

.checkbox-container {
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
  background: transparent;
  color: var(--color-text-light);
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
  fill: currentColor;
}

/* Checkbox styling */
.checkbox-container {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
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

.checkbox-container:hover .checkmark {
  border-color: var(--color-primary);
}

.checkbox-container input:checked ~ .checkmark {
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

.checkbox-container input:checked ~ .checkmark .checkmark-icon {
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
