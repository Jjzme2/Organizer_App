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
import TaskCard from '../../components/cards/TaskCard.vue'

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