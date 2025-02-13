<template>
  <div class="jottings-view">
    <header class="page-header">
      <h1>Jottings</h1>
      <button @click="handleNewJotting" class="btn btn-primary">
        <p style="display: flex; align-items: center; color: black; gap: 5px;"> New Jotting</p>
      </button>
    </header>

    <div class="content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <span class="loader"></span>
        <p>Loading jottings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadJottings" class="btn btn-secondary">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedJottings.length === 0" class="empty-state">
        <i class="fas fa-feather-alt"></i>
        <h2>No Jottings Yet</h2>
        <p>Quick notes and thoughts to capture your ideas.</p>
        <button @click="handleNewJotting" class="btn btn-primary">
          Write Your First Jotting
        </button>
      </div>

      <!-- Jottings Grid -->
      <div v-else class="jottings-grid">
        <div v-for="jotting in sortedJottings" :key="jotting.id" class="jotting-card">
          <div class="jotting-card__header">
            <h3>{{ jotting.title }}</h3>
            <div class="jotting-actions">
              <button @click="editJotting(jotting)" class="btn btn-text">
                <p style="display: flex; align-items: center; gap: 5px;"> Edit</p>
              </button>
              <button @click="deleteJotting(jotting.id)" class="btn btn-text btn-danger">
                <p style="display: flex; align-items: center; gap: 5px;"> Delete</p>
              </button>
            </div>
          </div>
          
          <div class="jotting-card__content">
            <p>{{ jotting.content }}</p>
          </div>
          
          <div class="jotting-card__footer">
            <div class="tags" v-if="jotting.tags?.length">
              <span v-for="tag in jotting.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
            <span class="date">{{ formatDate(jotting.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Jotting Modal -->
    <NoteModal
      v-model:show="showModal"
      type="Jotting"
      :note="editingJotting"
      @close="closeModal"
      @submit="saveJotting"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJottingStore } from '../stores/jotting'
import { useRoute, useRouter } from 'vue-router'
import NoteModal from '../components/modals/NoteModal.vue'

// Store and router setup
const jottingStore = useJottingStore()
const route = useRoute()
const router = useRouter()

// State management
const loading = ref(true)
const error = ref(null)
const editingJotting = ref(null)

// Modal state
const showModal = computed({
  get: () => editingJotting.value !== null || showNewJottingModal.value,
  set: (value) => {
    if (!value) {
      closeModal()
    } else {
      showNewJottingModal.value = true
    }
  }
})
const showNewJottingModal = ref(false)

// Computed properties
const sortedJottings = computed(() => {
  const jottings = jottingStore.jottings || []
  return [...jottings].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

// Lifecycle hooks
onMounted(async () => {
  await loadJottings()
  
  // Show new jotting modal if route meta indicates
  if (route.meta.showNewModal) {
    showNewJottingModal.value = true
    // Remove the meta flag from history
    router.replace({ name: 'jottings' })
  }
})

// Methods
async function loadJottings() {
  loading.value = true
  error.value = null
  try {
    await jottingStore.fetchJottings()
  } catch (err) {
    error.value = 'Failed to load jottings. Please try again.'
    console.error('Error loading jottings:', err)
  } finally {
    loading.value = false
  }
}

function handleNewJotting() {
  editingJotting.value = null
  showNewJottingModal.value = true
}

function editJotting(jotting) {
  editingJotting.value = { ...jotting }
}

function closeModal() {
  showNewJottingModal.value = false
  editingJotting.value = null
}

async function saveJotting(jottingData) {
  try {
    if (editingJotting.value) {
      await jottingStore.updateJotting(editingJotting.value.id, jottingData)
    } else {
      await jottingStore.createJotting(jottingData)
    }
    closeModal()
    await loadJottings()
  } catch (err) {
    error.value = `Failed to ${editingJotting.value ? 'update' : 'save'} jotting. Please try again.`
    console.error('Error saving jotting:', err)
  }
}

async function deleteJotting(id) {
  if (!confirm('Are you sure you want to delete this jotting?')) return
  
  try {
    await jottingStore.deleteJotting(id)
    await loadJottings()
  } catch (err) {
    error.value = 'Failed to delete jotting. Please try again.'
    console.error('Error deleting jotting:', err)
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

<style scoped>
.jottings-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
}

.loading-state,
.error-message,
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-state i {
  font-size: 3rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.jottings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.jotting-card {
  background: var(--color-background-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.jotting-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.jotting-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.jotting-card__header h3 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0;
}

.jotting-actions {
  display: flex;
  gap: 0.5rem;
}

.jotting-card__content {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.jotting-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.875rem;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.jotting-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--color-text-primary);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .jottings-view {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .jottings-grid {
    grid-template-columns: 1fr;
  }
}
</style>