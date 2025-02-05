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
      <label for="taskCategory">Category</label>
      <select
        id="taskCategory"
        v-model="form.categoryId"
        :disabled="submitting"
      >
        <option value="">No Category</option>
        <option
          v-for="category in categoryStore.categories"
          :key="category.id"
          :value="category.id"
          :style="{ color: category.color }"
        >
          {{ category.name }}
        </option>
      </select>
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

    <div class="form-group">
      <label for="taskDifficulty">Expected Difficulty</label>
      <BaseSlider
        v-model="form.expectedDifficulty"
        id="taskDifficulty"
        label="Expected Difficulty"
        :disabled="submitting"
        :value-labels="difficultyLabels"
        min-label="Easy"
        middle-label="Moderate"
        max-label="Hard"
      />
    </div>

    <div class="form-group">
      <label>Reminder</label>
      <div class="reminder-controls">
        <input
          type="datetime-local"
          v-model="form.reminderTime"
          :min="minDateTime"
        />
        <button
          type="button"
          class="btn btn-secondary"
          @click="clearReminder"
          v-if="form.reminderTime"
        >
          Clear Reminder
        </button>
      </div>
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
import { ref, computed, onMounted } from 'vue'
import BaseSlider from './ui/BaseSlider.vue'
import { reminderService } from '../services/reminderService'
import { useCategoryStore } from '../stores/categories'
import type { Task, TaskFormData } from '../types/task'

const props = defineProps<{
  task: Task | null
  submitting: boolean
  isEditing: boolean
}>()

const categoryStore = useCategoryStore()

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategories()
  }
})

const emit = defineEmits(['submit', 'cancel'])

const getDefaultForm = (): TaskFormData => ({
  name: '',
  description: '',
  dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(0, 0, 0, 0)).toISOString().slice(0, 16),
  notes: '',
  priority: 'medium' as const,
  status: 'pending' as const,
  expectedDifficulty: 5,
  reminderTime: '',
  categoryId: ''
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:mm
}

const form = ref<TaskFormData>(props.task ? {
  name: props.task.name,
  description: props.task.description,
  dueDate: formatDateForInput(props.task.dueDate),
  notes: props.task.notes,
  priority: props.task.priority,
  status: props.task.status,
  expectedDifficulty: props.task.expectedDifficulty,
  reminderTime: '',
  categoryId: props.task.categoryId || ''
} : getDefaultForm())

const difficultyLabels = {
  '1': 'Very Easy',
  '2': 'Easy',
  '3': 'Fairly Easy',
  '4': 'Slightly Easy',
  '5': 'Moderate',
  '6': 'Slightly Hard',
  '7': 'Fairly Hard',
  '8': 'Hard',
  '9': 'Very Hard',
  '10': 'Extremely Hard'
}

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes from now
  return now.toISOString().slice(0, 16)
})

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('submit', form.value)
  if (form.value.reminderTime) {
    reminderService.createReminder(props.task.id, form.value.reminderTime)
  }
}

function clearReminder() {
  form.value.reminderTime = ''
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
