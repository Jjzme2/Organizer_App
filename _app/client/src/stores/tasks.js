import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import api from '../services/api'
import { reminderService } from '../services/reminderService'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null) // Will now contain { message, code, errors? }
  const authStore = useAuthStore()
  const taskReminders = ref([])

  // Computed properties for task filtering and sorting
  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      if (a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate)
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  })

  const incompleteTasks = computed(() => sortedTasks.value.filter(task => !task.isComplete))
  const completedTasks = computed(() => sortedTasks.value.filter(task => task.isComplete))

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
      console.error('Task operation failed:', error.value)
    } else {
      error.value = {
        message: err.message || defaultMessage,
        code: 'UNKNOWN_ERROR'
      }
      console.error(defaultMessage, err)
    }
    throw err
  }

  // Task operations
  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const response = await api.get('/tasks')
      tasks.value = response.data
    } catch (err) {
      handleError(err, 'Error fetching tasks')
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData) {
    try {
      checkAuth()
      const response = await api.post('/tasks', {
        ...taskData,
        isComplete: false,
        priority: taskData.priority || 'low',
        status: 'pending'
      })
      tasks.value.push(response.data)
      return response.data
    } catch (err) {
      handleError(err, 'Error creating task')
    } finally {
      loading.value = false
    }
  }

  async function updateTask(taskId, taskData) {
    try {
      checkAuth()
      const response = await api.put(`/tasks/${taskId}`, taskData)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err) {
      handleError(err, 'Error updating task')
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(taskId) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      await api.delete(`/tasks/${taskId}`)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (err) {
      handleError(err, 'Error deleting task')
    } finally {
      loading.value = false
    }
  }

  async function toggleTaskComplete(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      const isCompleting = !task.isComplete
      await updateTask(taskId, {
        ...task,
        isComplete: isCompleting,
        status: isCompleting ? 'completed' : 'pending',
        isActive: !isCompleting,
        completedAt: isCompleting ? new Date().toISOString() : null
      })
    }
  }

  async function createTaskWithReminder(taskData, reminderTime) {
    const task = await createTask(taskData)
    if (reminderTime) {
      await reminderService.createReminder(task.id, reminderTime)
    }
    return task
  }

  async function fetchTaskReminders(taskId) {
    const reminders = await reminderService.getRemindersForTask(taskId)
    taskReminders.value = reminders
  }

  async function updateTaskStatus({ id, status }) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      return updateTask(id, { ...task, status })
    }
  }

  async function updateTaskPriority({ id, priority }) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      return updateTask(id, { ...task, priority })
    }
  }

  async function addTaskNote({ id, note }) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      const notes = task.notes || []
      return updateTask(id, {
        ...task,
        notes: [...notes, note]
      })
    }
  }

  return {
    // State
    tasks,
    loading,
    error,
    taskReminders,
    // Computed
    sortedTasks,
    incompleteTasks,
    completedTasks,
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createTaskWithReminder,
    fetchTaskReminders,
    updateTaskStatus,
    updateTaskPriority,
    addTaskNote
  }
})
