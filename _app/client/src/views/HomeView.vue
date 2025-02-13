<template>
  <main class="dashboard">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <h1>Welcome back, {{ user?.username || 'User' }}!</h1>
      <p class="current-time">{{ formattedDateTime }}</p>
    </section>

    <!-- Quick Stats -->
    <section class="quick-stats">
      <div class="stat-card tasks">
        <h3>Tasks</h3>
        <div class="stat-numbers">
          <p><span>{{ pendingTasks }}</span> pending</p>
          <p><span>{{ dueSoonTasks }}</span> due soon</p>
        </div>
        <router-link to="/tasks" class="view-all">View Tasks →</router-link>
      </div>

      <div class="stat-card articles">
        <h3>Articles</h3>
        <div class="stat-numbers">
          <p><span>{{ totalArticles }}</span> saved</p>
          <p><span>{{ unreadArticles }}</span> unread</p>
        </div>
        <router-link to="/articles" class="view-all">View Articles →</router-link>
      </div>

      <div class="stat-card jottings">
        <h3>Jottings</h3>
        <div class="stat-numbers">
          <p><span>{{ totalJottings }}</span> total</p>
          <p><span>{{ recentJottings }}</span> this week</p>
        </div>
        <router-link to="/jottings" class="view-all">View Jottings →</router-link>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/tasks/new" class="action-card">
          <i class="fas fa-plus-circle"></i>
          <span>New Task</span>
        </router-link>
        <router-link to="/articles/new" class="action-card">
          <i class="fas fa-bookmark"></i>
          <span>Save Article</span>
        </router-link>
        <router-link to="/jottings/new" class="action-card">
          <i class="fas fa-pen"></i>
          <span>Quick Jotting</span>
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import { useArticleStore } from '../stores/article'
import { useJottingStore } from '../stores/jotting'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const articleStore = useArticleStore()
const jottingStore = useJottingStore()

const user = computed(() => authStore.user)

// Time formatting
const formattedDateTime = computed(() => {
  const now = new Date()
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(now)
})

// Task stats
const pendingTasks = computed(() => {
  return taskStore.tasks.filter(task => !task.isComplete).length
})

const dueSoonTasks = computed(() => {
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  return taskStore.tasks.filter(task => {
    return !task.isComplete && 
           task.dueDate && 
           new Date(task.dueDate) <= threeDaysFromNow
  }).length
})

// Article stats
const totalArticles = computed(() => articleStore.articles.length)
const unreadArticles = computed(() => articleStore.articles.filter(article => !article.isRead).length)

// Jotting stats
const totalJottings = computed(() => jottingStore.jottings.length)
const recentJottings = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return jottingStore.jottings.filter(jotting => 
    new Date(jotting.createdAt) >= weekAgo
  ).length
})

// Load data
onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    articleStore.fetchArticles(),
    jottingStore.fetchJottings()
  ])
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-section h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.current-time {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--color-background-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card h3 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.stat-numbers {
  margin-bottom: 1rem;
}

.stat-numbers p {
  color: var(--color-text-secondary);
  margin: 0.5rem 0;
}

.stat-numbers span {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.view-all {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-top: 0.5rem;
}

.view-all:hover {
  text-decoration: underline;
}

.quick-actions {
  margin-top: 2rem;
}

.quick-actions h2 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-background-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.action-card:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.action-card i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.action-card span {
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .welcome-section h1 {
    font-size: 1.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .action-card {
    padding: 1rem;
  }
}
</style>
