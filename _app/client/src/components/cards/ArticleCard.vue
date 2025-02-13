<template>
  <BaseCard
    :title="article.title"
    :show-default-actions="true"
    :custom-class="article.isPublic ? 'public-content' : 'private-content'"
    @edit="$emit('edit', article)"
    @delete="$emit('delete', article.id)"
  >
    <template #header-prefix>
      <span class="visibility-icon" :title="article.isPublic ? 'Public Article' : 'Private Article'">
        {{ article.isPublic ? '🌐' : '🔒' }}
      </span>
    </template>
    <template #body>
      <p class="article-content">{{ article.content }}</p>
    </template>
    <template #meta>
      <div class="article-meta">
        <span class="visibility-label" :class="{ 'public': article.isPublic }">
          {{ article.isPublic ? 'Public' : 'Private' }}
        </span>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';

defineProps({
  article: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>
