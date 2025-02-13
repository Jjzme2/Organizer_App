<template>
  <BaseModal 
    :show="show"
    :title="title"
    @close="close"
  >
    <template #default>
      <form @submit.prevent="handleSubmit" class="note-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            required 
            :placeholder="`Enter ${type.toLowerCase()} title`"
          />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea 
            id="content" 
            v-model="form.content" 
            required 
            :placeholder="`Enter ${type.toLowerCase()} content`"
          ></textarea>
        </div>

        <div class="form-group" v-if="type === 'Article'">
          <label for="url">URL</label>
          <input 
            type="url" 
            id="url" 
            v-model="form.url" 
            placeholder="Enter article URL"
          />
        </div>

        <div class="form-group" v-if="type === 'Jotting'">
          <label for="tags">Tags</label>
          <input 
            type="text" 
            id="tags" 
            v-model="tagInput"
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div class="form-group">
          <label for="isPublic">
            <input 
              type="checkbox" 
              id="isPublic" 
              v-model="form.isPublic"
            />
            Make Public
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" @click="close" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editMode ? 'Update' : 'Save' }} {{ type }}
          </button>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['Article', 'Jotting'].includes(value)
  },
  note: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'close', 'submit'])

const editMode = computed(() => !!props.note)
const title = computed(() => `${editMode.value ? 'Edit' : 'New'} ${props.type}`)

const tagInput = ref('')
const form = ref({
  title: '',
  content: '',
  url: '',
  isPublic: false,
  tags: []
})

onMounted(() => {
  if (props.note) {
    form.value = { ...props.note }
    if (props.type === 'Jotting' && props.note.tags) {
      tagInput.value = props.note.tags.join(', ')
    }
  }
})

function handleSubmit() {
  const formData = { ...form.value }
  
  if (props.type === 'Jotting') {
    formData.tags = tagInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }

  emit('submit', formData)
}

function close() {
  emit('update:show', false)
  emit('close')
  
  // Reset form
  form.value = {
    title: '',
    content: '',
    url: '',
    isPublic: false,
    tags: []
  }
  tagInput.value = ''
}
</script>

<style scoped>
.note-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
</style>
