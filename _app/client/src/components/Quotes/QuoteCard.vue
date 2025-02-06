<template>
  <div class="quote-card" :class="{ 'is-favorite': quote.isFavorite }">
    <div class="quote-content">
      <div class="quote-text">
        "{{ quote.text }}"
      </div>
      <div class="quote-attribution">
        <span class="quote-author">— {{ quote.author }}</span>
        <span v-if="quote.source" class="quote-source">({{ quote.source }})</span>
      </div>
    </div>

    <div class="quote-footer">
      <span class="quote-category" :class="quote.category">
        {{ formatCategory(quote.category) }}
      </span>

      <div class="quote-actions">
        <button
          @click="$emit('toggle-favorite')"
          class="action-btn favorite-btn"
          :class="{ 'is-active': quote.isFavorite }"
          title="Toggle favorite"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path v-if="quote.isFavorite" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            <path v-else d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
          </svg>
        </button>
        <button
          @click="$emit('delete', quote.id)"
          class="action-btn delete-btn"
          title="Delete quote"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
        <button
          @click="$emit('edit', quote)"
          class="action-btn edit-btn"
          title="Edit quote"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Quote {
  id: string
  text: string
  author: string
  source?: string
  category: 'motivation' | 'success' | 'wisdom' | 'leadership' | 'personal_growth'
  isFavorite: boolean
}

defineProps<{
  quote: Quote
}>()

defineEmits(['toggle-favorite', 'delete', 'edit'])

const formatCategory = (category: string) => {
  return category.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
</script>

<style scoped>
.quote-card {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.quote-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.quote-content {
  margin-bottom: var(--spacing-md);
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.quote-attribution {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.quote-source {
  margin-left: var(--spacing-xs);
}

.quote-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.quote-category {
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background: var(--color-surface-hover);
}

.quote-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-surface-hover);
}

.favorite-btn {
  color: var(--color-text-light);
}

.favorite-btn.is-active {
  color: var(--color-danger);
}

.delete-btn {
  color: var(--color-text-light);
}

.delete-btn:hover {
  color: var(--color-danger);
}

.edit-btn {
  color: var(--color-text-light);
}

.edit-btn:hover {
  color: var(--color-danger);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Category colors */
.motivation { background: var(--color-success-light); color: var(--color-success); }
.success { background: var(--color-primary-light); color: var(--color-primary); }
.wisdom { background: var(--color-warning-light); color: var(--color-warning); }
.leadership { background: var(--color-info-light); color: var(--color-info); }
.personal_growth { background: var(--color-purple-light); color: var(--color-purple); }
</style>
