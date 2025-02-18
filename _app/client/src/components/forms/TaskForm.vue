<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="title">Title</label>
      <input
        type="text"
        id="title"
        v-model="form.title"
        :disabled="submitting"
        class="form-control"
        required
      />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        :disabled="submitting"
        class="form-control"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="dueDate">Due Date</label>
      <input
        type="datetime-local"
        id="dueDate"
        v-model="form.dueDate"
        :disabled="submitting"
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="priority">Priority</label>
      <select
        id="priority"
        v-model="form.priority"
        :disabled="submitting"
        class="form-control"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div class="form-group">
      <label for="category">Category</label>
      <div class="category-select-container">
        <select
          id="category"
          v-model="form.category"
          :disabled="submitting"
          class="form-control"
        >
          <option value="">Uncategorized</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="showNewCategoryInput = true"
          v-if="!showNewCategoryInput"
        >
          <i class="fas fa-plus"></i> New Category
        </button>
      </div>
      <div v-if="showNewCategoryInput" class="new-category-input mt-2">
        <div class="input-group">
          <input
            v-model="newCategoryName"
            type="text"
            class="form-control"
            placeholder="Enter new category name"
            @keyup.enter="createCategory"
          />
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-primary"
              @click="createCategory"
              :disabled="!newCategoryName.trim()"
            >
              Add
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelNewCategory"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="submitting || !form.title.trim()"
      >
        {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="$emit('cancel')"
        :disabled="submitting"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import type { Task } from '@/types'

const props = defineProps<{
  task?: Task
  submitting: boolean
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void
  (e: 'cancel'): void
}>()

const categoryStore = useCategoryStore()
const categories = ref<{ id: string; name: string }[]>([])
const showNewCategoryInput = ref(false)
const newCategoryName = ref('')

const form = reactive<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
  title: props.task?.title || '',
  description: props.task?.description || '',
  dueDate: props.task?.dueDate || '',
  priority: props.task?.priority || 'low',
  category: props.task?.category || '',
  completed: props.task?.completed || false,
  status: props.task?.status || 'pending',
  notes: props.task?.notes || []
})

onMounted(async () => {
  await categoryStore.fetchCategories()
  categories.value = categoryStore.categories
})

async function createCategory() {
  if (!newCategoryName.value.trim()) return
  
  try {
    const newCategory = await categoryStore.createCategory({
      name: newCategoryName.value.trim()
    })
    categories.value.push(newCategory)
    form.category = newCategory.id
    showNewCategoryInput.value = false
    newCategoryName.value = ''
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}

function cancelNewCategory() {
  showNewCategoryInput.value = false
  newCategoryName.value = ''
}

function handleSubmit() {
  emit('submit', form)
}
</script>

<style scoped>
.task-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-control {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--input-bg-color);
  color: var(--text-color);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-light);
}

.category-select-container {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.new-category-input {
  margin-top: 0.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group-append {
  display: flex;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-color-dark);
}

.btn-secondary {
  background: var(--surface-secondary-color);
  color: var(--text-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--surface-secondary-color-dark);
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline-secondary:hover:not(:disabled) {
  background: var(--surface-secondary-color);
}
</style>
