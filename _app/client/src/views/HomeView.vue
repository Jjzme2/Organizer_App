<template>
  <div class="home">

    <section class="greeting-section bg-gradient-primary">
      <div class="container">
        <div class="greeting-content">
          <h1 class="text-4xl">Welcome back, {{ user.username }}</h1>
          <p class="text-xl">Here's what's on your plate today.</p>
        </div>
      </div>
    </section>

    <section class="tasks-section">
      <div class="tasks-content">
        <div v-if="loading">
          <p>Loading tasks...</p>  </div>
        <div v-else-if="error">
          <p>Error loading tasks: {{ error }}</p> </div>
        <div v-else>  <PaginatedTaskList
            v-if="myTasks.length"
            :title="`Active Tasks (${myTasks.length})`"
            :tasks="myTasks"  type="incomplete"
            :defaultLimit="5"
            @toggle="toggleTaskComplete"
            @edit="editTask"
            @delete="deleteTask"
          >
            <template #actions>
              <router-link to="/tasks/incomplete" class="btn btn-text">
                {{ showAllText }}
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </router-link>
            </template>
          </PaginatedTaskList>
          <div v-else class="tasks-empty">
            <p>No active tasks</p>
          </div>
        </div>
      </div>
    </section>

    <section class="jottings-section">
      <h2 class="section-title">Jottings</h2>
      <JottingsList />
    </section>

    <section class="articles-section">
      <h2 class="section-title">Articles</h2>
      <ArticlesList />
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

import ArticlesList from '../components/ArticlesList.vue'
import JottingsList from '../components/JottingsList.vue'
import PaginatedTaskList from '../components/PaginatedTaskList.vue'


const authStore = useAuthStore()
const taskStore = useTaskStore()

const { user } = storeToRefs(authStore)
const { incompleteTasks } = storeToRefs(taskStore)

const loading = ref(false)
const error = ref('')
const myTasks = ref([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const response = await taskStore.fetchTasks()
    console.log("Fetched tasks:", response)
    myTasks.value = incompleteTasks.value
  } catch (err) {
    error.value = err.message || "An error occurred."
    console.error("Error fetching tasks:", err)
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
.feature-icon {
  font-size: 3rem;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-4xl {
    font-size: var(--font-size-3xl);
  }

  .text-3xl {
    font-size: var(--font-size-2xl);
  }

  .text-xl {
    font-size: var(--font-size-lg);
  }

  .d-flex {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
