<template>
  <div class="feature-list">
    <FeatureCard
      v-for="(feature, index) in features"
      :key="index"
      :feature="feature"
      :delay="index * 100"
    />
  </div>
</template>

<script setup>
import FeatureCard from './cards/FeatureCard.vue'

const features = [
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
]
</script>

<style scoped>
.feature-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .feature-list {
    grid-template-columns: repeat(2, 1fr);
  }
}


</style>
