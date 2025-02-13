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

