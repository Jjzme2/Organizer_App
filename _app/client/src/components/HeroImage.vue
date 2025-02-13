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
