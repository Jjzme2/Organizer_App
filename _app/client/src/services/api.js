import axios from 'axios'
import { navigate } from '../utils/navigation'
import { useAuthStore } from '../stores/auth'

// Create API instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let currentToken = localStorage.getItem('token')

// Update token
export const setToken = (token) => {
  currentToken = token
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

// Clear token
export const clearToken = () => {
  currentToken = null
  localStorage.removeItem('token')
}

// Add token to requests
api.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check for redirect header
    const redirectUrl = error.response?.headers?.['x-redirect']
    if (redirectUrl) {
      // Clear auth state when redirecting to login
      if (redirectUrl === '/login') {
        const authStore = useAuthStore()
        authStore.logout()
      }
      navigate(redirectUrl)
      return Promise.reject(error)
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post('http://localhost:3000/api/auth/refresh', {
          refreshToken,
        })

        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data

        // Update tokens
        setToken(newToken)
        localStorage.setItem('token', newToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Fetch updated user data
        const authStore = useAuthStore()
        await authStore.fetchCurrentUser()

        // Update the failed request's token and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        const authStore = useAuthStore()
        authStore.logout()
        navigate('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
