<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <div class="container view-container">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component v-if="Component" :is="Component" />
            <div v-else class="loading-container">
              <div class="loading-spinner"></div>
              <div class="loading-text">Loading...</div>
              <div class="loading-subtext">Something went wrong. Please try refreshing the page.</div>
            </div>
          </transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
import { useSeo } from './composables/useSeo'

// Initialize SEO
useSeo()
</script>

<style>
@import './assets/css/main.css';

.app {
  min-height: 100vh;
  width: clamp(300px, 90vw, 1200px);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: var(--spacing-lg) var(--spacing-md);
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.view-container {
  padding-top: var(--spacing-2xl);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .view-container {
    padding-top: var(--spacing-lg);
  }
}
</style>
