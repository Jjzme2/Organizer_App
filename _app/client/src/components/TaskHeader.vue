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