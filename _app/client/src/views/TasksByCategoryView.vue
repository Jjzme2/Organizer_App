<template>
  <div class="tasks-by-category-view">
    <div class="view-header">
      <h1>Tasks by Category</h1>
      <div class="actions">
        <button class="btn btn-primary" @click="showAddTaskModal = true">
          <i class="fas fa-plus"></i> Add Task
        </button>
      </div>
    </div>

    <div class="category-filters">
      <div class="filter-group">
        <label class="form-label">Show Status:</label>
        <div class="btn-group">
          <button
            v-for="status in ['all', 'pending', 'completed']"
            :key="status"
            class="btn"
            :class="[
              'btn-outline-primary',
              statusFilter === status ? 'active' : ''
            ]"
            @click="statusFilter = status"
          >
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label class="form-label">Sort By:</label>
        <select v-model="sortBy" class="form-select">
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="name">Name</option>
          <option value="createdAt">Created Date</option>
        </select>
      </div>
    </div>

    <TasksByCategory 
      :filter-status="statusFilter"
      :sort-by="sortBy"
    />

    <TaskFormModal
      v-if="showAddTaskModal"
      @close="showAddTaskModal = false"
      @submit="handleAddTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import TasksByCategory from '@/components/TasksByCategory.vue'
import TaskFormModal from '@/components/modals/TaskFormModal.vue'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const showAddTaskModal = ref(false)
const statusFilter = ref('all')
const sortBy = ref('dueDate')

async function handleAddTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await taskStore.createTask(taskData)
    showAddTaskModal.value = false
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}
</script>

<style scoped>
.tasks-by-category-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--heading-color);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-label {
  margin: 0;
  font-weight: 500;
  white-space: nowrap;
}

.btn-group {
  display: flex;
  gap: 0.25rem;
}

.form-select {
  min-width: 150px;
}

@media (max-width: 768px) {
  .tasks-by-category-view {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .category-filters {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
