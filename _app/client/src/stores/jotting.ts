import { defineStore } from 'pinia';
import api from '../services/api';

interface Jotting {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublic: boolean;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface JottingState {
  jottings: Jotting[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
}

export const useJottingStore = defineStore('jotting', {
  state: (): JottingState => ({
    jottings: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: ''
  }),

  getters: {
    publicJottings: (state) => state.jottings.filter(j => j.isPublic),
    privateJottings: (state) => state.jottings.filter(j => !j.isPublic),
    sortedByDate: (state) => [...state.jottings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    filteredJottings: (state) => {
      if (!state.searchQuery) return state.jottings;
      const query = state.searchQuery.toLowerCase();
      return state.jottings.filter(j => 
        j.title.toLowerCase().includes(query) || 
        j.content.toLowerCase().includes(query)
      );
    },
    paginatedJottings: (state) => {
      const filtered = state.jottings;
      const start = (state.currentPage - 1) * state.itemsPerPage;
      return filtered.slice(start, start + state.itemsPerPage);
    },
    totalPages: (state) => 
      Math.ceil(state.jottings.length / state.itemsPerPage)
  },

  actions: {
    async fetchJottings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/jottings');
        this.jottings = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch jottings';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchJottingById(jottingId: string) {
      try {
        const response = await api.get(`/jottings/${jottingId}`);
        const index = this.jottings.findIndex(j => j.id === jottingId);
        if (index !== -1) {
          this.jottings[index] = response.data;
        } else {
          this.jottings.push(response.data);
        }
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch jotting');
      }
    },

    async createJotting(jottingData: Omit<Jotting, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const response = await api.post('/jottings', jottingData);
        this.jottings.unshift(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create jotting';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateJotting(jottingId: string, jottingData: Partial<Jotting>) {
      try {
        const response = await api.put(`/jottings/${jottingId}`, jottingData);
        const index = this.jottings.findIndex(j => j.id === jottingId);
        if (index !== -1) {
          this.jottings[index] = { ...this.jottings[index], ...response.data };
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update jotting';
        throw error;
      }
    },

    async deleteJotting(jottingId: string) {
      try {
        await api.delete(`/jottings/${jottingId}`);
        this.jottings = this.jottings.filter(j => j.id !== jottingId);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete jotting';
        throw error;
      }
    },

    async fetchCommentsByJottingId(jottingId: string) {
      try {
        const response = await api.get(`/jottings/${jottingId}/comments`);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch comments');
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page when searching
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setItemsPerPage(items: number) {
      this.itemsPerPage = items;
      this.currentPage = 1; // Reset to first page when changing items per page
    }
  },
});
