<template>
  <div class="email-verification-view">
    <div v-if="loading" class="verification-status">
      <h1>Verifying Email...</h1>
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="success" class="verification-status success">
      <h1>Email Verified!</h1>
      <p>{{ success }}</p>
      <router-link to="/login" class="btn btn-primary">
        Proceed to Login
      </router-link>
    </div>

    <div v-else-if="error" class="verification-status error">
      <h1>Verification Failed</h1>
      <p>{{ error }}</p>
      <button @click="resendVerification" :disabled="resending" class="btn">
        {{ resending ? 'Sending...' : 'Resend Verification Email' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const success = ref('')
const resending = ref(false)

onMounted(async () => {
  try {
    const result = await authStore.verifyEmail(route.params.token)
    success.value = result.message
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

async function resendVerification() {
  if (resending.value) return

  resending.value = true
  try {
    const result = await authStore.resendVerification()
    success.value = result.message
    error.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    resending.value = false
  }
}
</script>
