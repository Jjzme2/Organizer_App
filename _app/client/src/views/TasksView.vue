<template>
  <div class="tasks-view">
    <TaskHeader @add-task="showNewTaskForm = true" />

    <MessageBox
      v-if="error"
      type="error"
      :message="error"
      title="Error Loading Tasks"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import PaginatedTaskList from '../components/PaginatedTaskList.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskHeader from '../components/TaskHeader.vue'
import MessageBox from '../components/MessageBox.vue'
import BaseModal from '../components/ui/BaseModal.vue'

const taskStore = useTaskStore()
const { loading, error, incompleteTasks, completedTasks } = storeToRefs(taskStore)

const showNewTaskForm = ref(false)
const submitting = ref(false)
const editingTask = ref(null)
const showError = ref(true)

onMounted(() => {
  taskStore.fetchTasks()
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
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, formData)
    } else {
      await taskStore.createTask(formData)
    }
    closeModal()
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
  } catch (err) {
    console.error('Error toggling task:', err)
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
  } catch (err) {
    console.error('Error deleting task:', err)
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 50;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  padding: var(--spacing-xs);
  color: var(--color-text-light);
}

.close-btn:hover {
  color: var(--color-text);
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
