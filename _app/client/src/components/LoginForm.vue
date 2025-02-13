<template>
  <div id="login-form" class="container d-flex justify-center align-items-center" style="min-height: 80vh;">
    <div class="p-4">
      <header class="text-center mb-3">
        <h2 class="text-2xl font-semibold">Login</h2>
      </header>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="email" required class="form-control">
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" v-model="password" required class="form-control">
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="icon icon--spin mr-2"></span>
          Login
        </button>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </form>

      <div class="text-center mt-3">
        <router-link to="/reset-password" class="text-muted">Forgot Password?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const handleSubmit = async () => {
      loading.value = true;
      errorMessage.value = '';

      try {
        await authStore.login(email.value, password.value);
        router.push('/');
      } catch (error) {
        errorMessage.value = error.message || 'Invalid credentials';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      errorMessage,
      handleSubmit,
    };
  },
};
</script>