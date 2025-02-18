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
import { useAuthStore } from '../stores/auth'
import type { Category, CategoryForm } from '../types/task'

const categoryStore = useCategoryStore()
const authStore = useAuthStore()
const submitting = ref(false)
const editingId = ref<string | null>(null)

const form = ref<CategoryForm>({
  name: '',
  color: '#808080',
  userId: authStore.user?.id
})

onMounted(async () => {
  await categoryStore.fetchCategories()
})

function resetForm() {
  form.value = {
    name: '',
    color: '#808080',
    userId: authStore.user?.id
  }
  editingId.value = null
}

async function handleSubmit() {
  if (!form.value.name.trim()) return

  submitting.value = true
  try {
    const newCategory = {
      name: form.value.name,
      color: form.value.color,
      userId: authStore.user?.id || ''
    }
    if (editingId.value) {
      await categoryStore.updateCategory(editingId.value, newCategory)
    } else {
      await categoryStore.createCategory(newCategory)
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
    color: category.color,
    userId: category.userId
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
