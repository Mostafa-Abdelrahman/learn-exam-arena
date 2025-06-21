
import axios, { AxiosResponse, AxiosError } from 'axios';
import { StandardApiResponse, ApiErrorResponse } from '@/types/api-response';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TIMEOUT = 30000;

// Create axios instance with secure defaults
const secureApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Security headers and token management
secureApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp and ID for tracking
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with standardized error handling
secureApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Normalize response to standard format
    if (response.data && !response.data.hasOwnProperty('success')) {
      return {
        ...response,
        data: {
          success: true,
          data: response.data,
          meta: {
            timestamp: new Date().toISOString(),
            request_id: response.config.headers['X-Request-ID']
          }
        }
      };
    }
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Don't auto-redirect, let components handle it
    }
    
    // Standardize error response
    const errorData = error.response?.data || {};
    const standardError: ApiErrorResponse = {
      success: false,
      message: errorData.message || error.message || 'An unexpected error occurred',
      errors: errorData.errors,
      error_code: errorData.error_code || `HTTP_${error.response?.status}`,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: error.config?.headers?.['X-Request-ID']
      }
    };
    
    return Promise.reject({ ...error, standardError });
  }
);

// Utility function to generate unique request IDs
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generic API methods with proper typing
class SecureApiService {
  async get<T>(endpoint: string, params?: any): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.patch(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  async delete<T>(endpoint: string): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.delete(endpoint);
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  // Secure file upload with size limits
  async upload<T>(endpoint: string, file: File, additionalData?: any, maxSize: number = 10 * 1024 * 1024): Promise<StandardApiResponse<T>> {
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      });
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }

  // Bulk operations with proper error handling
  async bulkOperation<T>(endpoint: string, operations: any[]): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse<StandardApiResponse<T>> = await secureApiClient.post(endpoint, { operations });
      return response.data;
    } catch (error: any) {
      throw error.standardError || error;
    }
  }
}

export default new SecureApiService();
