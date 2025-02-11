<template>
  <BaseModal :show="true" @close="close">
    <template #header>
      <h2>{{ editMode ? 'Edit' : 'New' }} Article</h2>
    </template>

    <template #default>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="form.content" required></textarea>
        </div>
        <div class="form-group">
          <label for="isPublic">Make Public</label>
          <input type="checkbox" id="isPublic" v-model="form.isPublic" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useArticleStore } from '../../stores/article';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  article: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const editMode = computed(() => !!props.article);

const form = ref({
  title: '',
  description: '',
  isPublic: false,
  content: ''
});

onMounted(() => {
  if (props.article) {
    form.value = { ...props.article };
  }
});

const handleSubmit = async () => {
  try {
    await useArticleStore().createArticle({ ...form.value });
    close();
  } catch (error) {
    console.error('Error creating article:', error);
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-border);
}
</style>
