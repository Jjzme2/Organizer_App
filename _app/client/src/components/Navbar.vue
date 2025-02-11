<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="nav-brand" @click="navTo('/')" style="cursor: pointer;">
        <!-- <img src="../assets/logo.png" alt="Logo" class="nav-logo" /> -->
        <span class="brand-name">ILYTAT Organizer</span>
      </div>

      <div class="nav-links">
        <span class="nav-link" :class="{ 'active': $route.path === '/' }" @click="navTo('/')">Home</span>
        <span class="nav-link" :class="{ 'active': $route.path === '/tasks' }" @click="navTo('/tasks')">Tasks</span>
        <span class="nav-link" :class="{ 'active': $route.path === '/calendar' }" @click="navTo('/calendar')">Calendar</span>
        <span class="nav-link" :class="{ 'active': $route.path === '/notebook' }" @click="navTo('/notebook')">Notebook</span>
      </div>

      <div class="nav-actions">
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
          <button class="btn btn-primary" @click="navTo('/login')">Login</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)

const showDropdown = ref(false)
const userMenu = ref(null)

const userInitials = computed(() => {
  // if (!user.value?.name) return '?'
  // return user.value.name
  //   .split(' ')
  //   .map(n => n[0])
  //   .join('')
  //   .toUpperCase()
  console.log(user.value)
  let firstInitial = user.value?.firstName ? user.value.firstName[0] : '?'
  let lastInitial = user.value?.lastName ? user.value.lastName[0] : '?'
  return `${firstInitial}${lastInitial}`.toUpperCase()
})

function navTo(path) {
  showDropdown.value = false
  router.push(path)
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

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: rgba(30, 41, 59, 0.115);
}

.navbar-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text);
  font-weight: 600;
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.nav-brand:hover {
  color: var(--color-primary);
}

.nav-logo {
  height: 2rem;
  width: auto;
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
}

.nav-link {
  color: var(--color-text-light);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  animation: slideDown 0.2s ease;
}

.dropdown-header {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-header:hover {
  background: var(--color-surface-hover);
}

.dropdown-header span {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: var(--color-surface-hover);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 var(--spacing-md);
  }

  .brand-name {
    font-size: 1rem;
  }

  .nav-links {
    gap: var(--spacing-sm);
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.875rem;
  }
}
</style>
