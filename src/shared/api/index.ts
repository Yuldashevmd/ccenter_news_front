import axios from 'axios';

const API_BASE_URL = 'http://35.154.102.246:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default {
  async createTodo(data) {
    return api.post('/news/create', {
      date: data.date,
      file_link: data.file_link,
      img_url: data.image_link,
      label: data.label,
      text: data.text,
      title: data.title,
    });
  },

  async deleteTodo(id) {
    return api.delete(`/news/delete?id=${id}`);
  },

  async getTodos() {
    const response = await api.get('/news/list');
    return { data: response.data.banners };
  },

  async updateTodo(id, data) {
    return api.put(`/news/update?id=${id}`, {
      date: data.date,
      file_link: data.file_link,
      img_url: data.image_link,
      label: data.label,
      text: data.text,
      title: data.title,
    });
  },

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/img-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Return the full response to be handled by the calling function
      return response;
    } catch (error) {
      console.error('Image upload error:', error.response?.data || error.message);
      throw error;
    }
  },

  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/img-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Return the full response to be handled by the calling function
      return response;
    } catch (error) {
      console.error('File upload error:', error.response?.data || error.message);
      throw error;
    }
  }
};
