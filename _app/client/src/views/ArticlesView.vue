<template>
  <div class="articles-view">
    <header class="page-header">
      <h1>Articles</h1>
      <button @click="handleNewArticle" class="btn btn-primary">
        <p style="display: flex; align-items: center; color: black; gap: 5px;">📝 Save New Article</p>
      </button>
    </header>

    <div class="content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <span class="loader"></span>
        <p>Loading articles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadArticles" class="btn btn-secondary">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedArticles.length === 0" class="empty-state">
        <i class="fas fa-book-open"></i>
        <h2>No Articles Saved Yet</h2>
        <p>An article is an extended form of a jotting, capturing detailed ideas and insights.</p>
        <button @click="handleNewArticle" class="btn btn-primary">
          Save Your First Article
        </button>
      </div>

      <!-- Articles List -->
      <div v-else class="articles-grid">
        <article v-for="article in sortedArticles" :key="article.id" class="article-card">
          <div class="article-card__header">
            <h3>{{ article.title }}</h3>
          </div>
          
          <p class="article-card__description">{{ article.content }}</p>
          
          <div class="article-card__meta">
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          
          <div class="article-card__actions">
            <a :href="article.url" target="_blank" class="btn btn-text">
              <i class="fas fa-external-link-alt"></i> Open
            </a>
            <button @click="deleteArticle(article.id)" class="btn btn-text btn-danger">
              <p>❌ Delete</p>
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- Article Modal -->
    <NoteModal
      v-model:show="showModal"
      type="Article"
      :note="editingArticle"
      @close="closeModal"
      @submit="saveArticle"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../stores/article'
import { useRoute, useRouter } from 'vue-router'
import NoteModal from '../components/modals/NoteModal.vue'

// Store and router setup
const articleStore = useArticleStore()
const route = useRoute()
const router = useRouter()

// State management
const loading = ref(true)
const error = ref(null)
const editingArticle = ref(null)

// Modal state
const showModal = computed({
  get: () => editingArticle.value !== null || showNewArticleModal.value,
  set: (value) => {
    if (!value) {
      closeModal()
    } else {
      showNewArticleModal.value = true
    }
  }
})
const showNewArticleModal = ref(false)

// Computed properties
const sortedArticles = computed(() => {
  const articles = articleStore.articles || []
  return [...articles].sort((a, b) => 
    new Date(b.savedAt) - new Date(a.savedAt)
  )
})

// Lifecycle hooks
onMounted(async () => {
  await loadArticles()
  
  // Show new article modal if route meta indicates
  if (route.meta.showNewModal) {
    showNewArticleModal.value = true
    // Remove the meta flag from history
    router.replace({ name: 'articles' })
  }
})

// Methods
async function loadArticles() {
  loading.value = true
  error.value = null
  try {
    await articleStore.fetchArticles()
  } catch (err) {
    error.value = 'Failed to load articles. Please try again.'
    console.error('Error loading articles:', err)
  } finally {
    loading.value = false
  }
}

function handleNewArticle() {
  editingArticle.value = null
  showNewArticleModal.value = true
}

function closeModal() {
  showNewArticleModal.value = false
  editingArticle.value = null
}

async function saveArticle(articleData) {
  try {
    if (editingArticle.value) {
      await articleStore.updateArticle(editingArticle.value.id, articleData)
    } else {
      await articleStore.createArticle(articleData)
    }
    closeModal()
    await loadArticles()
  } catch (err) {
    error.value = `Failed to ${editingArticle.value ? 'update' : 'save'} article. Please try again.`
    console.error('Error saving article:', err)
  }
}

async function toggleRead(article) {
  try {
    await articleStore.updateArticle(article.id, {
      ...article,
      isRead: !article.isRead
    })
    await loadArticles()
  } catch (err) {
    error.value = 'Failed to update article. Please try again.'
    console.error('Error updating article:', err)
  }
}

async function deleteArticle(id) {
  if (!confirm('Are you sure you want to delete this article?')) return
  
  try {
    await articleStore.deleteArticle(id)
    await loadArticles()
  } catch (err) {
    error.value = 'Failed to delete article. Please try again.'
    console.error('Error deleting article:', err)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
