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
