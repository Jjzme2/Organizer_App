<template>
  <div class="quotes-view animate-fade-in">
    <header class="hero-container">
      <div class="hero-background" style="background-image: url('/images/quotes-bg.jpg')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="text-3xl font-bold mb-2">Inspirational Quotes</h1>
        <button @click="showAddQuoteModal = true" class="btn btn-primary d-flex items-center mt-3">
          <svg class="icon mr-2" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Quote
        </button>
      </div>
    </header>

    <main class="container mt-4">
      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center items-center p-4">
        <span class="icon icon--spin mr-2"></span>
        <div class="loading-spinner text-lg">Loading quotes...</div>
      </div>

      <!-- Error Message -->
      <MessageBox
        v-if="error && showError"
        :title="getErrorTitle(error)"
        :message="error"
        type="error"
        @close="showError = false"
        class="mb-4"
      />

      <!-- Featured Quote -->
      <div v-if="randomQuote" class="mb-4 animate-slide-up">
        <QuoteBanner
          :quote="randomQuote"
          @refresh="fetchNewRandomQuote"
        />
      </div>

      <!-- Filter and Sort -->
      <div class="d-flex justify-between items-center gap-4 mb-4">
        <div class="flex-1">
          <select v-model="filterCategory" class="form-control">
            <option value="">All Categories</option>
            <option value="motivation">Motivation</option>
            <option value="success">Success</option>
            <option value="wisdom">Wisdom</option>
            <option value="leadership">Leadership</option>
            <option value="personal_growth">Personal Growth</option>
          </select>
        </div>
        <div class="flex-1">
          <select v-model="sortBy" class="form-control">
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
          </select>
        </div>
      </div>

      <!-- Quotes Grid -->
      <TransitionGroup
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <QuoteCard
          v-for="quote in filteredAndSortedQuotes"
          :key="quote.id"
          :quote="quote"
          @toggle-favorite="toggleFavorite"
          @delete="confirmDeleteQuote"
          class="animate-scale-in"
        />
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="!loading && !quotes.length" class="text-center p-8">
        <svg class="icon icon--xl mx-auto mb-4 text-light" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <p class="text-lg text-light mb-4">No quotes found</p>
        <button @click="showAddQuoteModal = true" class="btn btn-primary">Add Your First Quote</button>
      </div>
    </main>

    <!-- Add Quote Modal -->
    <AddQuoteModal
      v-if="showAddQuoteModal"
      v-model:show="showAddQuoteModal"
      @quote-added="handleQuoteAdded"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-if="showDeleteModal"
      v-model:show="showDeleteModal"
      title="Delete Quote"
    >
      <p class="mb-4">Are you sure you want to delete this quote? This action cannot be undone.</p>
      <div class="d-flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="btn btn-text"
          :disabled="submitting"
        >
          Cancel
        </button>
        <button
          @click="deleteQuote"
          class="btn btn-danger d-flex items-center"
          :disabled="submitting"
        >
          <span v-if="submitting" class="icon icon--spin mr-2"></span>
          {{ submitting ? 'Deleting...' : 'Delete Quote' }}
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuoteStore } from '../stores/quote'
import { storeToRefs } from 'pinia'
import QuoteBanner from '../components/Quotes/QuoteBanner.vue'
import QuoteCard from '../components/Quotes/QuoteCard.vue'
import AddQuoteModal from '../components/Quotes/AddQuoteModal.vue'
import BaseModal from '../components/modals/BaseModal.vue'
import MessageBox from '../components/MessageBox.vue'

const quoteStore = useQuoteStore()
const { quotes, randomQuote, loading, error } = storeToRefs(quoteStore)

// UI State
const showAddQuoteModal = ref(false)
const showDeleteModal = ref(false)
const showError = ref(true)
const submitting = ref(false)
const quoteToDelete = ref<string | null>(null)

// Filters and Sorting
const filterCategory = ref('')
const sortBy = ref('createdAt-desc')

// Computed
const filteredAndSortedQuotes = computed(() => {
  let result = [...quotes.value]

  // Apply category filter
  if (filterCategory.value) {
    result = result.filter(quote => quote.category === filterCategory.value)
  }

  // Apply sorting
  const [field, direction] = sortBy.value.split('-')
  result.sort((a, b) => {
    const modifier = direction === 'asc' ? 1 : -1
    if (field === 'createdAt') {
      return modifier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    if (field === 'author') {
      return modifier * a.author.localeCompare(b.author)
    }
    return 0
  })

  return result
})

// Error Handling
const getErrorTitle = (err: any) => {
  if (typeof err === 'object' && err !== null) {
    switch (err.code) {
      case 'AUTHENTICATION_ERROR':
        return 'Authentication Error'
      case 'QUOTE_CREATE_ERROR':
        return 'Error Creating Quote'
      case 'QUOTE_UPDATE_ERROR':
        return 'Error Updating Quote'
      case 'QUOTE_DELETE_ERROR':
        return 'Error Deleting Quote'
      default:
        return 'Operation Failed'
    }
  }
  return 'Error'
}

// Actions
const fetchNewRandomQuote = () => {
  quoteStore.fetchRandomQuote()
}

const toggleFavorite = async (id: string) => {
  try {
    await quoteStore.toggleFavorite(id)
  } catch (error) {
    showError.value = true
  }
}

const confirmDeleteQuote = (id: string) => {
  quoteToDelete.value = id
  showDeleteModal.value = true
}

const deleteQuote = async () => {
  if (!quoteToDelete.value) return

  try {
    submitting.value = true
    await quoteStore.deleteQuote(quoteToDelete.value)
    showDeleteModal.value = false
  } catch (error) {
    showError.value = true
  } finally {
    submitting.value = false
    quoteToDelete.value = null
  }
}

const handleQuoteAdded = () => {
  showAddQuoteModal.value = false
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      quoteStore.fetchQuotes(),
      quoteStore.fetchRandomQuote()
    ])
  } catch (error) {
    showError.value = true
  }
})
</script>
