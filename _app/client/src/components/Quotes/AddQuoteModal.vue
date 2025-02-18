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
import type { Quote } from '@/types'

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
  if (!formData.text.trim() || !formData.author.trim()) return

  submitting.value = true
  try {
    const quoteData: Partial<Quote> = {
      text: formData.text,
      author: formData.author,
      source: formData.source,
      category: formData.category as Quote['category']
    }

    const result = await quoteStore.createQuote(quoteData)
    if (result) {
      emit('quote-added', result)
      formData.text = ''
      formData.author = 'Unknown'
      formData.source = ''
      formData.category = 'motivation'
    }
  } catch (error: any) {
    errors.text = error.message || 'Failed to add quote'
  } finally {
    submitting.value = false
  }
}
</script>