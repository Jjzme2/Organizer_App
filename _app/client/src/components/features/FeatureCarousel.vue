<template>
  <Carousel
    class="feature-carousel"
    :autoplay="true"
    :interval="5000"
    :loop="true"
    :dark="true"
    :show-indicators="true"
  >
    <CarouselSlide v-for="(feature, index) in features" :key="index">
      <div class="feature-slide">
        <div class="feature-icon">
          {{ feature.icon }}
        </div>
        <div class="feature-content">
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </CarouselSlide>
  </Carousel>
</template>

<script setup>
import { ref } from 'vue';
import Carousel from '../carousel/MainCarousel.vue';
import CarouselSlide from '../carousel/CarouselSlide.vue';

const features = ref([
  {
    title: 'Smart Task Management',
    icon: '💡',
    description: 'Organize tasks with intuitive categories, priorities, and due dates'
  },
  {
    title: 'Real-time Sync',
    icon: '🔄',
    description: 'Access your tasks from anywhere, with instant updates across devices'
  },
  {
    title: 'Habit Tracking',
    icon: '🏃',
    description: 'Keep track of your daily habits, build streaks, and improve your routines'
  },
  {
    title: 'Goal Setting',
    icon: '🎯',
    description: 'Set SMART goals and break them into actionable steps'
  },
  {
    title: 'Journaling & Reflection',
    icon: '📓',
    description: 'Capture your thoughts and reflect on your day for continuous growth'
  },
  {
    title: 'Inspirational Feed',
    icon: '☀',
    description: 'Stay inspired with a dynamic feed of quotes, jottings, and articles'
  },
  {
    title: 'Gamification Elements',
    icon: '🏆',
    description: 'Earn badges and rewards as you achieve milestones'
  },
  {
    title: 'Personalization',
    icon: '⚙',
    description: 'Customize your dashboard to suit your unique preferences'
  }

]);
</script>

<style scoped>
.feature-carousel {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.feature-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  height: 100%;
  color: var(--color-text);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.feature-content {
  max-width: 400px;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .feature-slide {
    padding: 1.5rem;
  }

  .feature-icon {
    font-size: 2rem;
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.25rem;
  }

  .feature-description {
    font-size: 1rem;
  }
}
</style>
