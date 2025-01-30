<template>
  <div class="slider-container">
    <label v-if="label" :for="id" class="slider-label">
      {{ label }}: <span class="slider-value">{{ displayValue }}</span>
    </label>
    <div class="slider-input-container">
      <input
        :id="id"
        type="range"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        class="slider-input"
      />
      <div class="slider-scale">
        <span>{{ minLabel }}</span>
        <span>{{ middleLabel }}</span>
        <span>{{ maxLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: 1
  },
  max: {
    type: [String, Number],
    default: 10
  },
  step: {
    type: [String, Number],
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  },
  valueLabels: {
    type: Object,
    default: () => ({})
  },
  minLabel: {
    type: String,
    default: 'Min'
  },
  middleLabel: {
    type: String,
    default: 'Middle'
  },
  maxLabel: {
    type: String,
    default: 'Max'
  }
})

defineEmits(['update:modelValue'])

const displayValue = computed(() => {
  if (props.valueLabels && props.valueLabels[props.modelValue]) {
    return `${props.modelValue} - ${props.valueLabels[props.modelValue]}`
  }
  return props.modelValue
})
</script>

<style scoped>
.slider-container {
  width: 100%;
}

.slider-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.slider-value {
  font-weight: normal;
  color: var(--color-primary);
}

.slider-input-container {
  position: relative;
  padding: 0.5rem 0;
}

.slider-input {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: linear-gradient(to right,
    var(--color-success) 0%,
    var(--color-warning) 50%,
    var(--color-danger) 100%
  );
  border-radius: 4px;
  outline: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.slider-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: var(--color-text-light);
  font-size: 0.875rem;
}
</style>
