<template>
  <BaseCard
    :title="jotting.title"
    :show-default-actions="true"
    :custom-class="jotting.isPublic ? 'public-content' : 'private-content'"
    @edit="$emit('edit', jotting)"
    @delete="$emit('delete', jotting.id)"
  >
    <template #header-prefix>
      <span class="visibility-icon" :title="jotting.isPublic ? 'Public Jotting' : 'Private Jotting'">
        {{ jotting.isPublic ? '🌐' : '🔒' }}
      </span>
    </template>
    <template #body>
      <p class="jotting-content">{{ jotting.content }}</p>
    </template>
    <template #meta>
      <div class="jotting-meta">
        <span class="visibility-label" :class="{ 'public': jotting.isPublic }">
          {{ jotting.isPublic ? 'Public' : 'Private' }}
        </span>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';

defineProps({
  jotting: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>

<style scoped>
.jotting-content {
  color: var(--color-text-secondary, #666);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

.visibility-icon {
  font-size: 1.1em;
  margin-right: 8px;
  opacity: 0.7;
}

.jotting-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85em;
  color: var(--color-text-secondary, #666);
}

.visibility-label {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--color-surface-variant, #f0f0f0);
  font-weight: 500;
}

.visibility-label.public {
  background-color: var(--color-primary-container, #e3f2fd);
  color: var(--color-primary, #1976d2);
}

:deep(.public-content) {
  border-left: 3px solid var(--color-primary, #1976d2);
}

:deep(.private-content) {
  border-left: 3px solid var(--color-surface-variant, #f0f0f0);
}
</style>
