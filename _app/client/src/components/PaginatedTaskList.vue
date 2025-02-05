<template>
  <section class="task-list-section">
    <div class="section-header">
      <h2>
        {{ title }}
        <span class="task-count">({{ tasks.length }})</span>
      </h2>
      <div class="section-actions">
        <slot name="actions" />
        <button
          v-if="tasks.length > defaultLimit"
          class="btn btn-text"
          @click="handleShowAll"
        >
          {{ showAll ? 'Show Less' : `Show All (${tasks.length})` }}
        </button>
      </div>
    </div>

    <TransitionGroup
      name="task-list"
      tag="div"
      class="task-list"
    >
      <TaskCard
        v-for="task in displayedTasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @updateStatus="$emit('updateStatus', $event)"
        @updatePriority="$emit('updatePriority', $event)"
        @addNote="$emit('addNote', $event)"
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
import TaskCard from './TaskCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    default: 3
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['completed', 'incomplete'].includes(value)
  }
})

defineEmits(['toggle', 'edit', 'delete', 'updateStatus', 'updatePriority', 'addNote'])

const showAll = ref(false)

const displayedTasks = computed(() => {
  if (showAll.value) return props.tasks
  return props.tasks.slice(0, props.defaultLimit)
})

function handleShowAll() {
  if (!showAll.value) {
    router.push(`/tasks/${props.type}`)
  } else {
    showAll.value = false
  }
}
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

.section-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-text {
  color: var(--color-primary);
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-text:hover {
  text-decoration: underline;
}
</style>
