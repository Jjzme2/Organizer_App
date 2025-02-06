<template>
  <div class="quotes-view">
    <header class="view-header">
      <div class="container">
        <div class="header-content">
          <h1>Inspirational Quotes</h1>
          <div class="header-actions">
            <button @click="showAddQuoteModal = true" class="btn btn-primary">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Quote
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="view-content container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">Loading quotes...</div>
      </div>

      <!-- Error Message -->
      <MessageBox
        v-if="error && showError"
        :title="getErrorTitle(error)"
        :message="error"
        type="error"
        @close="showError = false"
      />

      <!-- Featured Quote -->
      <div v-if="randomQuote" class="featured-section">
        <QuoteBanner
          :quote="randomQuote"
          @refresh="fetchNewRandomQuote"
        />
      </div>

      <!-- Filter and Sort -->
      <div class="controls-section">
        <div class="filter-group">
          <select v-model="filterCategory" class="form-control">
            <option value="">All Categories</option>
            <option value="motivation">Motivation</option>
            <option value="success">Success</option>
            <option value="wisdom">Wisdom</option>
            <option value="leadership">Leadership</option>
            <option value="personal_growth">Personal Growth</option>
          </select>
        </div>
        <div class="sort-group">
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
        class="quotes-grid"
      >
        <QuoteCard
          v-for="quote in filteredAndSortedQuotes"
          :key="quote.id"
          :quote="quote"
          @toggle-favorite="toggleFavorite"
          @delete="confirmDeleteQuote"
        />
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="!loading && !quotes.length" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <p>No quotes found</p>
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
      <p>Are you sure you want to delete this quote? This action cannot be undone.</p>
      <div class="modal-actions">
        <button
          @click="showDeleteModal = false"
          class="btn btn-text"
          :disabled="submitting"
        >
          Cancel
        </button>
        <button
          @click="deleteQuote"
          class="btn btn-danger"
          :disabled="submitting"
        >
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
import BaseModal from '../components/ui/BaseModal.vue'
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

<style scoped>
.quotes-view {
  min-height: 100vh;
}

.view-header {
  background: var(--color-surface);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.featured-section {
  margin-bottom: var(--spacing-xl);
}

.controls-section {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filter-group,
.sort-group {
  flex: 1;
}

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-light);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: var(--spacing-xs);
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (max-width: 768px) {
  .controls-section {
    flex-direction: column;
  }

  .quotes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
