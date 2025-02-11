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
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
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

  const [field, direction] = sortBy.value.split('-')

  return tasks.sort((a, b) => {
    if (field === 'completedAt') {
      const dateA = new Date(a.completedAt).getTime()
      const dateB = new Date(b.completedAt).getTime()
      return direction === 'desc' ? dateB - dateA : dateA - dateB
    } else if (field === 'name') {
      return direction === 'desc'
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name)
    }
    return 0
  })
})

async function toggleTaskComplete(taskId) {
  await taskStore.toggleTaskComplete(taskId)
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return
  await taskStore.deleteTask(taskId)
}
</script>

<style scoped>
.view-header {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-light);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-text);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.sort-select {
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}

.empty-icon {
  width: 48px;
  height: 48px;
  fill: currentColor;
  margin-bottom: var(--spacing-md);
}

/* List Transitions */
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.task-list-leave-active {
  position: absolute;
}

.action-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text);
  cursor: pointer;
}

.toggle-input {
  margin: 0;
}
</style>
