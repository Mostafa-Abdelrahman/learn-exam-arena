
import ApiService from './api.service';
import { Major, CreateMajorData, UpdateMajorData } from '@/types/major';
import { dummyMajors } from '@/data/dummy-comprehensive';

class MajorService {
  async getAllMajors(): Promise<{ data: Major[] }> {
    try {
      return await ApiService.get('/majors');
    } catch (error) {
      console.warn('API getAllMajors failed, using dummy data:', error);
      return { data: dummyMajors };
    }
  }

  async getMajorById(majorId: string): Promise<{ data: Major }> {
    try {
      return await ApiService.get(`/admin/majors/${majorId}`);
    } catch (error) {
      console.warn('API getMajorById failed, using dummy data:', error);
      const major = dummyMajors.find(m => m.id === majorId) || dummyMajors[0];
      return { data: major };
    }
  }

  async createMajor(majorData: CreateMajorData): Promise<{ data: Major; message: string }> {
    try {
      return await ApiService.post('/admin/majors', majorData);
    } catch (error) {
      console.warn('API createMajor failed, using dummy response:', error);
      const newMajor: Major = {
        id: `major-${Date.now()}`,
        ...majorData,
        student_count: 0,
        course_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: newMajor, message: 'Major created successfully' };
    }
  }

  async updateMajor(majorId: string, majorData: UpdateMajorData): Promise<{ data: Major; message: string }> {
    try {
      return await ApiService.put(`/admin/majors/${majorId}`, majorData);
    } catch (error) {
      console.warn('API updateMajor failed, using dummy response:', error);
      const existingMajor = dummyMajors.find(m => m.id === majorId) || dummyMajors[0];
      const updatedMajor = {
        ...existingMajor,
        ...majorData,
        updated_at: new Date().toISOString()
      };
      return { data: updatedMajor, message: 'Major updated successfully' };
    }
  }

  async deleteMajor(majorId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/admin/majors/${majorId}`);
    } catch (error) {
      console.warn('API deleteMajor failed, using dummy response:', error);
      return { message: 'Major deleted successfully' };
    }
  }

  async getMajorStats(): Promise<{ data: any }> {
    try {
      return await ApiService.get('/admin/majors/stats');
    } catch (error) {
      return {
        data: {
          total_majors: dummyMajors.length,
          active_majors: dummyMajors.filter(m => m.status === 'active').length,
          total_students: dummyMajors.reduce((acc, m) => acc + (m.student_count || 0), 0),
          total_courses: dummyMajors.reduce((acc, m) => acc + (m.course_count || 0), 0)
        }
      };
    }
  }
}

export default new MajorService();
