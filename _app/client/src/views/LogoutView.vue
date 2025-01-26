<template>
  <div class="logout-view">
    <MessageBox
      type="info"
      message="Logging you out..."
      :show-icon="true"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MessageBox from '../components/MessageBox.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.logout()
  router.push('/login')
})
</script>

<style scoped>
.logout-view {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}
</style>
