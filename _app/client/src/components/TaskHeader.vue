<template>
  <header class="tasks-header">
    <div class="header-content">
      <h1>My Tasks</h1>
      <button @click="$emit('add-task')" class="btn btn-primary">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Add Task
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['add-task'])
</script>

<style scoped>
.tasks-header {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}
</style> 