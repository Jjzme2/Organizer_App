<template>
  <section class="jottings-list-section">
    <div class="section-header">
      <h2>
        {{ title }}
        <span class="jotting-count">({{ jottings.length }})</span>
      </h2>
      <div class="section-actions" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <TransitionGroup name="list" tag="div" class="jottings-list">
      <JottingCard
        v-for="jotting in jottings"
        :key="jotting.id"
        :jotting="jotting"
        @edit="$emit('edit', jotting)"
        @delete="$emit('delete', jotting.id)"
      />
    </TransitionGroup>

    <div v-if="!jottings.length" class="empty-state">
      <slot name="empty">
        <p>No jottings found</p>
      </slot>
    </div>
  </section>
</template>

<script setup>
import JottingCard from './cards/JottingCard.vue'

defineProps({
  jottings: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Jottings'
  }
})

defineEmits(['edit', 'delete'])
</script>