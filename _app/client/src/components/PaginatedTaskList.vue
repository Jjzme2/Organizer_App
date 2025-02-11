<template>
  <section class="task-list-section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <div class="section-actions">
        <button
          v-if="tasks.length > defaultLimit"
          class="btn btn-text"
          @click="handleShowAll"
        >
          {{ showAll ? 'Show Less' : `View All (${tasks.length})` }}
        </button>
      </div>
    </div>

    <TransitionGroup
      name="task-list"
      tag="div"
      class="task-grid"
    >
      <TaskCard
        v-for="task in displayedTasks"
        :key="task.id"
        :task="task"
        @toggle-complete="emit('toggle-complete', task.id)"
        @edit="emit('edit', task)"
        @delete="emit('delete', task.id)"
        @update-status="emit('update-status', $event)"
        @update-priority="emit('update-priority', $event)"
        @add-note="emit('add-note', $event)"
      />
    </TransitionGroup>

    <div v-if="!tasks.length" class="empty-state">
      <slot name="empty">
        <p>No tasks found</p>
      </slot>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import TaskCard from './cards/TaskCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  defaultLimit: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits([
  'toggle-complete',
  'edit',
  'delete',
  'update-status',
  'update-priority',
  'add-note'
])

const showAll = ref(false)

const displayedTasks = computed(() => {
  if (showAll.value) return props.tasks
  return props.tasks.slice(0, props.defaultLimit)
})

function handleShowAll() {
  showAll.value = !showAll.value
}
</script>

<style scoped>
.task-list-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0;
}

.task-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-primary);
  text-decoration: underline;
  padding: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-text:hover {
  color: var(--color-primary-dark);
}

/* Transition animations */
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
</style>
