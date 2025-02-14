<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="form-group">
      <label for="email" class="form-label">Email</label>
      <div class="input-group">
        <span class="input-icon">
          <i class="fas fa-envelope"></i>
        </span>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
          placeholder="Enter your email"
          :disabled="loading"
        >
      </div>
    </div>

    <div class="form-group">
      <label for="password" class="form-label">Password</label>
      <div class="input-group">
        <span class="input-icon">
          <i class="fas fa-lock"></i>
        </span>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          required
          class="form-control"
          placeholder="Enter your password"
          :disabled="loading"
        >
        <button
          type="button"
          class="password-toggle"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <div class="form-group form-options">
      <label class="checkbox-label">
        <input type="checkbox" v-model="rememberMe">
        <span class="checkbox-text">Remember me</span>
      </label>
      <router-link to="/reset-password" class="auth-link forgot-link">
        Forgot Password?
      </router-link>
    </div>

    <button
      type="submit"
      class="btn btn-primary btn-block"
      :disabled="loading"
    >
      <span v-if="loading" class="spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
      </span>
      <span v-else>Sign In</span>
    </button>

    <!-- <div class="divider">
      <span>or continue with</span>
    </div> -->

    <!-- <div class="social-login">
      <button type="button" class="btn btn-outline social-btn" @click="handleGoogleLogin">
        <img src="@/assets/images/google-icon.svg" alt="Google" class="social-icon">
        Google
      </button>
      <button type="button" class="btn btn-outline social-btn" @click="handleGithubLogin">
        <i class="fab fa-github"></i>
        GitHub
      </button>
    </div> -->
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMessageStore } from '@/stores/messages';
import { useTaskStore } from '@/stores/tasks';

const email = ref('');
const password = ref('');
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const taskStore = useTaskStore();

const handleSubmit = async () => {
  loading.value = true;

  try {
    await authStore.login(email.value, password.value, rememberMe.value);
    
    // Show welcome banner
    messageStore.successBanner(
      `Welcome back, ${authStore.user?.name || 'User'}! Ready to be productive?`,
      '👋 Hello!',
      5000
    );

    // Fetch tasks for the welcome message
    await taskStore.fetchTasks();
    const activeTasks = taskStore.incompleteTasks.length;
    
    if (activeTasks > 0) {
      setTimeout(() => {
        messageStore.info(
          `You have ${activeTasks} tasks waiting for you.`,
          'Your Tasks',
          { position: 'bottom-right', duration: 4000 }
        );
      }, 1000);
    }

    router.push('/');
  } catch (error) {
    messageStore.error(
      error.message || 'Please check your credentials and try again.',
      'Login Failed'
    );
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = () => {
  // Implement Google login
};

const handleGithubLogin = () => {
  // Implement GitHub login
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-lighter);
}

.form-control {
  padding-left: 2.75rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-lighter);
  cursor: pointer;
  padding: 0.25rem;
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-text);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-text {
  margin-left: 0.5rem;
  color: var(--color-text);
}

.forgot-link {
  font-size: 0.875rem;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  display: inline-block;
  margin-right: 0.5rem;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.social-btn:hover {
  background: var(--color-background-alt);
  border-color: var(--color-text-lighter);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media screen and (max-width: 480px) {
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>