<template>
  <div class="contact-info">
    <div v-if="contactInfo">
      <p class="contact-item">
        <i class="fas fa-phone"></i>
        <a :href="`tel:${contactInfo.contactNumber}`">{{ contactInfo.contactNumber }}</a>
      </p>
      <p class="contact-item">
        <i class="fas fa-envelope"></i>
        <a :href="`mailto:${contactInfo.contactEmail}`">{{ contactInfo.contactEmail }}</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useContactStore } from '../stores/_contact';

const { contactInfo, fetchContactInfo } = useContactStore();

onMounted(async () => {
  await fetchContactInfo();
});
</script>