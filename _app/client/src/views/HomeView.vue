<template>
  <div class="home">
    <HeroImage 
      background-image="/src/assets/images/hero-bg.jpg"
      height="90vh"
      style="margin-top: calc(var(--header-height) * -1);"
    >
      <div class="container text-center slide-up">
        <h1 class="text-4xl font-bold mb-4">
          Organize Your Life,<br>
          <span class="text-primary-light">One Task at a Time</span>
        </h1>
        <p class="text-xl mb-5 text-light">
          A powerful, intuitive task management solution that helps you stay focused and productive
        </p>
        <div class="d-flex justify-center gap-3">
          <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary btn-lg">
            Get Started - It's Free
          </router-link>
          <router-link v-else to="/tasks" class="btn btn-primary btn-lg">
            Go to My Tasks
          </router-link>
          <a href="#features" class="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>
      </div>
    </HeroImage>

    <section id="features" class="py-5">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-5">Why Choose Our Organizer?</h2>
        <div class="d-grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
          <div class="card slide-up" style="animation-delay: 100ms;">
            <div class="card-body d-flex flex-column items-center text-center">
              <div class="feature-icon mb-3">📝</div>
              <h3 class="text-xl font-medium mb-2">Smart Task Management</h3>
              <p class="text-light">Organize tasks with intuitive categories, priorities, and due dates</p>
            </div>
          </div>
          
          <div class="card slide-up" style="animation-delay: 200ms;">
            <div class="card-body d-flex flex-column items-center text-center">
              <div class="feature-icon mb-3">🔄</div>
              <h3 class="text-xl font-medium mb-2">Real-time Sync</h3>
              <p class="text-light">Access your tasks from anywhere, with instant updates across devices</p>
            </div>
          </div>
          
          <div class="card slide-up" style="animation-delay: 300ms;">
            <div class="card-body d-flex flex-column items-center text-center">
              <div class="feature-icon mb-3">📊</div>
              <h3 class="text-xl font-medium mb-2">Progress Tracking</h3>
              <p class="text-light">Monitor your productivity with detailed statistics and insights</p>
            </div>
          </div>
          
          <div class="card slide-up" style="animation-delay: 400ms;">
            <div class="card-body d-flex flex-column items-center text-center">
              <div class="feature-icon mb-3">🔔</div>
              <h3 class="text-xl font-medium mb-2">Smart Reminders</h3>
              <p class="text-light">Never miss a deadline with customizable notifications</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-primary text-surface py-5">
      <div class="container text-center">
        <h2 class="text-3xl font-bold mb-3">Ready to Get Organized?</h2>
        <p class="text-xl mb-4 text-surface">Join thousands of users who have transformed their productivity</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-lg" 
          style="background: var(--color-surface); color: var(--color-primary);">
          Start Free Trial
        </router-link>
        <router-link v-else to="/tasks" class="btn btn-lg"
          style="background: var(--color-surface); color: var(--color-primary);">
          Go to Dashboard
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import HeroImage from '../components/HeroImage.vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
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
