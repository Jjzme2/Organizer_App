<template>
  <div class="home">
    <HeroImage
      background-image="/src/assets/images/hero-bg.jpg"
      height="60vh"
      class="home-hero"
    >
      <div class="hero-content container text-center slide-up">
        <h1 class="hero-title">
          Organize Your Life,<br>
          <span class="gradient-text">One Task at a Time</span>
        </h1>
        <p class="hero-subtitle">
          A powerful, intuitive task management solution that helps you stay focused and productive
        </p>
        <div class="hero-actions">
          <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary btn-lg glow">
            Get Started - It's Free
          </router-link>
          <router-link v-else to="/tasks" class="btn btn-primary btn-lg glow">
            Go to My Tasks
          </router-link>
          <a href="#features" class="btn btn-outline btn-lg">
            Learn More
          </a>
        </div>
      </div>
    </HeroImage>

    <section id="features" class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Our Organizer?</h2>
        <div class="features-grid">
          <FeatureCard
            v-for="(feature, index) in features"
            :key="feature.title"
            :feature="feature"
            :delay="index * 100"
          />
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container text-center">
        <h2 class="section-title light">Ready to Get Organized?</h2>
        <p class="section-subtitle light">Join thousands of users who have transformed their productivity</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-light btn-lg glow">
          Start Free Trial
        </router-link>
        <router-link v-else to="/tasks" class="btn btn-light btn-lg glow">
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
import FeatureCard from '../components/FeatureCard.vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const features = [
  {
    icon: '📝',
    title: 'Smart Task Management',
    description: 'Organize tasks with intuitive categories, priorities, and due dates'
  },
  {
    icon: '🔄',
    title: 'Real-time Sync',
    description: 'Access your tasks from anywhere, with instant updates across devices'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your productivity with detailed statistics and insights'
  },
  {
    icon: '🔔',
    title: 'Smart Reminders',
    description: 'Never miss a deadline with customizable notifications'
  }
]
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
