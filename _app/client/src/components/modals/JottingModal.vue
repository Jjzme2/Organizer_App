<template>
  <BaseModal :show="true" @close="close">
    <template #header>
      <h2>{{ editMode ? 'Edit' : 'New' }} Jotting</h2>
    </template>

    <template #default>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" v-model="form.content" required></textarea>
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
import BaseModal from './BaseModal.vue';

const props = defineProps({
  jotting: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const editMode = computed(() => !!props.jotting);

const form = ref({
  title: '',
  content: '',
  isPublic: false
});

onMounted(() => {
  if (props.jotting) {
    // Only copy the editable fields, not the ID or metadata
    const { title, content, isPublic } = props.jotting;
    form.value = { title, content, isPublic };
  }
});

const handleSubmit = () => {
  emit('submit', {
    ...(props.jotting ? { id: props.jotting.id } : {}), // Include ID only when editing
    ...form.value
  });
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
