<template>
    <HeroImage
    :background-image="backgroundImage"
    height="10vh"
    class="home-hero"
  >
    <div class="hero-content container text-center slide-up">
      <h1 class="hero-title">
        {{ mainText_1 }}<br>
        <span class="gradient-text">{{ mainText_2 || ''}}</span>
      </h1>
      <p class="hero-subtitle">
        {{subText || ''}}
      </p>
      <div class="hero-actions">
        <div class="spacing-md">
          <router-link :to="buttonRoute" class="btn btn-primary btn-lg glow">
            {{ buttonText }}
          </router-link>
        </div>
      </div>
    </div>
  </HeroImage>
</template>


<script setup>
import HeroImage from '@/components/HeroImage.vue';

defineProps({
  backgroundImage: {
    type: String,
    required: true
  },
  mainText_1: {
    type: String,
    required: true
  },
  mainText_2: {
    type: String,
    required: false
  },
  subText: {
    type: String,
    required: false

  },
  buttonText: {
    type: String,
    required: true
  },
  buttonRoute: {
    type: String,
    required: true
  }
});
</script>
