<template>
  <div class="reset-password-view container">
    <h1 class="section-title">Reset Password</h1>
    <form @submit.prevent="handleSubmit" class="form-group animate-fade-in">
      <div class="form-group">
        <label for="newPassword" class="form-label">New Password</label>
        <input
          id="newPassword"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter new password"
          @input="validatePassword"
          class="form-control"
        />
        <div v-if="form.password" class="mt-2">
          <div class="slider-container">
            <div class="slider-input-container">
              <div class="slider-input" :class="passwordStrength"></div>
            </div>
            <span class="slider-value text-sm">{{ passwordStrengthText }}</span>
          </div>
        </div>
      </div>

      <div class="form-group mt-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="Confirm new password"
          @input="validateConfirmPassword"
          class="form-control"
        />
        <span v-if="passwordError" class="text-danger text-sm mt-1">{{ passwordError }}</span>
      </div>

      <div v-if="error" class="message-box message-box--error mt-3">
        <div class="message-box__content">
          <span class="message-box__text">{{ error }}</span>
        </div>
      </div>

      <div v-if="success" class="message-box message-box--success mt-3">
        <div class="message-box__content">
          <span class="message-box__text">{{ success }}</span>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="loading || !isValid"
        class="btn btn-primary mt-4 d-flex items-center justify-center"
      >
        <span v-if="loading" class="icon icon--spin mr-2"></span>
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