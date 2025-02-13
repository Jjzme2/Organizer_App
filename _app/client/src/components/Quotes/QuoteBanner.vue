<template>
  <div class="quote-banner hover-lift">
    <div class="quote-content">
      <p class="quote-text text-xl font-medium">"{{ displayQuote.text }}"</p>
      <p class="quote-author text-lg text-light">— {{ displayQuote.author }}</p>
    </div>
    <div class="quote-actions">
      <router-link 
        to="/quotes" 
        class="btn btn-text d-flex items-center gap-2" 
        title="View all quotes"
      >
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
        <span>View All</span>
      </router-link>
      <button
        @click="fetchNewRandomQuote"
        class="refresh-btn hover-scale"
        title="Get new quote"
        :disabled="isLoading"
      >
        <svg 
          class="icon" 
          :class="{ 'animate-spin': isLoading }" 
          viewBox="0 0 24 24"
        >
          <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Quote {
  text: string;
  author: string;
  id?: string;
  source?: string;
  category?: string;
  isFavorite?: boolean;
}

const props = defineProps<{
  quote?: Quote | null;
}>();

import { ref, onMounted, computed } from 'vue';
import { useQuoteStore } from '../../stores/quote';
import { storeToRefs } from 'pinia';

const quoteStore = useQuoteStore();
const { randomQuote } = storeToRefs(quoteStore);
const isLoading = ref(false);

// Use the default quotes from the server as fallback
const defaultQuote: Quote = {
  text: "The journey of a thousand miles begins with one step.",
  author: "Lao Tzu",
  category: "motivation"
};

const displayQuote = computed(() => {
  if (props.quote?.text && props.quote?.author) {
    return props.quote;
  }

  return randomQuote.value || defaultQuote;
});

const fetchNewRandomQuote = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    await quoteStore.fetchRandomQuote();
  } catch (error) {
    console.error('Failed to fetch random quote:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!props.quote && !randomQuote.value) {
    await fetchNewRandomQuote();
  }
});
</script>
