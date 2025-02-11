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

  const incompleteTasks = computed(() =>
    sortedTasks.value.filter(task => !task.isComplete && task.isActive)
  )

  const completedTasks = computed(() =>
    sortedTasks.value.filter(task => task.isComplete)
  )

  const recentlyCompletedTasks = computed(() =>
    completedTasks.value
      .slice()
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 3)
  )

  const archivedTasks = computed(() =>
    sortedTasks.value.filter(task => !task.isActive)
  )

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
    loading.value = true
    error.value = null
    try {
      checkAuth()
      console.log('Updating task:', taskId, taskData) // Debug log
      const response = await api.put(`/tasks/${taskId}`, taskData)
      console.log('Update response:', response.data) // Debug log
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Error updating task:', err) // Debug log
      handleError(err, 'Error updating task')
      throw err // Re-throw to handle in calling function
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
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        const isCompleting = !task.isComplete
        const updatedTask = await updateTask(taskId, {
          ...task,
          isComplete: isCompleting,
          status: isCompleting ? 'completed' : 'pending',
          isActive: !isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : null
        })
        // Update the task in the local state
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    } catch (err) {
      handleError(err, 'Failed to toggle task completion')
    } finally {
      loading.value = false
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
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const task = tasks.value.find(t => t.id === id)
      if (task) {
        const updatedTask = await updateTask(id, { ...task, status })
        // Update the task in the local state
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    } catch (err) {
      handleError(err, 'Failed to update task status')
    } finally {
      loading.value = false
    }
  }

  async function updateTaskPriority({ id, priority }) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const task = tasks.value.find(t => t.id === id)
      if (task) {
        const updatedTask = await updateTask(id, { ...task, priority })
        // Update the task in the local state
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    } catch (err) {
      handleError(err, 'Failed to update task priority')
    } finally {
      loading.value = false
    }
  }

  async function addTaskNote({ id, note }) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const task = tasks.value.find(t => t.id === id)
      if (task) {
        const notes = task.notes || []
        const updatedTask = await updateTask(id, {
          ...task,
          notes: [...notes, note]
        })
        // Update the task in the local state
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    } catch (err) {
      handleError(err, 'Failed to add note to task')
    } finally {
      loading.value = false
    }
  }

  async function deactivateTask(taskId) {
    try {
      const response = await api.put(`/tasks/${taskId}/deactivate`)
      const updatedTask = response.data

      // Update task in state
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      }
    } catch (err) {
      handleError(err, 'Error deactivating task')
    } finally {
      loading.value = false
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
    recentlyCompletedTasks,
    archivedTasks,
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
    addTaskNote,
    deactivateTask
  }
})
