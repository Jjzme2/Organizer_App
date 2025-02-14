import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import EmailVerification from '../views/EmailVerification.vue'
import QuoteView from '../views/QuoteView.vue'
import NotebookView from '../views/NotebookView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import JottingsView from '../views/JottingsView.vue'
import ContactView from '../views/ContactView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks/new',
      name: 'new-task',
      component: () => import('../views/TasksView.vue'),
      meta: { requiresAuth: true, showNewModal: true }
    },
    {
      path: '/tasks/completed',
      name: 'completed-tasks',
      component: () => import('../views/CompletedTasksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks/incomplete',
      name: 'incomplete-tasks',
      component: () => import('../views/IncompleteTasksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/articles/new',
      name: 'new-article',
      component: ArticlesView,
      meta: { requiresAuth: true, showNewModal: true }
    },
    {
      path: '/jottings',
      name: 'jottings',
      component: JottingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/jottings/new',
      name: 'new-jotting',
      component: JottingsView,
      meta: { requiresAuth: true, showNewModal: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: NotebookView,
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: QuoteView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue')
    },
    {
      path: '/verify-email/:token',
      name: 'verify-email',
      component: EmailVerification
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Handle routes that require guest access (like login/register)
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
