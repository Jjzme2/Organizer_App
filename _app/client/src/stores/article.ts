import { defineStore } from 'pinia';
import api from '../services/api';

interface Article {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublic: boolean;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10
  }),

  getters: {
    publicArticles: (state) => state.articles.filter(a => a.isPublic),
    privateArticles: (state) => state.articles.filter(a => !a.isPublic),
    sortedByDate: (state) => [...state.articles].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    paginatedArticles: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      return state.articles.slice(start, start + state.itemsPerPage);
    }
  },

  actions: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/articles');
        this.articles = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch articles';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchArticleById(articleId: string) {
      try {
        const response = await api.get(`/articles/${articleId}`);
        const index = this.articles.findIndex(a => a.id === articleId);
        if (index !== -1) {
          this.articles[index] = response.data;
        } else {
          this.articles.push(response.data);
        }
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch article');
      }
    },

    async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const response = await api.post('/articles', articleData);
        this.articles.unshift(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create article';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateArticle(articleId: string, articleData: Partial<Article>) {
      try {
        const response = await api.put(`/articles/${articleId}`, articleData);
        const index = this.articles.findIndex(a => a.id === articleId);
        if (index !== -1) {
          this.articles[index] = { ...this.articles[index], ...response.data };
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update article';
        throw error;
      }
    },

    async deleteArticle(articleId: string) {
      try {
        await api.delete(`/articles/${articleId}`);
        this.articles = this.articles.filter(a => a.id !== articleId);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete article';
        throw error;
      }
    },

    async fetchCommentsByArticleId(articleId: string) {
      try {
        const response = await api.get(`/articles/${articleId}/comments`);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch comments');
      }
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
