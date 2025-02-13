<template>
  <div class="notebook-view">
    <header class="view-header">
      <div class="container">
        <div class="header-content">
          <h1>Notebook</h1>
          <div class="header-actions">
            <button @click="handleAddJotting" class="btn btn-primary">
              Add Jotting
            </button>
            <button @click="handleAddArticle" class="btn btn-primary">
              Add Article
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="view-content container">
      <!-- Jottings Section -->
      <section>
        <PaginatedJottingsList
          title="Jottings"
          :items="jottings"
          :itemsPerPage="itemsPerPage"
          @edit="handleJottingEdit"
          @delete="handleJottingDelete"
        />
      </section>

      <!-- Articles Section -->
      <section>
        <PaginatedArticlesList
          title="Articles"
          :items="articles"
          :itemsPerPage="itemsPerPage"
          @edit="handleArticleEdit"
          @delete="handleArticleDelete"
        />
      </section>
    </main>

    <!-- Jotting Modal -->
    <NoteModal
      v-if="showJottingModal"
      @close="handleJottingClose"
      @submit="handleJottingSubmit"
      :note="editingJotting"
    />

    <!-- Article Modal -->
    <NoteModal
      v-if="showArticleModal"
      @close="handleArticleClose"
      @submit="handleArticleSubmit"
      :note="editingArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NoteModal from '../components/modals/NoteModal.vue'
import PaginatedJottingsList from '../components/pagination/JottingsList_Paginated.vue';
import PaginatedArticlesList from '../components/pagination/ArticlesList_Paginated.vue';
import { useArticleStore } from '../stores/article';
import { useJottingStore } from '../stores/jotting';

const articleStore = useArticleStore();
const jottingStore = useJottingStore();

const itemsPerPage = ref(5);
const jottings = ref([]);
const articles = ref([]);

// Modal state
const showJottingModal = ref(false);
const showArticleModal = ref(false);
const editingJotting = ref(null);
const editingArticle = ref(null);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    await Promise.all([
      articleStore.fetchArticles(),
      jottingStore.fetchJottings()
    ]);
    articles.value = articleStore.articles;
    jottings.value = jottingStore.jottings;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Jotting handlers
function handleAddJotting() {
  editingJotting.value = null;
  showJottingModal.value = true;
}

function handleJottingEdit(jotting) {
  console.log(jotting);
  editingJotting.value = { ...jotting };
  showJottingModal.value = true;
}

async function handleJottingDelete(jottingId) {
  if (confirm('Are you sure you want to delete this jotting?')) {
    try {
      await jottingStore.deleteJotting(jottingId);
      jottings.value = jottingStore.jottings;
    } catch (error) {
      console.error('Error deleting jotting:', error);
    }
  }
}

async function handleJottingSubmit(jottingData) {
  try {
    if (jottingData.id) {
      // Update existing jotting
      await jottingStore.updateJotting(jottingData.id, jottingData);
    } else {
      // Create new jotting
      await jottingStore.createJotting(jottingData);
    }
    showJottingModal.value = false;
    editingJotting.value = null;
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Error saving jotting:', error);
  }
}

function handleJottingClose() {
  showJottingModal.value = false;
  editingJotting.value = null;
}

// Article handlers
function handleAddArticle() {
  editingArticle.value = null;
  showArticleModal.value = true;
}

function handleArticleEdit(article) {
  editingArticle.value = { ...article };
  showArticleModal.value = true;
}

async function handleArticleDelete(articleId) {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      await articleStore.deleteArticle(articleId);
      articles.value = articleStore.articles;
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  }
}

async function handleArticleSubmit(articleData) {
  try {
    if (editingArticle.value) {
      await articleStore.updateArticle(editingArticle.value.id, articleData);
    } else {
      await articleStore.createArticle(articleData);
    }
    showArticleModal.value = false;
    articles.value = articleStore.articles;
  } catch (error) {
    console.error('Error saving article:', error);
  }
}

function handleArticleClose() {
  showArticleModal.value = false;
  editingArticle.value = null;
}
</script>