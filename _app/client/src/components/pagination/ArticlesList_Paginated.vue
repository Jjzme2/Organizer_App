<template>
  <BasePaginatedList title="Articles" :items="articles" :itemsPerPage="5">
    <template #item="{ item }">
      <ArticleCard :article="item" @edit="$emit('edit', item)" @delete="$emit('delete', item.id)" />
    </template>
    <template #empty>
      <p>No articles found.</p>
    </template>
  </BasePaginatedList>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from '../../stores/article';
import BasePaginatedList from './BasePaginatedList.vue';
import ArticleCard from '../cards/ArticleCard.vue';

const articleStore = useArticleStore();
const articles = ref([]);

onMounted(async () => {
  await articleStore.fetchArticles();
  articles.value = articleStore.articles;
});
</script>
