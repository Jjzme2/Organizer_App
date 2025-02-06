<template>
  <div class="quote-banner">
    <div class="quote-content">
      <p class="quote-text">"{{ quote.text }}"</p>
      <p class="quote-author">— {{ quote.author }}</p>
    </div>
    <div class="quote-actions">
      <router-link to="/quotes" class="btn btn-text" title="View all quotes">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
        View All
      </router-link>
      <button @click="$emit('refresh')" class="refresh-btn" title="Get new quote">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quote: {
    type: Object,
    required: true
  }
})

defineEmits(['refresh'])
</script>

<style scoped>
.quote-banner {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.quote-author {
  color: var(--color-text-light);
}

.quote-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.btn-text:hover {
  color: var(--color-primary-dark);
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: var(--spacing-sm);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  color: var(--color-primary);
  background: var(--color-surface-hover);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
