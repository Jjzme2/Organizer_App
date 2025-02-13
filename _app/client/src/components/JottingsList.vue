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
        @edit="handleEdit(jotting)"
        @delete="handleDelete(jotting.id)"
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
import { ref, onMounted } from 'vue'
import JottingCard from './cards/JottingCard.vue'

const title = 'Jottings'
const jottings = ref([])

// Placeholder for fetching jottings – replace with actual API/service call if needed
onMounted(async () => {
  // Example: jottings.value = await fetchJottings()
  jottings.value = [
    { id: 1, content: 'First jotting note.' },
    { id: 2, content: 'Second jotting note.' }
  ]
})

const openEditModal = (jotting) => {
  currentJotting.value = jotting;
  isModalVisible.value = true;}

const closeModal = () => {
  isModalVisible.value = false;
  currentJotting.value = null;
};

const saveJotting = (updatedJotting) => {
  // Implement your save logic here
  const index = jottings.value.findIndex(j => j.id === updatedJotting.id);
  if (index !== -1) {
    jottings.value[index] = updatedJotting;
  }
  closeModal();
};
</script>