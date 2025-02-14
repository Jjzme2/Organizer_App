<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Left Side - Login Form -->
      <div class="login-left animate-fade-in">
        <div class="login-header">
          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">Sign in to continue to your workspace</p>
        </div>
        <LoginForm />
        <div class="form-footer">
          <p>Don't have an account? <router-link to="/register" class="auth-link">Create one</router-link></p>
        </div>
      </div>

      <!-- Right Side - Feature Showcase -->
      <div class="login-right animate-slide-in">
        <div class="hero-section">
          <div class="hero-content">
            <h2 class="hero-title">Organize Your Work</h2>
            <p class="hero-subtitle">Join thousands of users who trust our platform</p>
          </div>
        </div>
        <FeatureCarousel />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue';
import FeatureCarousel from '@/components/features/FeatureCarousel.vue';
</script>

<style>
@import '@/assets/css/views/login.css';
</style>