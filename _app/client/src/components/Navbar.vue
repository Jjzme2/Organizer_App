<template>
  <nav class="bg-primary text-white py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="nav-brand d-flex align-items-center" @click="navTo('/')" style="cursor: pointer;">
        <img src="/icons/app-icon.svg" alt="Logo" class="nav-logo" style="width: 1.5rem; height: 1.5rem;" />
        <span class="brand-name">ILYTAT Organizer</span>
      </div>
      <ul class="nav d-flex gap-4">
        <li><router-link to="/" class="nav-link" :class="{ 'active': $route.path === '/' }">Home</router-link></li>
        <li>
          <router-link
            to="/tasks/incomplete"
            class="nav-link"
            :class="{ active: $route.path === '/tasks/incomplete' }"
          >
            <i class="fas fa-tasks"></i> Incomplete Tasks
          </router-link>
        </li>
        <li>
          <router-link
            to="/tasks/by-category"
            class="nav-link"
            :class="{ active: $route.path === '/tasks/by-category' }"
          >
            <i class="fas fa-folder"></i> By Category
          </router-link>
        </li>
        <li><router-link to="/calendar" class="nav-link" :class="{ 'active': $route.path === '/calendar' }">Calendar</router-link></li>
        <li><router-link to="/notebook" class="nav-link" :class="{ 'active': $route.path === '/notebook' }">Notebook</router-link></li>
      </ul>
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