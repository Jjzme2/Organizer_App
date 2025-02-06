<template>
  <div class="tasks-view">
    <TaskHeader
      @add-task="showNewTaskForm = true"
      @manage-categories="showCategoryModal = true"
    />

    <MessageBox
      v-if="error"
      type="error"
      :message="error"
      :title="getErrorTitle(error)"
      dismissible
      v-model:show="showError"
    />

    <main class="view-content">
      <div class="tasks-content">
        <PaginatedTaskList
          :title="`Active Tasks (${incompleteTasks.length})`"
          :tasks="activeTasks"
          type="incomplete"
          :defaultLimit="5"
          @toggle="toggleTaskComplete"
          @edit="editTask"
          @delete="deleteTask"
        >
          <template #actions>
            <router-link to="/tasks/incomplete" class="btn btn-text">
              {{ showAllText }}
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </router-link>
          </template>
          <template #empty>
            <div class="tasks-empty">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <p>No active tasks</p>
              <button class="btn btn-primary" @click="showNewTaskForm = true">
                Create Task
              </button>
            </div>
          </template>
        </PaginatedTaskList>

        <!-- Recently Completed Tasks -->
        <TaskList
          :title="`Recently Completed`"
          :tasks="recentlyCompletedTasks"
          @toggle="toggleTaskComplete"
          @delete="deleteTask"
        >
          <template #actions>
            <router-link to="/tasks/completed" class="btn btn-text">
              {{ showAllText }}
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </router-link>
          </template>
          <template #empty>
            <div class="tasks-empty">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <p>Let's get some tasks completed!</p>
            </div>
          </template>
        </TaskList>
      </div>
    </main>

    <!-- Task Form Modal -->
    <BaseModal
      v-model:show="showNewTaskForm"
      :title="editingTask ? 'Edit Task' : 'New Task'"
    >
      <TaskForm
        :task="editingTask"
        :submitting="submitting"
        :is-editing="!!editingTask"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </BaseModal>

    <!-- Category Management Modal -->
    <BaseModal
      v-model:show="showCategoryModal"
      title="Manage Categories"
    >
      <CategoryManagement />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { useQuoteStore } from '../stores/quote'
import { storeToRefs } from 'pinia'
import PaginatedTaskList from '../components/PaginatedTaskList.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskHeader from '../components/TaskHeader.vue'
import MessageBox from '../components/MessageBox.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import CategoryManagement from '../components/CategoryManagement.vue'
import TaskList from '../components/TaskList.vue'
import QuoteBanner from '../components/Quotes/QuoteBanner.vue'

const taskStore = useTaskStore()
const quoteStore = useQuoteStore()
const { loading, error, incompleteTasks, recentlyCompletedTasks, completedTasks } = storeToRefs(taskStore)
const { randomQuote } = storeToRefs(quoteStore)

const showNewTaskForm = ref(false)
const showCategoryModal = ref(false)
const submitting = ref(false)
const editingTask = ref(null)
const showError = ref(true)

const activeTasks = computed(() => incompleteTasks.value)

const showAllText = computed(() => 'Show All')

const getErrorTitle = (err) => {
  if (typeof err === 'object' && err !== null) {
    switch (err.code) {
      case 'AUTHENTICATION_ERROR':
        return 'Authentication Error'
      case 'VALIDATION_ERROR':
        return 'Validation Error'
      case 'TASK_FETCH_ERROR':
        return 'Error Loading Tasks'
      case 'TASK_CREATE_ERROR':
        return 'Error Creating Task'
      case 'TASK_UPDATE_ERROR':
        return 'Error Updating Task'
      default:
        return 'Operation Failed'
    }
  }
  return 'Error'
}

onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    quoteStore.fetchRandomQuote()
  ])
})

function closeModal() {
  showNewTaskForm.value = false
  editingTask.value = null
}

function editTask(task) {
  editingTask.value = task
  showNewTaskForm.value = true
}

async function handleSubmit(formData) {
  submitting.value = true
  try {
    let task
    if (editingTask.value) {
      task = await taskStore.updateTask(editingTask.value.id, formData)
    } else {
      task = await taskStore.createTask(formData)
    }
    closeModal()
    return task
  } catch (err) {
    console.error('Error submitting task:', err)
  } finally {
    submitting.value = false
  }
}

async function toggleTaskComplete(taskId) {
  const task = incompleteTasks.value.find(t => t.id === taskId)
  if (!task) return

  if (task.isComplete) {
    task.isUncompleting = true
  } else {
    task.isCompleting = true
  }

  try {
    await taskStore.toggleTaskComplete(taskId)
  } catch {
    // Error is already handled by the store
  } finally {
    setTimeout(() => {
      task.isCompleting = false
      task.isUncompleting = false
    }, 500)
  }
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    await taskStore.deleteTask(taskId)
  } catch {
    // Error is already handled by the store
  }
}

const fetchNewRandomQuote = () => {
  quoteStore.fetchRandomQuote()
}
</script>

<style scoped>
.tasks-view {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.view-content {
  flex: 1;
  position: relative;
  padding: 0 var(--spacing-lg);
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.tasks-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.tasks-empty {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-light);
  background: var(--color-surface);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  margin: var(--spacing-md);
}

.tasks-empty p {
  margin-bottom: var(--spacing-md);
  font-size: 1.125rem;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.empty-icon {
  width: 48px;
  height: 48px;
  fill: currentColor;
  margin-bottom: var(--spacing-md);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.btn-text:hover {
  color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .view-content {
    padding: 0 var(--spacing-md);
  }
}

.quote-banner {
  margin-bottom: var(--spacing-lg);
}
</style>
