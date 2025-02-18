<template>
  <div 
    class="task-card"
    :class="{
      'completed': task.completed,
      [`priority-${task.priority}`]: task.priority
    }"
  >
    <div class="task-header">
      <div class="task-title">
        <h4>{{ task.title }}</h4>
        <div class="task-badges">
          <span v-if="task.priority" class="badge priority-badge" :class="`priority-${task.priority}`">
            {{ task.priority }}
          </span>
          <span v-if="daysUntilDue !== null" class="badge due-badge" :class="dueDateClass">
            {{ dueDateText }}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <button 
          class="btn btn-icon"
          @click="$emit('toggle-complete', task.id)"
          :title="task.completed ? 'Mark as incomplete' : 'Mark as complete'"
        >
          <i class="fas" :class="task.completed ? 'fa-check-circle' : 'fa-circle'"></i>
        </button>
        <div class="dropdown">
          <button class="btn btn-icon" @click="showMenu = !showMenu">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div v-if="showMenu" class="dropdown-menu" @click="showMenu = false">
            <button class="dropdown-item" @click="$emit('edit', task)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="dropdown-item" @click="$emit('delete', task.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="task.description" class="task-description">
      {{ task.description }}
    </div>

    <div v-if="task.notes && task.notes.length > 0" class="task-notes">
      <div v-for="note in task.notes" :key="note.id" class="note-item">
        <span class="note-content">{{ note.content }}</span>
        <span class="note-date">{{ formatDate(note.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  (e: 'toggle-complete', id: string): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: string): void
}>()

const showMenu = ref(false)

// Calculate days until due
const daysUntilDue = computed(() => {
  if (!props.task.dueDate) return null
  const now = new Date()
  const dueDate = new Date(props.task.dueDate)
  const diffTime = dueDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Due date formatting
const dueDateClass = computed(() => {
  if (!daysUntilDue.value) return ''
  if (daysUntilDue.value < 0) return 'overdue'
  if (daysUntilDue.value === 0) return 'due-today'
  if (daysUntilDue.value <= 3) return 'due-soon'
  return 'due-later'
})

const dueDateText = computed(() => {
  if (!daysUntilDue.value) return ''
  if (daysUntilDue.value < 0) return `${Math.abs(daysUntilDue.value)}d overdue`
  if (daysUntilDue.value === 0) return 'Due today'
  if (daysUntilDue.value === 1) return 'Due tomorrow'
  return `Due in ${daysUntilDue.value}d`
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.task-card {
  background: var(--surface-color);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-card.completed {
  opacity: 0.7;
  background: var(--surface-secondary-color);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.task-title {
  flex: 1;
}

.task-title h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--heading-color);
}

.task-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-badge {
  text-transform: capitalize;
}

.priority-high {
  background: var(--error-color-light);
  color: var(--error-color);
}

.priority-medium {
  background: var(--warning-color-light);
  color: var(--warning-color);
}

.priority-low {
  background: var(--success-color-light);
  color: var(--success-color);
}

.due-badge {
  background: var(--surface-secondary-color);
  color: var(--text-color);
}

.due-badge.overdue {
  background: var(--error-color-light);
  color: var(--error-color);
}

.due-badge.due-today {
  background: var(--warning-color-light);
  color: var(--warning-color);
}

.due-badge.due-soon {
  background: var(--info-color-light);
  color: var(--info-color);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary-color);
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--surface-secondary-color);
  color: var(--text-color);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--surface-color);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
  min-width: 150px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: var(--text-color);
  border-radius: 0.25rem;
}

.dropdown-item:hover {
  background: var(--surface-secondary-color);
}

.task-description {
  margin-top: 1rem;
  color: var(--text-secondary-color);
  font-size: 0.9rem;
  line-height: 1.5;
}

.task-notes {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.note-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.note-content {
  flex: 1;
  color: var(--text-secondary-color);
}

.note-date {
  color: var(--text-tertiary-color);
  font-size: 0.8rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .task-header {
    flex-direction: column;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}
</style>
