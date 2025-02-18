<template>
  <section class="articles-list-section">
    <div class="section-header">
      <h2>
        {{ title }}
        <span class="article-count">({{ articles.length }})</span>
      </h2>
      <div class="section-actions" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    <TransitionGroup name="list" tag="div" class="articles-list">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @edit="$emit('edit', article)"
        @delete="$emit('delete', article.id)"
      />
    </TransitionGroup>
    <div v-if="!articles.length" class="empty-state">
      <slot name="empty">
        <p>No articles found</p>
      </slot>
    </div>
  </section>
</template>

<script setup>
import ArticleCard from './cards/ArticleCard.vue'

defineProps({
  articles: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Articles'
  }
})

defineEmits(['edit', 'delete'])
</script>
