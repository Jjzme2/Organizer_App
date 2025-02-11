<template>
  <div class="tasks-view">
    <header class="view-header">
      <div class="container">
        <div class="header-content">
          <h1>Tasks</h1>
          <div class="header-actions">
            <button @click="showAddTaskModal = true" class="btn btn-primary">
              Add Task
            </button>
            <button @click="showCategoryModal = true" class="btn btn-secondary">
              Manage Categories
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="view-content container">
      <!-- Quote Banner -->
      <QuoteBanner class="quote-banner" />

      <!-- Task Lists -->
      <div class="task-lists">
        <!-- Incomplete Tasks -->
        <PaginatedTaskList
          title="Active Tasks"
          :tasks="incompleteTasks"
          :defaultLimit="4"
          @toggle-complete="handleTaskComplete"
          @update-priority="handlePriorityUpdate"
          @update-status="handleStatusUpdate"
          @add-note="handleAddNote"
          @edit="handleTaskEdit"
          @delete="handleTaskDelete"
        >
          <template #empty>
            <div class="empty-state">
              <p>No active tasks</p>
              <button @click="showAddTaskModal = true" class="btn btn-primary">
                Create Task
              </button>
            </div>
          </template>
        </PaginatedTaskList>

        <!-- Completed Tasks -->
        <PaginatedTaskList
          title="Recently Completed"
          :tasks="recentlyCompletedTasks"
          :defaultLimit="4"
          @toggle-complete="handleTaskComplete"
          @update-priority="handlePriorityUpdate"
          @update-status="handleStatusUpdate"
          @add-note="handleAddNote"
          @edit="handleTaskEdit"
          @delete="handleTaskDelete"
        >
          <template #empty>
            <div class="empty-state">
              <p>No completed tasks yet</p>
            </div>
          </template>
        </PaginatedTaskList>
      </div>
    </main>

    <!-- Task Modal -->
    <BaseModal
      v-if="showAddTaskModal"
      @close="closeTaskModal"
      :show="showAddTaskModal"
      :title="editingTask ? 'Edit Task' : 'New Task'"
    >
      <TaskForm
        :task="editingTask"
        @submit="handleTaskSubmit"
        @cancel="closeTaskModal"
      />
    </BaseModal>

    <!-- Category Modal -->
    <BaseModal
      v-if="showCategoryModal"
      @close="showCategoryModal = false"
      :show="showCategoryModal"
      title="Manage Categories"
    >
      <CategoryManagement />
    </BaseModal>

    <!-- Message Box for Errors -->
    <MessageBox
      v-if="error"
      :message="error"
      type="error"
      @close="error = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
import PaginatedTaskList from '../components/PaginatedTaskList.vue'
import TaskForm from '../components/forms/TaskForm.vue'
import MessageBox from '../components/MessageBox.vue'
import BaseModal from '../components/modals/BaseModal.vue'
import CategoryManagement from '../components/CategoryManagement.vue'
import QuoteBanner from '../components/Quotes/QuoteBanner.vue'

const taskStore = useTaskStore()
const error = ref(null)
const showAddTaskModal = ref(false)
const showCategoryModal = ref(false)
const editingTask = ref(null)

// Computed properties
const incompleteTasks = computed(() => taskStore.incompleteTasks)
const completedTasks = computed(() => taskStore.completedTasks)
const recentlyCompletedTasks = computed(() => taskStore.recentlyCompletedTasks)

// Task handlers
async function handleTaskComplete(taskId) {
  try {
    await taskStore.toggleTaskComplete(taskId)
  } catch (err) {
    error.value = 'Failed to update task completion status'
  }
}

async function handlePriorityUpdate({ id, priority }) {
  try {
    await taskStore.updateTaskPriority({ id, priority })
  } catch (err) {
    error.value = 'Failed to update task priority'
  }
}

async function handleStatusUpdate({ id, status }) {
  try {
    await taskStore.updateTaskStatus({ id, status })
  } catch (err) {
    error.value = 'Failed to update task status'
  }
}

async function handleAddNote({ id, note }) {
  try {
    await taskStore.addTaskNote({ id, note })
  } catch (err) {
    error.value = 'Failed to add note to task'
  }
}

function handleTaskEdit(task) {
  editingTask.value = { ...task }
  showAddTaskModal.value = true
}

async function handleTaskDelete(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await taskStore.deleteTask(taskId)
    } catch (err) {
      error.value = 'Failed to delete task'
    }
  }
}

async function handleTaskSubmit(taskData) {
  try {
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, taskData)
    } else {
      await taskStore.createTask(taskData)
    }
    closeTaskModal()
  } catch (err) {
    error.value = 'Failed to save task'
  }
}

function closeTaskModal() {
  showAddTaskModal.value = false
  editingTask.value = null
}

onMounted(async () => {
  try {
    await taskStore.fetchTasks()
  } catch (err) {
    error.value = 'Failed to load tasks'
  }
})
</script>

<style scoped>
.tasks-view {
  min-height: 100vh;
  padding: 2rem 0;
}

.view-header {
  margin-bottom: 2rem;
  background: var(--color-surface);
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.quote-banner {
  margin-bottom: 2rem;
}

.task-lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.empty-state p {
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .task-lists {
    grid-template-columns: 1fr;
  }
}
</style>
