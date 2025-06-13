import axios from 'axios';

const API_BASE_URL = 'http://35.154.102.246:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers (pseudo-token for session)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Create a new todo
  async createTodo(data) {
    return api.post('/news/create', {
      date: data.date,
      file_link: data.file_link,
      img_url: data.img_url,
      label: data.label,
      text: data.text,
      title: data.title,
    });
  },

  // Delete a todo
  async deleteTodo(id) {
    return api.delete(`/news/delete?id=${id}`);
  },

  // Get todo list
  async getTodos() {
    const response = await api.get('/news/list');
    return { data: response.data.banners }; // Extract banners array
  },

  // Update a todo
  async updateTodo(id, data) {
    return api.put(`/news/update?id=${id}`, {
      date: data.date,
      file_link: data.file_link,
      img_url: data.img_url,
      label: data.label,
      text: data.text,
      title: data.title,
    });
  },

  // Upload image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/img-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.img_url; // Assuming API returns { img_url: "url" }
  },

  // Get pseudo-user ID (not used with new API)
  getUserId() {
    return localStorage.getItem('token') || null;
  },
};