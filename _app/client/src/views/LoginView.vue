<template>
  <div class="login-wrapper">
<div class="login-view">
  <div class="login-left">
    <LoginForm />
  </div>
  <div class="login-right">
    <LoginAnnouncer
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

</template>

<script setup>
import LoginAnnouncer from '@/components/LoginAnnouncer.vue';
import LoginForm from '@/components/LoginForm.vue';
import FeatureList from '@/components/FeatureList.vue';
</script>

<style scoped>
.login-wrapper {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
min-height: 100vh;
}
.login-form {
width: 100%;
max-width: 400px;
margin: 0 auto;
padding: 1rem;
border: 1px solid #ccc;
border-radius: 4px;
}

.login-view {
  display: flex; /* Use flexbox to create a responsive layout */
  justify-content: space-between; /* Space between child elements */
  align-items: center; /* Center items vertically */
  padding: 20px;
  border-radius: 8px; /* Rounded corners for a softer look */
}

.login-left {
  flex: 1; /* Allows the login form section to take the remaining space */
  width: 500px; /* Widen the login form */
  padding: 20px; /* Padding around content */
}

.login-right {
  flex: 0 0 300px; /* Narrow the right column */
  display: flex;
  flex-direction: column; /* Stack announcer and feature list vertically */
  gap: 20px; /* Space between announcer and feature list */
}

.login-announcer {
  flex: 1; /* Allows the LoginAnnouncer to take the remaining space */
  margin-left: 20px; /* Space between feature list and announcer */
  background-image: url('/src/assets/images/hero-bg.jpg'); /* Background image */
  background-size: cover; /* Ensure the background covers the area */
  border-radius: 8px; /* Match rounded corners */
  color: white; /* Text color for contrast against background */
  padding: 20px; /* Padding around content */
  display: flex; /* Flexbox for internal alignment */
  flex-direction: column; /* Stack text vertically */
  justify-content: center; /* Center vertically */
}

.feature-list {
  margin-left: 20px; /* Space between announcer and feature list */
  flex: 1; /* Allows the FeatureList to take the remaining space */
  border-radius: 8px; /* Match rounded corners */
  padding: 20px; /* Padding around content */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-view {
    flex-direction: column; /* Stack elements vertically on smaller screens */
  }

  .login-left,
  .login-right {
    max-width: none; /* Remove max width to allow full use of space */
    width: 100%; /* Full width in mobile view */
  }

  .login-wrapper {
padding: 1rem;
}
}
</style>
