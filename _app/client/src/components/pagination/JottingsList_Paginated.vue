<template>
  <BasePaginatedList title="Jottings" :items="jottings" :itemsPerPage="5">
    <template #item="{ item }">
      <JottingCard :jotting="item" @edit="$emit('edit', item)" @delete="$emit('delete', item.id)" />
    </template>
    <template #empty>
      <p>No jottings found.</p>
    </template>
  </BasePaginatedList>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useJottingStore } from '../../stores/jotting';
import BasePaginatedList from './BasePaginatedList.vue';
import JottingCard from '../cards/JottingCard.vue';

const jottingStore = useJottingStore();
const jottings = ref([]);

onMounted(async () => {
  await jottingStore.fetchJottings();
  jottings.value = jottingStore.jottings;
});
</script>
