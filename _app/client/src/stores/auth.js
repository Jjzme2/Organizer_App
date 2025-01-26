import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { setToken, clearToken } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, accessToken, refreshToken: newRefreshToken } = response.data
      
      user.value = userData
      token.value = accessToken
      refreshToken.value = newRefreshToken
      
      setToken(accessToken)
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
    localStorage.removeItem('userToken'); // Clear token from local storage
  }

  async function updatePassword(data) {
    try {
      const response = await api.put('/auth/update-password', data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating password')
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
    updatePassword
  }
})
