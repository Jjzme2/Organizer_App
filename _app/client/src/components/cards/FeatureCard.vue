<template>
  <div class="feature-card slide-up" :style="{ animationDelay: `${delay}ms` }">
    <div class="feature-icon">{{ feature.icon }}</div>
    <h3>{{ feature.title }}</h3>
    <p>{{ feature.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  feature: {
    type: Object,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
})
</script>
