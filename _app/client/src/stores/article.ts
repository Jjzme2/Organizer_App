import { defineStore } from 'pinia';
import api from '../services/api'; // Adjust the path as necessary

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [] as any[],
    loading: false,
    error: null as string | null,

  }),

  actions: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/articles');
        this.articles = response.data;
      } catch (error) {
        this.error = 'Failed to fetch articles';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCommentsByArticleId(articleId: string) {
      try {
        const response = await api.get(`/articles/${articleId}/comments`);
        return response.data; // Return comments for the specific article
      } catch (error) {
        throw new Error('Failed to fetch comments for this article');
      }
    },

    async createArticle(articleData: any) {
      try {
        const response = await api.post('/articles', articleData);
        this.articles.push(response.data);
      } catch (error) {
        this.error = 'Failed to create article';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});
