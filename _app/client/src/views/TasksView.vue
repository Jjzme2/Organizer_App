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

    <main class="tasks-content" :class="{ 'is-loading': loading }">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">Loading tasks...</div>
      </div>

      <div class="tasks-grid">
        <PaginatedTaskList
          title="To Do"
          :tasks="incompleteTasks"
          type="incomplete"
          @toggle="toggleTaskComplete"
          @edit="editTask"
          @delete="deleteTask"
          @updateStatus="handleStatusUpdate"
          @updatePriority="handlePriorityUpdate"
          @addNote="handleAddNote"
        >
          <template #empty>
            <div class="tasks-empty">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/>
              </svg>
              <p>No tasks to do!</p>
              <button @click="showNewTaskForm = true" class="btn btn-primary">Add Your First Task</button>
            </div>
          </template>
        </PaginatedTaskList>

        <PaginatedTaskList
          title="Completed"
          :tasks="completedTasks"
          type="completed"
          @toggle="toggleTaskComplete"
          @edit="editTask"
          @delete="deleteTask"
          @updateStatus="handleStatusUpdate"
          @updatePriority="handlePriorityUpdate"
          @addNote="handleAddNote"
        >
          <template #empty>
            <div class="tasks-empty">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <p>No completed tasks yet</p>
            </div>
          </template>
        </PaginatedTaskList>

        <PaginatedTaskList
          v-if="deactivatedTasks.length"
          title="Archived Tasks"
          :tasks="deactivatedTasks"
          type="deactivated"
          @reactivate="reactivateTask"
          @delete="deleteTask"
        >
          <template #empty>
            <div class="tasks-empty">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27z"/>
              </svg>
              <p>No archived tasks</p>
            </div>
          </template>
        </PaginatedTaskList>
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
import { storeToRefs } from 'pinia'
import PaginatedTaskList from '../components/PaginatedTaskList.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskHeader from '../components/TaskHeader.vue'
import MessageBox from '../components/MessageBox.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import CategoryManagement from '../components/CategoryManagement.vue'

const taskStore = useTaskStore()
const { loading, error, incompleteTasks, completedTasks } = storeToRefs(taskStore)

const showNewTaskForm = ref(false)
const showCategoryModal = ref(false)
const submitting = ref(false)
const editingTask = ref(null)
const showError = ref(true)

const deactivatedTasks = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return completedTasks.value.filter(task => {
    const completedDate = new Date(task.completedAt)
    return completedDate < oneWeekAgo
  })
})

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

onMounted(() => {
  taskStore.fetchTasks()
  checkAndDeactivateTasks()
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
  const task = [...incompleteTasks.value, ...completedTasks.value].find(t => t.id === taskId)
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

async function handleStatusUpdate(data) {
  try {
    await taskStore.updateTaskStatus(data)
  } catch {
    // Error is already handled by the store
  }
}

async function handlePriorityUpdate(data) {
  try {
    await taskStore.updateTaskPriority(data)
  } catch {
    // Error is already handled by the store
  }
}

async function handleAddNote(data) {
  try {
    await taskStore.addTaskNote(data)
  } catch {
    // Error is already handled by the store
  }
}

async function reactivateTask(taskId) {
  try {
    await taskStore.reactivateTask(taskId)
  } catch (err) {
    console.error('Error reactivating task:', err)
  }
}

async function checkAndDeactivateTasks() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const tasksToDeactivate = completedTasks.value.filter(task => {
    const completedDate = new Date(task.completedAt)
    return completedDate < oneWeekAgo && !task.isDeactivated
  })

  for (const task of tasksToDeactivate) {
    await taskStore.deactivateTask(task.id)
  }
}
</script>

<style scoped>
.tasks-view {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.tasks-content {
  flex: 1;
  position: relative;
  padding: 0 var(--spacing-lg);
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
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

@media (max-width: 768px) {
  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .tasks-content {
    padding: 0 var(--spacing-md);
  }
}
</style>
