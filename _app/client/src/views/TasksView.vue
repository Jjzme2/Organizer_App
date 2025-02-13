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
      v-model:show="showAddTaskModal"
      :title="editingTask ? 'Edit Task' : 'New Task'"
      @close="closeTaskModal"
    >
      <template #default>
        <TaskForm
          :task="editingTask"
          @submit="handleTaskSubmit"
          @cancel="closeTaskModal"
        />
      </template>
    </BaseModal>

    <!-- Category Modal -->
    <BaseModal
      v-model:show="showCategoryModal"
      title="Manage Categories"
      @close="showCategoryModal = false"
    >
      <template #default>
        <CategoryManagement />
      </template>
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
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { useRoute, useRouter } from 'vue-router'
import PaginatedTaskList from '../components/pagination/TaskList_Paginated.vue'
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

const route = useRoute()
const router = useRouter()

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
    // Show new task modal if route meta indicates
    if (route.meta.showNewModal) {
      showAddTaskModal.value = true
      // Remove the meta flag from history
      router.replace({ name: 'tasks' })
    }
  } catch (err) {
    console.error('Error fetching tasks:', err)
  }
})
</script>