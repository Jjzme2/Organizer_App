<template>
  <div class="reset-password-view">
    <h1>Reset Password</h1>
    <form @submit.prevent="handleSubmit" class="reset-password-form">
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input
          id="newPassword"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter new password"
          @input="validatePassword"
        />
        <div class="password-strength" v-if="form.password">
          <div class="strength-meter" :class="passwordStrength"></div>
          <span class="strength-text">{{ passwordStrengthText }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="Confirm new password"
          @input="validateConfirmPassword"
        />
        <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <button type="submit" :disabled="loading || !isValid">
        {{ loading ? 'Resetting Password...' : 'Reset Password' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  password: '',
  confirmPassword: ''
})
const error = ref('')
const success = ref('')
const loading = ref(false)
const passwordError = ref('')

// Reusing password strength logic from RegisterView
const passwordStrength = computed(() => {
  if (!form.value.password) return ''

  let strength = 0
  const password = form.value.password

  if (password.length >= 8) strength++
  if (/\d/.test(password)) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  return {
    0: 'weak',
    1: 'weak',
    2: 'medium',
    3: 'strong',
    4: 'very-strong'
  }[strength]
})

const passwordStrengthText = computed(() => {
  return {
    'weak': 'Weak password',
    'medium': 'Medium strength',
    'strong': 'Strong password',
    'very-strong': 'Very strong password'
  }[passwordStrength.value] || ''
})

const isValid = computed(() => {
  return form.value.password &&
         form.value.confirmPassword &&
         !passwordError.value &&
         passwordStrength.value !== 'weak'
})

function validatePassword() {
  if (form.value.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
  } else {
    passwordError.value = ''
  }
  validateConfirmPassword()
}

function validateConfirmPassword() {
  if (form.value.password !== form.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
}

async function handleSubmit() {
  if (loading.value || !isValid.value) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.resetPassword(route.params.token, form.value.password)
    success.value = 'Password reset successful'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

/* Reuse existing form and password strength styles from RegisterView */
.reset-password-form {
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
