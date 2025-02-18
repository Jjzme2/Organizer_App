<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ task ? 'Edit Task' : 'New Task' }}</h3>
        <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
      </div>
      
      <div class="modal-body">
        <TaskForm
          :task="task"
          :submitting="submitting"
          :is-editing="!!task"
          @submit="handleSubmit"
          @cancel="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import type { Task } from '@/types'

const props = defineProps<{
  task?: Task
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const submitting = ref(false)

async function handleSubmit(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  submitting.value = true
  try {
    emit('submit', taskData)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-color);
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--heading-color);
}

.modal-body {
  padding: 1rem;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
