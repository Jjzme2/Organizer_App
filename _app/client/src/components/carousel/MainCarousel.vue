<template>
  <div class="carousel-container" :class="{ 'carousel-dark': dark }">
    <div class="carousel-wrapper" ref="carouselWrapper">
      <div 
        class="carousel-content" 
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <slot></slot>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button 
      v-if="showControls && !hideArrows" 
      class="carousel-control prev" 
      @click="prevSlide"
      :disabled="!loop && currentSlide === 0"
    >
      <i class="fas fa-chevron-left"></i>
    </button>
    <button 
      v-if="showControls && !hideArrows" 
      class="carousel-control next" 
      @click="nextSlide"
      :disabled="!loop && currentSlide === totalSlides - 1"
    >
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- Indicators -->
    <div v-if="showIndicators" class="carousel-indicators">
      <button
        v-for="(_, index) in totalSlides"
        :key="index"
        class="indicator"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 5000
  },
  loop: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  dark: {
    type: Boolean,
    default: false
  },
  hideArrows: {
    type: Boolean,
    default: false
  }
});

const currentSlide = ref(0);
const carouselWrapper = ref(null);
const autoplayInterval = ref(null);
const touchStartX = ref(0);
const touchEndX = ref(0);

const totalSlides = computed(() => {
  if (!carouselWrapper.value) return 0;
  return carouselWrapper.value.querySelectorAll('.carousel-slide').length;
});

const startAutoplay = () => {
  if (props.autoplay && props.interval > 0) {
    autoplayInterval.value = setInterval(() => {
      nextSlide();
    }, props.interval);
  }
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++;
  } else if (props.loop) {
    currentSlide.value = 0;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else if (props.loop) {
    currentSlide.value = totalSlides.value - 1;
  }
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  stopAutoplay();
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-content {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-surface);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text);
  opacity: 0.8;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: var(--shadow-md);
}

.carousel-control:hover {
  opacity: 1;
  background: var(--color-surface-hover);
}

.carousel-control:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev {
  left: 1rem;
}

.next {
  right: 1rem;
}

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-surface);
  border: none;
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  opacity: 1;
  transform: scale(1.2);
}

/* Dark theme */
.carousel-dark .carousel-control {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

.carousel-dark .carousel-control:hover {
  background: rgba(255, 255, 255, 0.2);
}

.carousel-dark .indicator {
  background: var(--color-text);
}

@media (max-width: 768px) {
  .carousel-control {
    width: 2rem;
    height: 2rem;
  }

  .prev {
    left: 0.5rem;
  }

  .next {
    right: 0.5rem;
  }
}
</style>
