
import ApiService from './api.service';
import { Major, CreateMajorData, UpdateMajorData } from '@/types/major';

class MajorService {
  async getAllMajors(): Promise<{ data: Major[] }> {
    return await ApiService.get('/admin/majors');
  }

  async getMajorById(majorId: string): Promise<{ data: Major }> {
    return await ApiService.get(`/admin/majors/${majorId}`);
  }

  async createMajor(majorData: CreateMajorData): Promise<{ data: Major; message: string }> {
    return await ApiService.post('/admin/majors', majorData);
  }

  async updateMajor(majorId: string, majorData: UpdateMajorData): Promise<{ data: Major; message: string }> {
    return await ApiService.put(`/admin/majors/${majorId}`, majorData);
  }

  async deleteMajor(majorId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/majors/${majorId}`);
  }

  async getMajorStats(): Promise<{ data: any }> {
    return await ApiService.get('/admin/majors/stats');
  }
}

export default new MajorService();
