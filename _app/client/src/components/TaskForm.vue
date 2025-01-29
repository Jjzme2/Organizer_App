<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="taskName">Task Name</label>
      <input
        id="taskName"
        v-model="form.name"
        type="text"
        required
        placeholder="What needs to be done?"
        :disabled="submitting"
      />
    </div>

    <div class="form-group">
      <label for="taskDescription">Description (Optional)</label>
      <textarea
        id="taskDescription"
        v-model="form.description"
        rows="3"
        placeholder="Add more details about this task..."
        :disabled="submitting"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="taskPriority">Priority</label>
      <select
        id="taskPriority"
        v-model="form.priority"
        :disabled="submitting"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div class="form-group">
      <label for="taskStatus">Status</label>
      <select
        id="taskStatus"
        v-model="form.status"
        :disabled="submitting"
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div class="form-group">
      <label for="taskDueDate">Due Date (Optional)</label>
      <input
        id="taskDueDate"
        v-model="form.dueDate"
        type="datetime-local"
        :disabled="submitting"
      />
    </div>

    <div class="form-group">
      <label for="taskNotes">Notes</label>
      <textarea
        id="taskNotes"
        v-model="form.notes"
        rows="4"
        placeholder="Add any additional notes or details..."
        :disabled="submitting"
        class="notes-input"
      ></textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="btn" @click="$emit('cancel')" :disabled="submitting">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        <span v-if="submitting" class="loading-spinner"></span>
        {{ isEditing ? 'Save Changes' : 'Create Task' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  submitting: {
    type: Boolean,
    required: true
  },
  isEditing: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const getDefaultForm = () => ({
  name: '',
  description: '',
  dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(0, 0, 0, 0)).toISOString().slice(0, 16),
  notes: '',
  priority: 'medium',
  status: 'pending'
})

const form = ref(props.task ? { ...props.task } : getDefaultForm())

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('submit', form.value)
}
</script>

<style scoped>
.task-form {
  padding: var(--spacing-lg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.notes-input {
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}
</style> 