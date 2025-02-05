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

    <div class="task-controls" v-if="!task.isComplete">
      <div class="control-group">
        <div class="control-row">
          <label>Status:</label>
          <select v-model="currentStatus" @change="handleStatusChange">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="control-row">
          <label>Priority:</label>
          <select v-model="currentPriority" @change="handlePriorityChange">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>

    <div class="task-notes-section">
      <div v-if="task.notes && task.notes.length > 0" class="task-notes">
        <div class="notes-header" @click="isNotesExpanded = !isNotesExpanded">
          <span class="notes-title">📝 Notes ({{ task.notes.length }})</span>
          <span class="expand-icon" :class="{ 'expanded': isNotesExpanded }">▼</span>
        </div>
        <div class="notes-list" v-if="isNotesExpanded">
          <div v-for="(note, index) in formattedNotes" :key="index" class="note-item">
            <template v-for="(segment, sIndex) in note.split('|')" :key="`${index}-${sIndex}`">
              <span class="note-segment" :class="{ 'primary': sIndex === 0 }">
                {{ segment.trim() }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <div v-if="!task.isComplete" class="add-note">
        <div class="note-input-wrapper">
          <input
            v-model="newNote"
            type="text"
            placeholder="Add note (use | to separate segments)..."
            @keyup.enter="handleAddNote"
          >
          <button
            class="btn add-btn"
            :disabled="!newNote.trim()"
            @click="handleAddNote"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <div class="task-card-footer">
      <div class="task-meta">
        <span v-if="task.isComplete && task.completedAt" class="completion-date">
          ✅ Marked Completed {{ formatCompletionInfo }}
        </span>
        <span v-else-if="task.dueDate" class="due-date" :class="{ 'overdue': isOverdue }">
          ⏰ {{ formatDueDate }}
        </span>
        <span v-if="task.categoryId && category" class="category-badge" :style="{ backgroundColor: category.color + '20', color: category.color, borderColor: category.color }">
          {{ category.name }}
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
import { useCategoryStore } from '../stores/categories'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete', 'updateStatus', 'updatePriority', 'addNote'])

const categoryStore = useCategoryStore()
const category = computed(() => {
  if (!props.task.categoryId) return null
  return categoryStore.categories.find(c => c.id === props.task.categoryId)
})

const currentStatus = ref(props.task.status)
const currentPriority = ref(props.task.priority)
const isNotesExpanded = ref(false)
const newNote = ref('')

const handleStatusChange = () => {
  emit('updateStatus', { id: props.task.id, status: currentStatus.value })
}

const handlePriorityChange = () => {
  emit('updatePriority', { id: props.task.id, priority: currentPriority.value })
}

const formattedNotes = computed(() => {
  return props.task.notes.map(note => note.replace(/\n/g, '|'));
});

const handleAddNote = () => {
  if (!newNote.value.trim()) return;

  emit('addNote', { id: props.task.id, note: newNote.value.trim() })
  newNote.value = ''
}

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
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

@media (max-width: 640px) {
  .task-card {
    padding: var(--spacing-sm);
  }

  .task-actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .control-row {
    flex-direction: column;
    align-items: stretch;
  }

  .control-row label {
    margin-bottom: var(--spacing-xs);
  }
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--color-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.task-card:hover::before {
  opacity: 1;
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.task-controls {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.control-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.control-row label {
  min-width: 60px;
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.control-row select {
  flex: 1;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
}

.task-notes-section {
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
}

.task-notes {
  margin-bottom: var(--spacing-md);
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-xs) 0;
}

.notes-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.notes-list {
  margin: var(--spacing-sm) 0;
  max-height: 200px;
  overflow-y: auto;
  padding-right: var(--spacing-xs);
}

.note-item {
  background: var(--color-surface-dark);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xs);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.note-segment {
  background: var(--color-surface);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  white-space: nowrap;
  border: 1px solid var(--color-border);
}

.note-segment.primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary-dark);
}

.add-note {
  margin-top: var(--spacing-sm);
}

.note-input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
}

.note-input-wrapper input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
}

.add-btn {
  padding: 0.5rem 1rem !important;
  background: var(--color-primary) !important;
  color: white !important;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  min-width: 60px;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-card-footer {
  margin-top: var(--spacing-md);
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
  color: var(--color-success);
}

.due-date {
  color: var(--color-text-light);
}

.due-date.overdue {
  color: var(--color-error);
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  border: 1px solid;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.25rem;
  border: none;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.btn:hover {
  background: var(--color-surface-hover);
}

.edit-btn:hover {
  color: var(--color-primary);
}

.delete-btn:hover {
  color: var(--color-error);
}

.checkbox-wrapper {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  padding-top: 4px;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.checkbox-wrapper:hover .checkbox-custom {
  border-color: var(--color-primary);
}

.checkbox-wrapper input:checked ~ .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.completed {
  text-decoration: line-through;
  color: var(--color-text-light);
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
</style>
