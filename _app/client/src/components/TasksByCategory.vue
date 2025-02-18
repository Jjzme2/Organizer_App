<template>
  <div class="tasks-by-category">
    <div v-for="(tasks, category) in taskStore.tasksByCategory" :key="category" class="category-group">
      <div class="category-header">
        <h3>{{ category }}</h3>
        <div class="category-stats">
          <span class="badge bg-primary">
            {{ tasks.length }} tasks
          </span>
          <span class="badge bg-success">
            {{ tasks.filter(t => t.completed).length }} completed
          </span>
        </div>
      </div>
      
      <div class="task-list">
        <TransitionGroup name="task-list">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @toggle-complete="toggleTaskComplete"
            @delete="deleteTask"
            @update="updateTask"
          />
        </TransitionGroup>
      </div>

      <div v-if="tasks.length === 0" class="no-tasks">
        <p class="text-muted">No tasks in this category</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/tasks'
import TaskCard from './TaskCard.vue'
import type { Task } from '@/types'

const taskStore = useTaskStore()

async function toggleTaskComplete(taskId: string) {
  await taskStore.toggleTaskComplete(taskId)
}

async function deleteTask(taskId: string) {
  await taskStore.deleteTask(taskId)
}

async function updateTask(taskId: string, updates: Partial<Task>) {
  await taskStore.updateTask(taskId, updates)
}
</script>

<style scoped>
.tasks-by-category {
  display: grid;
  gap: 2rem;
  padding: 1rem;
}

.category-group {
  background: var(--surface-color);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.category-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--heading-color);
}

.category-stats {
  display: flex;
  gap: 0.5rem;
}

.task-list {
  display: grid;
  gap: 1rem;
}

.no-tasks {
  text-align: center;
  padding: 2rem;
  background: var(--surface-secondary-color);
  border-radius: 0.25rem;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.task-list-move {
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .tasks-by-category {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
</style>
