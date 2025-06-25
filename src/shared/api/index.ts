import axios from 'axios';
import { CreateTodoDto, Todo, UpdateTodoDto, UploadResponse } from 'shared/services';


const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Type-safe API
export const baseApi = {
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const response = await api.post<Todo>('/news/create', data);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/news/delete?id=${id}`);
  },

  async getTodos(): Promise<Todo[]> {
    const response = await api.get<{ banners: Todo[] }>('/news/list');
    return response.data.banners;
  },

  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo> {
    const response = await api.put<Todo>(`/news/update?id=${id}`, data);
    return response.data;
  },

  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/img-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  },

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/img-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }
};

