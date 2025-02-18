<template>
  <div class="tasks-view">
    <header class="view-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/tasks" class="back-link">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Tasks
          </router-link>
          <h1>Incomplete Tasks</h1>
        </div>
        <div class="header-actions">
          <select v-model="sortBy" class="sort-select">
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
          </select>
        </div>
      </div>
    </header>

    <main class="view-content">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">Loading tasks...</div>
      </div>

      <TransitionGroup
        name="task-list"
        tag="div"
        class="tasks-grid"
      >
        <TaskCard
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTaskComplete"
          @edit="editTask"
          @delete="deleteTask"
        />
      </TransitionGroup>

      <div v-if="!sortedTasks.length" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <p>No tasks to do</p>
        <router-link to="/tasks" class="btn btn-primary">Return to Tasks</router-link>
      </div>
    </main>

    <!-- Task Form Modal -->
    <BaseModal
      v-model:show="showEditForm"
      title="Edit Task"
    >
      <TaskForm
        :task="editingTask"
        :submitting="submitting"
        :is-editing="true"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import TaskCard from '../components/cards/TaskCard.vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import BaseModal from '../components/modals/BaseModal.vue'

const taskStore = useTaskStore()
const { loading, incompleteTasks } = storeToRefs(taskStore)

const sortBy = ref('dueDate-asc')
const showEditForm = ref(false)
const editingTask = ref(null)
const submitting = ref(false)

const sortedTasks = computed(() => {
  const tasks = [...incompleteTasks.value]
  const [field, direction] = sortBy.value.split('-')

  return tasks.sort((a, b) => {
    if (field === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
      return direction === 'desc' ? dateB - dateA : dateA - dateB
    } else if (field === 'title') {
      return direction === 'desc'
        ? b.title.toLowerCase().localeCompare(a.title.toLowerCase())
        : a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    } else if (field === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityA = priorityOrder[a.priority] || 0
      const priorityB = priorityOrder[b.priority] || 0
      return direction === 'desc'
        ? priorityB - priorityA
        : priorityA - priorityB
    }
    return 0
  })
})

function closeModal() {
  showEditForm.value = false
  editingTask.value = null
}

function editTask(task) {
  editingTask.value = task
  showEditForm.value = true
}

async function handleSubmit(formData) {
  submitting.value = true
  try {
    await taskStore.updateTask(editingTask.value.id, formData)
    closeModal()
  } catch (err) {
    console.error('Error updating task:', err)
  } finally {
    submitting.value = false
  }
}

async function toggleTaskComplete(taskId) {
  await taskStore.toggleTaskComplete(taskId)
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return
  await taskStore.deleteTask(taskId)
}
</script>