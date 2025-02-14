<template>
  <form @submit.prevent="handleSubmit" class="contact-form">
    <div class="form-group">
      <label class="form-label" for="name">Name</label>
      <input
        type="text"
        id="name"
        v-model="formData.name"
        required
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
      />
      <FieldMessage
        v-if="errors.name"
        :message="errors.name"
        type="error"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="email">Email</label>
      <input
        type="email"
        id="email"
        v-model="formData.email"
        required
        class="form-control"
        :class="{ 'is-invalid': errors.email }"
      />
      <FieldMessage
        v-if="errors.email"
        :message="errors.email"
        type="error"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="message">Message</label>
      <textarea
        id="message"
        v-model="formData.message"
        rows="5"
        required
        class="form-control"
        :class="{ 'is-invalid': errors.message }"
      ></textarea>
      <FieldMessage
        v-if="errors.message"
        :message="errors.message"
        type="error"
      />
    </div>

    <button type="submit" :disabled="isSubmitting" class="btn btn-primary submit-button">
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>

    <div v-if="submitStatus" :class="['status-message', submitStatus]">
      {{ statusMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useContactStore } from '@/stores/_contact';
import { useMessageStore } from '@/stores/messages';
import FieldMessage from './messages/FieldMessage.vue';

const contactStore = useContactStore();
const messageStore = useMessageStore();

const formData = reactive({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const errors = reactive({
  name: '',
  email: '',
  message: ''
});
const submitStatus = ref('');
const statusMessage = ref('');

const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');
  
  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Message validation
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  try {
    await contactStore.sendContactForm(formData);
    
    // Show success message
    messageStore.success('Your message has been sent successfully!', 'Thank You');
    
    // Reset form
    formData.name = '';
    formData.email = '';
    formData.message = '';
    
    submitStatus.value = 'success';
    statusMessage.value = 'Message sent successfully! We\'ll get back to you soon.';
  } catch (err) {
    messageStore.error(
      err.message || 'There was an error sending your message. Please try again.',
      'Error'
    );
    
    submitStatus.value = 'error';
    statusMessage.value = 'There was an error sending your message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>