import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import api from '../services/api'

export const useCategoryStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  // Helper functions
  const checkAuth = () => {
    if (!authStore.isAuthenticated) {
      throw new Error('Not authenticated')
    }
  }

  const handleError = (err, defaultMessage) => {
    if (err.response?.data) {
      const { message, code, errors } = err.response.data
      error.value = {
        message: message || defaultMessage,
        code,
        errors
      }
      console.error('Category operation failed:', error.value)
    } else {
      error.value = {
        message: err.message || defaultMessage,
        code: 'UNKNOWN_ERROR'
      }
      console.error(defaultMessage, err)
    }
    throw err
  }

  // Category operations
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const response = await api.get('/categories')
      categories.value = response.data
    } catch (err) {
      handleError(err, 'Error fetching categories')
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryData) {
    try {
      checkAuth()
      const response = await api.post('/categories', categoryData)
      categories.value.push(response.data)
      return response.data
    } catch (err) {
      handleError(err, 'Error creating category')
    }
  }

  async function updateCategory(categoryId, categoryData) {
    try {
      checkAuth()
      const response = await api.put(`/categories/${categoryId}`, categoryData)
      const index = categories.value.findIndex(c => c.id === categoryId)
      if (index !== -1) {
        categories.value[index] = response.data
      }
      return response.data
    } catch (err) {
      handleError(err, 'Error updating category')
    }
  }

  async function deleteCategory(categoryId) {
    try {
      checkAuth()
      await api.delete(`/categories/${categoryId}`)
      categories.value = categories.value.filter(c => c.id !== categoryId)
    } catch (err) {
      handleError(err, 'Error deleting category')
    }
  }

  return {
    // State
    categories,
    loading,
    error,
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
