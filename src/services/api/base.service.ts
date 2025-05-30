
import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TIMEOUT = 30000;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class BaseApiService {
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(endpoint);
    return response.data;
  }

  async upload<T>(endpoint: string, file: File, additionalData?: any): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response: AxiosResponse<T> = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new BaseApiService();
