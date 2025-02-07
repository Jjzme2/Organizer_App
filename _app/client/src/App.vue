<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <div class="container view-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
@import './assets/css/main.css';

.app {
  min-height: 100vh;
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
