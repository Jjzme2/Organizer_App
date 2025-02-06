<template>
  <header class="tasks-header">
    <div class="header-content">
      <h1>My Tasks</h1>
      <div class="header-actions">
        <button @click="$emit('manage-categories')" class="btn">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M21,12L4,2V22L21,12M6,17.59L6,6.41L17,12L6,17.59Z"/>
          </svg>
          Categories
        </button>
        <button @click="$emit('add-task')" class="btn btn-primary">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Task
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['add-task', 'manage-categories'])
</script>

<style scoped>
.tasks-header {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
  margin-right: var(--spacing-xs);
}

.btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-text {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-text:hover {
  text-decoration: underline;
}
</style>
