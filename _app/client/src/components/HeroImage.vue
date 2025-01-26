<template>
  <div class="hero-container" :style="{ '--hero-height': height }">
    <div class="hero-content">
      <slot></slot>
    </div>
    <div class="hero-overlay"></div>
    <div 
      class="hero-background" 
      :style="{ 
        'background-image': `url(${backgroundImage})`,
        'background-position': backgroundPosition 
      }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  backgroundImage: {
    type: String,
    required: true
  },
  backgroundPosition: {
    type: String,
    default: 'center'
  },
  height: {
    type: String,
    default: '80vh'
  }
})
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: var(--hero-height);
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-surface);
  text-align: center;
  padding: var(--spacing-xl);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
  z-index: 1;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-repeat: no-repeat;
  transform: scale(1.1);
  transition: transform var(--transition-normal);
}

.hero-container:hover .hero-background {
  transform: scale(1);
}

@media (max-width: 768px) {
  .hero-container {
    height: 100vh;
  }
}
</style>
