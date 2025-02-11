import axios from 'axios';

const API_BASE = '/api';

export const ArticlesAPI = {
  getAll: () => axios.get(`${API_BASE}/articles`),
  get: (id) => axios.get(`${API_BASE}/articles/${id}`),
  create: (data) => axios.post(`${API_BASE}/articles`, data),
  update: (id, data) => axios.put(`${API_BASE}/articles/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/articles/${id}`)
};

export const JottingsAPI = {
  getAll: () => axios.get(`${API_BASE}/jottings`),
  get: (id) => axios.get(`${API_BASE}/jottings/${id}`),
  create: (data) => axios.post(`${API_BASE}/jottings`, data),
  update: (id, data) => axios.put(`${API_BASE}/jottings/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/jottings/${id}`)
};

export const ArticleCommentsAPI = {
  getAll: (articleId) => axios.get(`${API_BASE}/articles/${articleId}/comments`),
  create: (articleId, data) => axios.post(`${API_BASE}/articles/${articleId}/comments`, data),
  update: (articleId, commentId, data) => axios.put(`${API_BASE}/articles/${articleId}/comments/${commentId}`, data),
  delete: (articleId, commentId) => axios.delete(`${API_BASE}/articles/${articleId}/comments/${commentId}`)
};

export const JottingCommentsAPI = {
  getAll: (jottingId) => axios.get(`${API_BASE}/jottings/${jottingId}/comments`),
  create: (jottingId, data) => axios.post(`${API_BASE}/jottings/${jottingId}/comments`, data),
  update: (jottingId, commentId, data) => axios.put(`${API_BASE}/jottings/${jottingId}/comments/${commentId}`, data),
  delete: (jottingId, commentId) => axios.delete(`${API_BASE}/jottings/${jottingId}/comments/${commentId}`)
};
