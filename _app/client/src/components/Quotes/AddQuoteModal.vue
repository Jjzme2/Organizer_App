<template>
  <BaseModal
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="'Add New Quote'"
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
          placeholder="Enter the quote text..."
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
          placeholder="Unknown"
        >
      </div>

      <div class="form-group">
        <label for="source">Source (Optional)</label>
        <input
          type="text"
          id="source"
          v-model="formData.source"
          class="form-control"
          placeholder="Book, Speech, etc."
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
          :disabled="submitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting"
        >
          {{ submitting ? 'Adding...' : 'Add Quote' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuoteStore } from '../../stores/quote'
import BaseModal from '../modals/BaseModal.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'quote-added'])

const quoteStore = useQuoteStore()
const submitting = ref(false)
const errors = reactive({
  text: ''
})

const formData = reactive({
  text: '',
  author: 'Unknown',
  source: '',
  category: 'motivation'
})

const handleSubmit = async () => {
  errors.text = ''

  if (!formData.text.trim()) {
    errors.text = 'Quote text is required'
    return
  }

  if (formData.text.length > 1000) {
    errors.text = 'Quote text must be less than 1000 characters'
    return
  }

  try {
    submitting.value = true
    const quote = await quoteStore.createQuote({
      ...formData,
      author: formData.author.trim() || 'Unknown'
    })
    emit('quote-added', quote)
    emit('update:show', false)
    // Reset form
    formData.text = ''
    formData.author = 'Unknown'
    formData.source = ''
    formData.category = 'motivation'
  } catch (error: any) {
    errors.text = error.message || 'Failed to add quote'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.quote-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-control {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.form-control.is-invalid {
  border-color: var(--color-danger);
}

.invalid-feedback {
  color: var(--color-danger);
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

select.form-control {
  cursor: pointer;
}

@media (max-width: 768px) {
  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>
