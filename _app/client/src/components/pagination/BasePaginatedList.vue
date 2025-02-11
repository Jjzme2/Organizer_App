<template>
  <div class="paginated-list">
    <div class="list-header">
      <h2>{{ title }} <span class="item-count">({{ items.length }})</span></h2>
      <slot name="actions" />
    </div>
    <TransitionGroup name="list" tag="div" class="list">
      <slot name="item" v-for="item in paginatedItems" :key="item.id" :item="item" />
    </TransitionGroup>
    <div v-if="!paginatedItems.length" class="empty-state">
      <slot name="empty">
        <p>No items found</p>
      </slot>
    </div>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 5
  }
});

const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  return props.items.slice(start, start + props.itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
.paginated-list {
  margin: 16px 0;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
