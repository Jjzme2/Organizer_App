<template>
  <section class="task-list-section">
    <div class="section-header">
      <h2>
        {{ title }}
        <span class="task-count">({{ tasks.length }})</span>
      </h2>
      <div class="section-actions" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <TransitionGroup
      name="task-list"
      tag="div"
      class="task-list"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
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
import TaskCard from './cards/TaskCard.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>

<style scoped>
.task-list-section {
  background: var(--color-surface-dark);
  border-radius: 20px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-count {
  font-size: 0.875rem;
  font-weight: normal;
  color: var(--color-text-light);
}

.task-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.task-list::-webkit-scrollbar {
  width: 0.375rem;
}

.task-list::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: 9999px;
}

.task-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 9999px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

/* List Transitions */
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.task-list-leave-active {
  position: absolute;
}
</style>
