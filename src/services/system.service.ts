
import api from '../api/config';

export interface QuestionType {
  id: string;
  name: string;
  description: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_at: string;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  services: {
    database: string;
    redis: string;
    storage: string;
  };
  uptime: number;
  version: string;
}

const SystemService = {
  // Question Types
  async getQuestionTypes(): Promise<{ data: QuestionType[] }> {
    const response = await api.get('/question-types');
    return response.data;
  },

  // File Upload
  async uploadFile(file: File, type: 'image' | 'document'): Promise<{ message: string; file: FileUpload }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get('/health');
    return response.data;
  }
};

export default SystemService;
