import axios from 'axios';
import { CreateTodoDto, Todo, UpdateTodoDto, UploadResponse } from 'shared/services';


const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Type-safe API
export const baseApi = {
  async createTodo(data: CreateTodoDto): Promise<{status:number;data:Todo}> {
    const response = await api.post<Todo>('/news/create', data);
    return response;
  },

  async deleteTodo(id: number): Promise<{status:number;data:Todo}> {
  const response=  await api.delete(`/news/delete?id=${id}`);

  return response;
  },

  async getTodos(params: { limit: number }): Promise<{ status: number; data: { banners: Todo[]; count: number } }> {
    const response = await api.get<{ banners: Todo[]; count: number }>('/news/list', { params });

    return {
      status: response.status,
      data: {
        banners: response.data.banners,
        count: response.data.count
      }
    };
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

