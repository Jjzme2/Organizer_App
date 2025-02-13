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