<template>
  <BasePaginatedList title="Tasks" :items="tasks" :itemsPerPage="defaultLimit">
    <template #item="{ item }">
      <TaskCard
        :task="item"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @updateStatus="$emit('updateStatus', $event)"
        @updatePriority="$emit('updatePriority', $event)"
        @addNote="$emit('addNote', $event)"
      />
    </template>
    <template #empty>
      <p>No tasks found.</p>
    </template>
  </BasePaginatedList>
</template>

<script setup>
import { defineProps } from 'vue';
import BasePaginatedList from './BasePaginatedList.vue';
import TaskCard from '../cards/TaskCard.vue';

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
    default: 5
  }
});
</script>

<style scoped>
/* Add any specific styles for PaginatedTaskList here */
</style>
