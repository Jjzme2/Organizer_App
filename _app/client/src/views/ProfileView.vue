<template>
  <div class="profile-view">
    <div class="profile-header">
      <h1>Profile</h1>
      <button @click="logout" class="logout-btn">
        Logout
      </button>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h2>Account Information</h2>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              :disabled="!isEditing"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :disabled="!isEditing"
              required
            />
          </div>

          <div v-if="isEditing" class="form-actions">
            <button type="button" @click="cancelEdit" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
          <button v-else type="button" @click="startEdit" class="edit-btn">
            Edit Profile
          </button>
        </form>
      </div>

      <div class="profile-section">
        <h2>Change Password</h2>
        <form @submit.prevent="updatePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              placeholder="Enter your current password"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              placeholder="Enter new password"
              @input="validateNewPassword"
            />
            <div class="password-strength" v-if="passwordForm.newPassword">
              <div class="strength-meter" :class="passwordStrength"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              placeholder="Confirm new password"
              @input="validateConfirmPassword"
            />
            <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
          </div>

          <button type="submit" :disabled="!isPasswordValid || passwordLoading">
            {{ passwordLoading ? 'Updating Password...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <div class="profile-section">
        <h2>Account Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Total Tasks</span>
            <span class="stat-value">{{ stats.totalTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed Tasks</span>
            <span class="stat-value">{{ stats.completedTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Tasks</span>
            <span class="stat-value">{{ stats.activeTasks }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Member Since</span>
            <span class="stat-value">{{ formatDate(stats.memberSince) }}</span>
          </div>
        </div>
      </div>

      <div class="profile-section danger-zone">
        <h2>Danger Zone</h2>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button @click="confirmDeleteAccount" class="delete-account-btn">
          Delete Account
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const { user } = storeToRefs(authStore)

const isEditing = ref(false)
const loading = ref(false)
const passwordLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const passwordError = ref('')

const form = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const stats = ref({
  totalTasks: 0,
  completedTasks: 0,
  activeTasks: 0,
  memberSince: user.value?.createdAt || new Date()
})

// Initialize form with user data
onMounted(async () => {
  if (user.value) {
    form.value.name = user.value.name
    form.value.email = user.value.email
    await fetchStats()
  }
})

async function fetchStats() {
  const tasks = taskStore.tasks
  stats.value = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.isComplete).length,
    activeTasks: tasks.filter(t => !t.isComplete).length,
    memberSince: user.value?.createdAt || new Date()
  }
}

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  form.value.name = user.value.name
  form.value.email = user.value.email
}

async function updateProfile() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Add this method to your auth store
    await authStore.updateProfile({
      name: form.value.name,
      email: form.value.email
    })
    isEditing.value = false
    successMessage.value = 'Profile updated successfully'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Password strength computation
const passwordStrength = computed(() => {
  if (!passwordForm.value.newPassword) return ''
  
  let strength = 0
  const password = passwordForm.value.newPassword
  
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

const isPasswordValid = computed(() => {
  return passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.currentPassword &&
         !passwordError.value &&
         passwordStrength.value !== 'weak'
})

function validateNewPassword() {
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
  } else {
    passwordError.value = ''
  }
  validateConfirmPassword()
}

function validateConfirmPassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
}

async function updatePassword() {
  if (passwordLoading.value || !isPasswordValid.value) return
  passwordLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Add this method to your auth store
    await authStore.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    successMessage.value = 'Password updated successfully'
  } catch (err) {
    error.value = err.message
  } finally {
    passwordLoading.value = false
  }
}

async function logout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    error.value = err.message
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function confirmDeleteAccount() {
  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      // Add this method to your auth store
      await authStore.deleteAccount()
      router.push('/register')
    } catch (err) {
      error.value = err.message
    }
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #555;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.logout-btn {
  background-color: #757575;
  color: white;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
}

.delete-account-btn {
  background-color: #ff5252;
  color: white;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.danger-zone {
  border: 1px solid #ff5252;
}

.danger-zone h2 {
  color: #ff5252;
}

.danger-zone p {
  color: #666;
  margin-bottom: 15px;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  animation: slideIn 0.3s ease-out;
}

.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background-color: #ff5252;
  color: white;
  border-radius: 4px;
  animation: slideIn 0.3s ease-out;
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

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>
