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
import { ref, onMounted } from 'vue'
import ArticleCard from './cards/ArticleCard.vue'

const title = 'Articles'
const articles = ref([])

// Placeholder for fetching articles – replace with actual API/service call if needed
onMounted(async () => {
  // Example: articles.value = await fetchArticles()
  articles.value = [
    { id: 1, title: 'Article One', content: 'Content for article one.' },
    { id: 2, title: 'Article Two', content: 'Content for article two.' }
  ]
})
</script>

<style scoped>
.articles-list-section {
  background: var(--color-surface-dark);
  border-radius: 20px;
  padding: 1.5rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.article-count {
  font-size: 0.875rem;
  font-weight: normal;
  color: var(--color-text-light);
}
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}
</style>
