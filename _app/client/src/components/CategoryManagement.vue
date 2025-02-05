<template>
  <div class="category-management">
    <h2>Manage Categories</h2>

    <!-- Category Form -->
    <form @submit.prevent="handleSubmit" class="category-form">
      <div class="form-group">
        <label for="categoryName">Category Name</label>
        <input
          id="categoryName"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter category name"
          :disabled="submitting"
        />
      </div>

      <div class="form-group">
        <label for="categoryColor">Color</label>
        <input
          id="categoryColor"
          v-model="form.color"
          type="color"
          :disabled="submitting"
        />
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn"
          @click="resetForm"
          :disabled="submitting"
        >
          Clear
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting"
        >
          {{ editingId ? 'Update Category' : 'Create Category' }}
        </button>
      </div>
    </form>

    <!-- Categories List -->
    <div class="categories-list" v-if="categoryStore.categories.length">
      <h3>Existing Categories</h3>
      <div
        v-for="category in categoryStore.categories"
        :key="category.id"
        class="category-item"
      >
        <div class="category-color" :style="{ backgroundColor: category.color }"></div>
        <span class="category-name">{{ category.name }}</span>
        <div class="category-actions">
          <button
            class="btn edit-btn"
            @click="editCategory(category)"
            aria-label="Edit category"
          >
            ✎
          </button>
          <button
            class="btn delete-btn"
            @click="deleteCategory(category.id)"
            aria-label="Delete category"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-categories">
      No categories created yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '../stores/categories'
import type { Category, CategoryForm } from '../types/task'

const categoryStore = useCategoryStore()
const submitting = ref(false)
const editingId = ref<string | null>(null)

const form = ref<CategoryForm>({
  name: '',
  color: '#808080'
})

onMounted(async () => {
  await categoryStore.fetchCategories()
})

function resetForm() {
  form.value = {
    name: '',
    color: '#808080'
  }
  editingId.value = null
}

async function handleSubmit() {
  if (!form.value.name.trim()) return

  submitting.value = true
  try {
    if (editingId.value) {
      await categoryStore.updateCategory(editingId.value, form.value)
    } else {
      await categoryStore.createCategory(form.value)
    }
    resetForm()
  } catch (error) {
    console.error('Failed to save category:', error)
  } finally {
    submitting.value = false
  }
}

function editCategory(category: Category) {
  editingId.value = category.id
  form.value = {
    name: category.name,
    color: category.color
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return

  submitting.value = true
  try {
    await categoryStore.deleteCategory(id)
    if (editingId.value === id) {
      resetForm()
    }
  } catch (error) {
    console.error('Failed to delete category:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.category-management {
  padding: var(--spacing-lg);
}

.category-form {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xl);
}

.category-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-sm);
}

.category-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: var(--spacing-md);
  border: 2px solid var(--color-border);
}

.category-name {
  flex: 1;
}

.category-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.no-categories {
  text-align: center;
  color: var(--color-text-light);
  padding: var(--spacing-xl);
}

.categories-list {
  margin-top: var(--spacing-xl);
}

h3 {
  margin-bottom: var(--spacing-lg);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: none;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--color-surface-hover);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.edit-btn, .delete-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.edit-btn:hover {
  color: var(--color-primary);
}

.delete-btn:hover {
  color: var(--color-error);
}
</style>
