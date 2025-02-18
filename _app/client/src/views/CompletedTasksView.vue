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
          <h1>Completed Tasks</h1>
        </div>
        <div class="header-actions">
          <div class="action-group">
            <label class="toggle-label">
              <input
                type="checkbox"
                v-model="showArchived"
                class="toggle-input"
              >
              Show Archived
            </label>
            <select v-model="sortBy" class="sort-select">
              <option value="completedAt-desc">Recently Completed</option>
              <option value="completedAt-asc">Oldest Completed</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
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
          @delete="deleteTask"
        />
      </TransitionGroup>

      <div v-if="!sortedTasks.length" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        <p>No completed tasks yet</p>
        <router-link to="/tasks" class="btn btn-primary">Return to Tasks</router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import TaskCard from '../components/cards/TaskCard.vue'

const taskStore = useTaskStore()
const { loading, completedTasks, deactivatedTasks } = storeToRefs(taskStore)

const sortBy = ref('completedAt-desc')
const showArchived = ref(false)

const sortedTasks = computed(() => {
  const tasks = showArchived.value
    ? [...completedTasks.value, ...deactivatedTasks.value]
    : completedTasks.value

  switch (sortBy.value) {
    case 'completedAt-desc':
      return [...tasks].sort((a, b) => {
        const dateA = new Date(a.completedAt).getTime()
        const dateB = new Date(b.completedAt).getTime()
        return dateB - dateA
      })
    case 'completedAt-asc':
      return [...tasks].sort((a, b) => {
        const dateA = new Date(a.completedAt).getTime()
        const dateB = new Date(b.completedAt).getTime()
        return dateA - dateB
      })
    case 'title-asc':
      return [...tasks].sort((a, b) => 
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      )
    case 'title-desc':
      return [...tasks].sort((a, b) => 
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      )
    default:
      return tasks
  }
})

async function toggleTaskComplete(taskId) {
  await taskStore.toggleTaskComplete(taskId)
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return
  await taskStore.deleteTask(taskId)
}
</script>