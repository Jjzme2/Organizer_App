<template>
  <div class="tasks-view">
    <header class="tasks-header">
      <div class="header-content">
        <h1>My Tasks</h1>
        <button @click="showNewTaskForm = true" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Task
        </button>
      </div>
    </header>

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
        <TaskList
          title="To Do"
          :tasks="incompleteTasks"
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
        </TaskList>

        <TaskList
          title="Completed"
          :tasks="completedTasks"
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
        </TaskList>
      </div>
    </main>

    <!-- Task Form Modal -->
    <Teleport to="body">
      <div v-if="showNewTaskForm" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editingTask ? 'Edit Task' : 'New Task' }}</h2>
            <button class="btn close-btn" @click="closeModal">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="task-form">
            <div class="form-group">
              <label for="taskName">Task Name</label>
              <input
                id="taskName"
                v-model="taskForm.name"
                type="text"
                required
                placeholder="What needs to be done?"
                :disabled="submitting"
              />
            </div>

            <div class="form-group">
              <label for="taskDescription">Description (Optional)</label>
              <textarea
                id="taskDescription"
                v-model="taskForm.description"
                rows="3"
                placeholder="Add more details about this task..."
                :disabled="submitting"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="taskDueDate">Due Date (Optional)</label>
              <input
                id="taskDueDate"
                v-model="taskForm.dueDate"
                type="datetime-local"
                :disabled="submitting"
              />
            </div>

            <div class="form-group">
              <label for="taskNotes">Notes</label>
              <textarea
                id="taskNotes"
                v-model="taskForm.notes"
                rows="4"
                placeholder="Add any additional notes or details..."
                :disabled="submitting"
                class="notes-input"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn" @click="closeModal" :disabled="submitting">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="loading-spinner"></span>
                {{ editingTask ? 'Save Changes' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import TaskList from '../components/TaskList.vue'
import MessageBox from '../components/MessageBox.vue'

const taskStore = useTaskStore()
const { loading, error, incompleteTasks, completedTasks } = storeToRefs(taskStore)

const showNewTaskForm = ref(false)
const submitting = ref(false)
const editingTask = ref(null)
const showError = ref(true)

const taskForm = ref({
  name: '',
  description: '',
  dueDate: '',
  notes: ''
})

onMounted(() => {
  taskStore.fetchTasks()
})

function closeModal() {
  showNewTaskForm.value = false
  editingTask.value = null
  taskForm.value = {
    name: '',
    description: '',
    dueDate: '',
    notes: ''
  }
}

function editTask(task) {
  editingTask.value = task
  taskForm.value = {
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    notes: task.notes || ''
  }
  showNewTaskForm.value = true
}

async function handleSubmit() {
  if (!taskForm.value.name.trim()) return

  submitting.value = true
  try {
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, taskForm.value)
    } else {
      await taskStore.createTask(taskForm.value)
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

  // Add transition state
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
    // Remove transition state after a delay
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

.tasks-header {
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

.task-form {
  padding: var(--spacing-lg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.notes-input {
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
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
