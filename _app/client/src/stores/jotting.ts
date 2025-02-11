import { defineStore } from 'pinia';
import api from '../services/api'; // Adjust the path as necessary

export const useJottingStore = defineStore('jotting', {
  state: () => ({
    jottings: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchJottings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/jottings');
        this.jottings = response.data;
      } catch (error) {
        this.error = 'Failed to fetch jottings';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCommentsByJottingId(jottingId: string) {
      try {
        const response = await api.get(`/jottings/${jottingId}/comments`);
        return response.data; // Return comments for the specific jotting
      } catch (error) {
        throw new Error('Failed to fetch comments for this jotting');
      }
    },

    async createJotting(jottingData: any) {
      try {
        const response = await api.post('/jottings', jottingData);
        this.jottings.push(response.data);
      } catch (error) {
        this.error = 'Failed to create jotting';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateJotting(jottingId: string, jottingData: any) {
      try {
        const response = await api.put(`/jottings/${jottingId}`, jottingData);
        const index = this.jottings.findIndex(j => j.id === jottingId);
        if (index !== -1) {
          this.jottings[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = 'Failed to update jotting';
        throw error;
      }
    },

    async deleteJotting(jottingId: string) {
      try {
        await api.delete(`/jottings/${jottingId}`);
        this.jottings = this.jottings.filter(j => j.id !== jottingId);
      } catch (error) {
        this.error = 'Failed to delete jotting';
        throw error;
      }
    },

    async fetchJottingById(jottingId: string) {
      try {
        const response = await api.get(`/jottings/${jottingId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch jotting');
      }
    },
  },
});
