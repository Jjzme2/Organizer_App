<template>
  <div class="register-view">
    <h1>Create Account</h1>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="fName">First Name</label>
        <input
          id="fName"
          v-model="form.fName"
          type="text"
          required
          placeholder="Enter your first name"
          @blur="validateFirstName"
        />
      </div>

      <div class="form-group">
        <label for="lName">Last Name</label>
        <input
          id="lName"
          v-model="form.lName"
          type="text"
          required
          placeholder="Enter your last name"
          @blur="validateLastName"
        />
      </div>

      <div class="form-group">
        <label for="name">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          placeholder="Enter your desired username"
          @blur="validateUsername"
        />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter your email"
          @blur="validateEmail"
        />
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter your password"
          autocomplete="new-password"
          @input="validatePassword"
        />
        <div class="password-strength" v-if="form.password">
          <div class="strength-meter" :class="passwordStrength"></div>
          <span class="strength-text">{{ passwordStrengthText }}</span>
        </div>
        <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="Confirm your password"
          @input="validateConfirmPassword"
        />
        <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading || !isFormValid">
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>

      <div class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  fName: '',
  lName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  fName: '',
  lName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const loading = ref(false)

// Password strength computation
const passwordStrength = computed(() => {
  if (!form.value.password) return ''

  let strength = 0
  const password = form.value.password

  // Length check
  if (password.length >= 8) strength++

  // Contains number
  if (/\d/.test(password)) strength++

  // Contains lowercase and uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++

  // Contains special characters
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

const isFormValid = computed(() => {
  return !Object.values(errors.value).some(error => error) &&
         Object.values(form.value).every(value => value) &&
         passwordStrength.value !== 'weak'
})

function validateFirstName() {
  if (form.value.fName.length < 2) {
    errors.value.fName = 'First name must be at least 2 characters long'
  } else {
    errors.value.fName = ''
  }
}

function validateLastName() {
  if (form.value.lName.length < 2) {
    errors.value.lName = 'Last name must be at least 2 characters long'
  } else {
    errors.value.lName = ''
  }
}

function validateUsername() {
  if (form.value.username.length < 2) {
    errors.value.username = 'Name must be at least 2 characters long'
  } else {
    errors.value.username = ''
  }
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = ''
  }
}

function validatePassword() {
  if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
  } else {
    errors.value.password = ''
  }
  validateConfirmPassword()
}

function validateConfirmPassword() {
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = ''
  }
}

async function handleSubmit() {
  if (loading.value || !isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    await authStore.register({
      fName: form.value.fName,
      lName: form.value.lName,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    router.push('/tasks')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

button {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  z-index: 1000;
}

.error-text {
  color: #ff0000;
  font-size: 12px;
}

.login-link {
  text-align: center;
  font-size: 14px;
}

a {
  color: #4CAF50;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.password-strength {
  margin-top: 5px;
}

.strength-meter {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 5px;
}

.strength-meter.weak {
  background-color: #ff5252;
  width: 25%;
}

.strength-meter.medium {
  background-color: #ffd740;
  width: 50%;
}

.strength-meter.strong {
  background-color: #4CAF50;
  width: 75%;
}

.strength-meter.very-strong {
  background-color: #00c853;
  width: 100%;
}

.strength-text {
  font-size: 12px;
  color: #666;
}
</style>
