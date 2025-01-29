import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import api from '../services/api'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      // Sort by completion status first
      if (a.isComplete !== b.isComplete) {
        return a.isComplete ? 1 : -1
      }
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      // Tasks with due dates come before tasks without
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      // Finally, sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  })

  const incompleteTasks = computed(() => sortedTasks.value.filter((task) => !task.isComplete))
  const completedTasks = computed(() => sortedTasks.value.filter((task) => task.isComplete))

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Not authenticated')
      }
      const response = await api.get('/tasks')
      console.log("Data: ", response.data);
      tasks.value = response.data
    } catch (err) {
      error.value = err.message || 'Error fetching tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData) {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Not authenticated')
      }
      const response = await api.post('/tasks', {
        name: taskData.name,
        description: taskData.description,
        dueDate: taskData.dueDate,
        notes: taskData.notes,
        isComplete: false,
        priority: taskData.priority || 'low',
        status: taskData.status || 'pending',
      })
      tasks.value.push(response.data)
      return response.data
    } catch (error) {
      error.value = error.message || 'Error creating task'
      console.error('Error creating task:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateTask(taskId, taskData) {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Not authenticated')
      }
      const response = await api.put(`/tasks/${taskId}`, {
        name: taskData.name,
        description: taskData.description,
        dueDate: taskData.dueDate,
        notes: taskData.notes,
        isComplete: taskData.isComplete,
        priority: taskData.priority || 'low',
        status: taskData.status || 'pending',
      })
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (error) {
      error.value = error.message || 'Error updating task'
      console.error('Error updating task:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(taskId) {
    loading.value = true
    error.value = null
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Not authenticated')
      }
      await api.delete(`/tasks/${taskId}`)
      tasks.value = tasks.value.filter((t) => t.id !== taskId)
    } catch (err) {
      error.value = err.message || 'Error deleting task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleTaskComplete(taskId) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) {
      await updateTask(taskId, { isComplete: !task.isComplete })
    }
  }

  return {
    tasks,
    loading,
    error,
    sortedTasks,
    incompleteTasks,
    completedTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  }
})
