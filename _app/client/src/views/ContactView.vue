<template>
  <div class="contact-page">
    <div class="about-section">
      <h1>Contact Us</h1>
      <p>
        At ILYTAT, we're dedicated to helping you stay organized and productive.
        Our team is here to assist you with any questions, concerns, or feedback
        you may have.
      </p>
      
      <ContactInfo />
    </div>

    <ContactForm />
  </div>
</template>

<script setup>
import ContactInfo from '../components/ContactInfo.vue';
import ContactForm from '../components/ContactForm.vue';
</script>
