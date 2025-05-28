
import ApiService from './api.service';

export interface Major {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateMajorData {
  name: string;
  code: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateMajorData {
  name?: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

class MajorService {
  async getAllMajors(): Promise<{ data: Major[] }> {
    return await ApiService.get('/admin/majors');
  }

  async getMajorById(majorId: string): Promise<{ data: Major }> {
    return await ApiService.get(`/admin/majors/${majorId}`);
  }

  async createMajor(majorData: CreateMajorData): Promise<{ major: Major; message: string }> {
    return await ApiService.post('/admin/majors', majorData);
  }

  async updateMajor(majorId: string, majorData: UpdateMajorData): Promise<{ major: Major; message: string }> {
    return await ApiService.put(`/admin/majors/${majorId}`, majorData);
  }

  async deleteMajor(majorId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/majors/${majorId}`);
  }
}

export default new MajorService();
