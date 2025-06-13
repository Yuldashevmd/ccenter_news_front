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
      formData.append('file', file, { contentType: file.type }); // Match Swagger's 'file' and add MIME type
      const response = await api.post('/img-upload', formData); // Remove manual Content-Type header
      return response.data.Url;
    } catch (error) {
      console.error('Image upload error:', error.response?.data || error.message);
      throw error;
    }
  },

  async uploadFile(file) {
    try {
      // Fayl hajmini tekshirish (masalan, 5MB dan kichik bo'lishi kerak)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }
  
      // Qo'llab-quvvatlanadigan fayl tiplarini tekshirish
      const supportedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!supportedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.');
      }
  
      const formData = new FormData();
      formData.append('file', file, { contentType: file.type }); // Swaggerga mos field nomi va MIME type
      const response = await api.post('/img-upload', formData); // Avtomatik Content-Type bilan
      return response.data.Url; // file_link sifatida qaytariladi
    } catch (error) {
      console.error('File upload error:', error.response?.data || error.message);
      throw error;
    }
  },
};