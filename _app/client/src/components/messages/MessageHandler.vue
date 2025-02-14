<template>
  <div class="message-system">
    <!-- Banner Messages -->
    <Transition name="slide-down">
      <div v-if="messageStore.banner" class="banner-container">
        <div class="message-box" :class="messageStore.banner.type">
          <div class="message-box__content">
            <span class="message-box__icon">
              <i v-if="messageStore.banner.type === 'error'" class="fas fa-exclamation-circle"></i>
              <i v-else-if="messageStore.banner.type === 'success'" class="fas fa-check-circle"></i>
              <i v-else-if="messageStore.banner.type === 'info'" class="fas fa-info-circle"></i>
              <i v-else-if="messageStore.banner.type === 'warning'" class="fas fa-exclamation-triangle"></i>
            </span>
            <div class="message-box__text">
              <div v-if="messageStore.banner.title" class="message-box__title">
                {{ messageStore.banner.title }}
              </div>
              <p>{{ messageStore.banner.message }}</p>
            </div>
            <button 
              class="message-box__close"
              @click="messageStore.clearBanner"
              aria-label="Close message"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Messages -->
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in messageStore.toasts"
          :key="toast.id"
          class="message-box"
          :class="[toast.type, `position-${toast.position}`]"
        >
          <div class="message-box__content">
            <span class="message-box__icon">
              <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle"></i>
              <i v-else-if="toast.type === 'success'" class="fas fa-check-circle"></i>
              <i v-else-if="toast.type === 'info'" class="fas fa-info-circle"></i>
              <i v-else-if="toast.type === 'warning'" class="fas fa-exclamation-triangle"></i>
            </span>
            <div class="message-box__text">
              <div v-if="toast.title" class="message-box__title">
                {{ toast.title }}
              </div>
              <p>{{ toast.message }}</p>
            </div>
            <button 
              class="message-box__close"
              @click="() => messageStore.removeToast(toast.id)"
              aria-label="Close message"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMessageStore } from '@/stores/messages';

const messageStore = useMessageStore();

// Watch for banner changes to trigger animations
watch(() => messageStore.banner, (newBanner) => {
  if (newBanner?.autoClose) {
    setTimeout(() => {
      messageStore.clearBanner();
    }, newBanner.autoClose);
  }
});
</script>

<style scoped>
.message-system {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.banner-container {
  position: fixed;
  top: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--container-max-width);
  padding: 0 var(--spacing-md);
  pointer-events: auto;
}

.toast-container {
  position: fixed;
  top: 0;
  right: 0;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  pointer-events: auto;
}

/* Position variants for toasts */
.position-top-right {
  top: var(--spacing-md);
  right: var(--spacing-md);
}

.position-top-left {
  top: var(--spacing-md);
  left: var(--spacing-md);
}

.position-bottom-right {
  bottom: var(--spacing-md);
  right: var(--spacing-md);
}

.position-bottom-left {
  bottom: var(--spacing-md);
  left: var(--spacing-md);
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-normal);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-list-move {
  transition: transform var(--transition-normal);
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all var(--transition-normal);
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
