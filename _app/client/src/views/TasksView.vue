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
          @update-priority="handlePriorityChange"
          @update-status="handleStatusChange"
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
          @update-priority="handlePriorityChange"
          @update-status="handleStatusChange"
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
          :submitting="submitting"
          :is-editing="!!editingTask"
          @submit="handleTaskSubmit"
          @cancel="editingTask = null"
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
import { useTaskStore } from '@/stores/tasks'
import { useMessageStore } from '@/stores/messages'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/modals/BaseModal.vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import CategoryManagement from '@/components/CategoryManagement.vue'
import PaginatedTaskList from '@/components/pagination/TaskList_Paginated.vue'
import QuoteBanner from '@/components/Quotes/QuoteBanner.vue'
import MessageBox from '@/components/MessageBox.vue'

const taskStore = useTaskStore()
const messageStore = useMessageStore()
const route = useRoute()

const showAddTaskModal = ref(false)
const showCategoryModal = ref(false)
const editingTask = ref(null)
const error = ref(null)
const submitting = ref(false)

// Computed properties for task lists
const incompleteTasks = computed(() => taskStore.incompleteTasks)
const recentlyCompletedTasks = computed(() => taskStore.recentlyCompletedTasks)

// Task handlers
async function handleTaskComplete(taskId) {
  try {
    await taskStore.toggleTaskComplete(taskId)
    const task = taskStore.getTaskById(taskId)
    if (task.completed) {
      messageStore.success('Task marked as complete!', 'Task Updated', { position: 'bottom-right' })
    } else {
      messageStore.info('Task marked as incomplete', 'Task Updated', { position: 'bottom-right' })
    }
  } catch (err) {
    error.value = 'Failed to update task status'
    messageStore.error('Failed to update task status', 'Error')
  }
}

async function handlePriorityChange(taskId, priority) {
  try {
    await taskStore.updateTask(taskId, { priority })
    messageStore.success('Task priority updated')
  } catch (err) {
    messageStore.error('Failed to update task priority')
  }
}

async function handleStatusChange(taskId, status) {
  try {
    await taskStore.updateTask(taskId, { status })
    messageStore.success('Task status updated')
  } catch (err) {
    messageStore.error('Failed to update task status')
  }
}

async function handleAddNote(taskId, note) {
  try {
    await taskStore.updateTask(taskId, {
      notes: [...(taskStore.getTaskById(taskId)?.notes || []), {
        id: Date.now().toString(),
        content: note,
        createdAt: new Date().toISOString()
      }]
    })
    messageStore.success('Note added successfully')
  } catch (err) {
    messageStore.error('Failed to add note')
  }
}

function handleTaskEdit(task) {
  editingTask.value = task
  showAddTaskModal.value = true
}

async function handleTaskDelete(taskId) {
  try {
    await taskStore.deleteTask(taskId)
    messageStore.warning('Task has been deleted', 'Task Deleted', { position: 'bottom-right' })
  } catch (err) {
    error.value = 'Failed to delete task'
    messageStore.error('Failed to delete task', 'Error')
  }
}

async function handleTaskSubmit(taskData) {
  submitting.value = true
  try {
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, taskData)
    } else {
      await taskStore.createTask(taskData)
    }
    editingTask.value = null
    messageStore.success('Task saved successfully')
  } catch (err) {
    error.value = 'Failed to save task'
    messageStore.error('Failed to save task', 'Error')
  } finally {
    submitting.value = false
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
    if (route.meta.showNewTask) {
      showAddTaskModal.value = true
    }
  } catch (err) {
    error.value = 'Failed to load tasks'
    messageStore.error('Failed to load your tasks', 'Error')
  }
})
</script>