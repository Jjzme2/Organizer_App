import { defineStore } from 'pinia'
import api from '../services/api'

interface Quote {
  id: string
  text: string
  author: string
  source?: string
  category: 'motivation' | 'success' | 'wisdom' | 'leadership' | 'personal_growth'
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    quotes: [] as Quote[],
    randomQuote: null as Quote | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    favoriteQuotes: (state) => state.quotes.filter(quote => quote.isFavorite),
    getQuoteById: (state) => (id: string) => state.quotes.find(quote => quote.id === id)
  },

  actions: {
    async fetchQuotes() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/quotes')
        this.quotes = response.data
      } catch (error) {
        this.error = 'Failed to fetch quotes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRandomQuote() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/quotes/random')
        this.randomQuote = response.data
      } catch (error) {
        this.error = 'Failed to fetch random quote'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createQuote(quote: Partial<Quote>) {
      this.error = null
      try {
        const response = await api.post('/quotes', quote)
        this.quotes.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = 'Failed to create quote'
        throw error
      }
    },

    async toggleFavorite(id: string) {
      this.error = null
      try {
        const response = await api.put(`/quotes/${id}/favorite`)
        const index = this.quotes.findIndex(q => q.id === id)
        if (index !== -1) {
          this.quotes[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Failed to toggle favorite'
        throw error
      }
    },

    async deleteQuote(id: string) {
      this.error = null
      try {
        await api.delete(`/api/quotes/${id}`)
        this.quotes = this.quotes.filter(q => q.id !== id)
      } catch (error) {
        this.error = 'Failed to delete quote'
        throw error
      }
    },

    async updateQuote(id: string, data: Partial<Quote>) {
      this.error = null
      try {
        const response = await api.put(`/quotes/${id}`, data)
        const index = this.quotes.findIndex(q => q.id === id)
        if (index !== -1) {
          this.quotes[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Failed to update quote'
        throw error
      }
    }
  }
})
