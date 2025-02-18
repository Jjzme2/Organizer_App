<template>
  <div class="articles-view">
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

      <!-- Articles List -->
      <ArticlesList
        v-else
        :articles="sortedArticles"
        @edit="editArticle"
        @delete="deleteArticle"
      >
        <template #actions>
          <button @click="handleNewArticle" class="btn btn-primary">
            <p>New Article</p>
          </button>
        </template>
        <template #empty>
          <div class="empty-state">
            <h2>No Articles Yet</h2>
            <p>Start writing your thoughts and ideas.</p>
            <button @click="handleNewArticle" class="btn btn-primary">
              Write Your First Article
            </button>
          </div>
        </template>
      </ArticlesList>
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
import ArticlesList from '../components/ArticlesList.vue'

// Store and router setup
const articleStore = useArticleStore()
const route = useRoute()
const router = useRouter()

// State management
const loading = ref(true)
const error = ref(null)
const editingArticle = ref(null)
const showNewArticleModal = ref(false)

// Modal state
const showModal = computed({
  get: () => editingArticle.value !== null || showNewArticleModal.value,
  set: (value) => {
    if (!value) {
      closeModal()
    }
  }
})

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

function editArticle(article) {
  showNewArticleModal.value = false
  editingArticle.value = { ...article }
}

function closeModal() {
  editingArticle.value = null
  showNewArticleModal.value = false
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
