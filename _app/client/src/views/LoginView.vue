<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="login-view">
        <div class="login-left animate-fade-in">
          <LoginForm />
        </div>

        <div class="login-right animate-slide-in">
          <LoginAnnouncer
            class="login-announcer"
            backgroundImage='/src/assets/images/hero-bg.jpg'
            mainText_1="Organize Your Life,"
            mainText_2="One Task at a Time"
            subText="A powerful, intuitive task management solution that helps you stay focused and productive"
            buttonText="Get Started - It's Free"
            buttonRoute="/register"
          />
          
          <FeatureList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginAnnouncer from '@/components/LoginAnnouncer.vue';
import LoginForm from '@/components/LoginForm.vue';
import FeatureList from '@/components/FeatureList.vue';
</script>