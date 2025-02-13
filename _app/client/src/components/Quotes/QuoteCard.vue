<template>
  <div 
    class="card hover-lift p-4" 
    :class="{ 'border-primary': quote.isFavorite }"
  >
    <div class="mb-4">
      <div class="text-lg font-medium mb-3">
        "{{ quote.text }}"
      </div>
      <div class="text-light">
        <span class="font-medium">— {{ quote.author }}</span>
        <span v-if="quote.source" class="text-sm ml-2">({{ quote.source }})</span>
      </div>
    </div>

    <div class="d-flex justify-between items-center">
      <span 
        class="text-sm px-2 py-1 rounded-full" 
        :class="{
          'bg-primary text-white': quote.category === 'motivation',
          'bg-success text-white': quote.category === 'success',
          'bg-info text-white': quote.category === 'wisdom',
          'bg-warning text-dark': quote.category === 'leadership',
          'bg-secondary text-white': quote.category === 'personal_growth'
        }"
      >
        {{ formatCategory(quote.category) }}
      </span>

      <div class="d-flex gap-2">
        <button
          @click="$emit('toggle-favorite')"
          class="btn btn-icon hover-scale"
          :class="{ 'text-primary': quote.isFavorite }"
          title="Toggle favorite"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path v-if="quote.isFavorite" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            <path v-else d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
          </svg>
        </button>
        <button
          @click="$emit('delete', quote.id)"
          class="btn btn-icon hover-scale text-danger"
          title="Delete quote"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
        <button
          @click="$emit('edit', quote)"
          class="btn btn-icon hover-scale"
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
