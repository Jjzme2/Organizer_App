<template>
  <div class="forgot-password-view">
    <h1>Reset Password</h1>
    <form @submit.prevent="handleSubmit" class="password-reset-form">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="Enter your registered email"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Sending Instructions...' : 'Send Reset Instructions' }}
      </button>

      <div class="login-link">
        Remember your password?
        <router-link to="/login">Login here</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (loading.value) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.requestPasswordReset(email.value)
    success.value = 'Password reset instructions have been sent to your email'
    email.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

/* Reuse existing form styles */
.password-reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.success-message {
  color: var(--color-success);
  padding: 10px;
  background-color: var(--color-success-light);
  border-radius: 4px;
}
</style>
