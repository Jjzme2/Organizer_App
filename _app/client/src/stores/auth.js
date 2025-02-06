import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { setToken, clearToken } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))

  const isAuthenticated = computed(() => !!token.value)

  async function fetchCurrentUser() {
    try {
      if (!token.value) return null

      const response = await api.get('/auth/me')
      user.value = response.data.user
      return user.value
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
      return null
    }
  }

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, accessToken, refreshToken: newRefreshToken } = response.data

      user.value = userData
      token.value = accessToken
      refreshToken.value = newRefreshToken

      setToken(accessToken)
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      return userData
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/auth/register', userData)

      const { user: newUser, accessToken, refreshToken: newRefreshToken } = response.data

      user.value = newUser
      token.value = accessToken
      refreshToken.value = newRefreshToken

      setToken(accessToken)
      // localStorage.setItem('token', accessToken) // Save token to local storage
      localStorage.setItem('refreshToken', newRefreshToken)

      return newUser
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  function logout() {
    user.value = null
    token.value = null
    refreshToken.value = null
    clearToken()
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  async function updatePassword(data) {
    try {
      const response = await api.put('/auth/update-password', data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating password')
    }
  }

  // Initialize auth state
  async function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      setToken(storedToken)
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        logout()
      }
    }
  }

  async function requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/request-reset', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error requesting password reset')
    }
  }

  async function resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/update-password', {
        token,
        newPassword
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error resetting password')
    }
  }

  async function verifyEmail(token) {
    try {
      const response = await api.post(`/auth/verify-email/${token}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error verifying email')
    }
  }

  async function resendVerification() {
    try {
      const response = await api.post('/auth/resend-verification')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error resending verification email')
    }
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    register,
    logout,
    updatePassword,
    fetchCurrentUser,
    initializeAuth,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification
  }
})
