<template>
  <BaseModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="'Edit Quote'"
  >
    <form @submit.prevent="handleSubmit" class="quote-form">
      <div class="form-group">
        <label for="text">Quote Text</label>
        <textarea
          id="text"
          v-model="formData.text"
          class="form-control"
          :class="{ 'is-invalid': errors.text }"
          rows="3"
          required
        ></textarea>
        <div v-if="errors.text" class="invalid-feedback">{{ errors.text }}</div>
      </div>

      <div class="form-group">
        <label for="author">Author</label>
        <input
          type="text"
          id="author"
          v-model="formData.author"
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select
          id="category"
          v-model="formData.category"
          class="form-control"
        >
          <option value="motivation">Motivation</option>
          <option value="success">Success</option>
          <option value="wisdom">Wisdom</option>
          <option value="leadership">Leadership</option>
          <option value="personal_growth">Personal Growth</option>
        </select>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-text"
          @click="$emit('update:show', false)"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Save Changes
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../ui/BaseModal.vue'

const props = defineProps({
  show: Boolean,
  quote: Object
})

const emit = defineEmits(['update:show', 'submit'])

const formData = reactive({
  text: props.quote?.text || '',
  author: props.quote?.author || '',
  category: props.quote?.category || 'motivation'
})

const errors = reactive({
  text: ''
})

function handleSubmit() {
  if (!formData.text.trim()) {
    errors.text = 'Quote text is required'
    return
  }

  emit('submit', {
    ...formData,
    id: props.quote?.id
  })
}
</script>
