import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { useAuthStore } from './auth'
import api from '@/services/api'
import { reminderService } from '@/services/reminderService'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()
  const taskReminders = ref<any[]>([])

  // Computed properties
  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return 0
    })
  })

  const completedTasks = computed(() => sortedTasks.value.filter(task => task.completed))
  const incompleteTasks = computed(() => sortedTasks.value.filter(task => !task.completed))
  const deactivatedTasks = computed(() => sortedTasks.value.filter(task => task.status === 'deactivated'))
  const recentlyCompletedTasks = computed(() => {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    return tasks.value.filter(task => {
      if (!task.completedAt) return false
      const completedAt = new Date(task.completedAt)
      return task.completed && completedAt > twentyFourHoursAgo
    })
  })

  const tasksByCategory = computed(() => {
    const grouped = tasks.value.reduce((acc, task) => {
      const category = task.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(task)
      return acc
    }, {} as Record<string, Task[]>)
    
    // Sort tasks within each category
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        return 0
      })
    })
    
    return grouped
  })

  // Helper functions
  const checkAuth = () => {
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication required')
    }
  }

  const handleError = (err: unknown, defaultMessage: string) => {
    if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = defaultMessage
    }
    throw err
  }

  // Actions
  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const response = await api.get('/tasks')
      tasks.value = response.data
    } catch (err) {
      handleError(err, 'Failed to fetch tasks')
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const response = await api.post('/tasks', {
        ...taskData,
        completed: false,
        priority: taskData.priority || 'low',
        status: 'pending'
      })
      const newTask = response.data
      tasks.value.push(newTask)
      return newTask
    } catch (err) {
      handleError(err, 'Failed to create task')
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const response = await api.put(`/tasks/${id}`, updates)
      const updatedTask = response.data
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err) {
      handleError(err, 'Failed to update task')
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err) {
      handleError(err, 'Failed to delete task')
    } finally {
      loading.value = false
    }
  }

  async function toggleTaskComplete(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return updateTask(id, { 
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    })
  }

  async function updateTaskPriority(id: string, priority: Task['priority']) {
    return updateTask(id, { priority })
  }

  async function updateTaskStatus(id: string, status: Task['status']) {
    return updateTask(id, { status })
  }

  async function updateTaskCategory(id: string, category: string | null) {
    return updateTask(id, { category })
  }

  async function getTasksByCategory(category: string) {
    return tasks.value.filter(task => 
      category === 'Uncategorized' 
        ? !task.category 
        : task.category === category
    )
  }

  async function bulkUpdateTaskCategory(taskIds: string[], category: string | null) {
    loading.value = true
    error.value = null
    try {
      checkAuth()
      const updates = await Promise.all(
        taskIds.map(id => updateTask(id, { category }))
      )
      return updates
    } catch (err) {
      handleError(err, 'Failed to update task categories')
    } finally {
      loading.value = false
    }
  }

  async function addTaskNote(id: string, note: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    const notes = task.notes || []
    return updateTask(id, { 
      notes: [...notes, { 
        id: Date.now().toString(),
        content: note,
        createdAt: new Date().toISOString()
      }]
    })
  }

  async function deactivateTask(id: string) {
    return updateTask(id, { status: 'deactivated' })
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find(t => t.id === id)
  }

  async function createTaskWithReminder(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, reminderTime: string) {
    const task = await createTask(taskData)
    if (reminderTime) {
      await reminderService.createReminder(task.id, reminderTime)
    }
    return task
  }

  async function fetchTaskReminders(taskId: string) {
    const reminders = await reminderService.getRemindersForTask(taskId)
    taskReminders.value = reminders
  }

  return {
    // State
    tasks,
    loading,
    error,
    taskReminders,
    // Computed
    sortedTasks,
    completedTasks,
    incompleteTasks,
    recentlyCompletedTasks,
    deactivatedTasks,
    tasksByCategory,
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createTaskWithReminder,
    fetchTaskReminders,
    updateTaskPriority,
    updateTaskStatus,
    updateTaskCategory,
    getTasksByCategory,
    bulkUpdateTaskCategory,
    addTaskNote,
    deactivateTask,
    getTaskById
  }
})
