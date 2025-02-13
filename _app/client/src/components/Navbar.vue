<template>
  <nav class="bg-primary text-white py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="nav-brand" @click="navTo('/')" style="cursor: pointer;">
        <!-- <img src="../assets/logo.png" alt="Logo" class="nav-logo" /> -->
        <span class="brand-name">ILYTAT Organizer</span>
      </div>
      <!-- <ul class="nav d-flex gap-4">
        <li><span class="nav-link" :class="{ 'active': $route.path === '/' }" @click="navTo('/')">Home</span></li>
        <li><span class="nav-link" :class="{ 'active': $route.path === '/tasks' }" @click="navTo('/tasks')">Tasks</span></li>
        <li><span class="nav-link" :class="{ 'active': $route.path === '/calendar' }" @click="navTo('/calendar')">Calendar</span></li>
        <li><span class="nav-link" :class="{ 'active': $route.path === '/notebook' }" @click="navTo('/notebook')">Notebook</span></li>
      </ul> -->
      <div class="d-flex align-items-center gap-3" style="cursor: pointer; margin-right: 10px;">
        <template v-if="isAuthenticated">
          <div class="user-menu" @click="toggleDropdown" ref="userMenu">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <div v-if="showDropdown" class="dropdown-menu">
              <div class="dropdown-header" @click="navTo('/profile')">
                <strong>{{ user?.name }}</strong>
                <span>{{ user?.email }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="logout">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn btn-outline-light" @click="navTo('/login#login-form')">Login</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)

const showDropdown = ref(false)
const userMenu = ref(null)

const userInitials = computed(() => {
  console.log(user.value)
  let firstInitial = user.value?.firstName ? user.value.firstName[0] : '?'
  let lastInitial = user.value?.lastName ? user.value.lastName[0] : '?'
  return `${firstInitial}${lastInitial}`.toUpperCase()
})

function navTo(path) {
  showDropdown.value = false
  router.push(path).then(() => {
    // Check if there's a hash in the path
    const hash = path.split('#')[1]
    if (hash) {
      // Wait for next tick to ensure the element exists
      nextTick(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  })
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleClickOutside(event) {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    showDropdown.value = false
  }
}

async function logout() {
  await authStore.logout()
  showDropdown.value = false
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>