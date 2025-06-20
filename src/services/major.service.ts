import ApiService from './api.service';
import { Major, CreateMajorData, UpdateMajorData } from '@/types/major';
import { dummyMajors } from '@/data/dummy-comprehensive';

class MajorService {
  async getAllMajors(): Promise<{ data: Major[] }> {
    try {
      return await ApiService.get('/admin/majors');
    } catch (error) {
      console.warn('API getAllMajors failed, using dummy data:', error);
      return { data: dummyMajors };
    }
  }

  async getMajorsForDoctors(): Promise<{ data: Major[] }> {
    try {
      return await ApiService.get('/admin/majors/for-doctors');
    } catch (error) {
      console.warn('API getMajorsForDoctors failed, using dummy data:', error);
      return { data: dummyMajors };
    }
  }

  async getMajorsForStudents(): Promise<{ data: Major[] }> {
    try {
      return await ApiService.get('/admin/majors/for-students');
    } catch (error) {
      console.warn('API getMajorsForStudents failed, using dummy data:', error);
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

  async createMajor(majorData: CreateMajorData): Promise<{ data: Major }> {
    try {
      return await ApiService.post('/admin/majors', majorData);
    } catch (error) {
      console.warn('API createMajor failed, using dummy response:', error);
      const newMajor: Major = {
        id: `major-${dummyMajors.length + 1}`,
        name: majorData.name,
        code: majorData.code,
        description: majorData.description,
        status: majorData.status || 'active',
        student_count: 0,
        course_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: newMajor };
    }
  }

  async updateMajor(majorId: string, majorData: UpdateMajorData): Promise<{ data: Major }> {
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
      return { data: updatedMajor };
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

  async getMajorStats(): Promise<{ data: { total_majors: number; active_majors: number; total_students: number; total_courses: number } }> {
    try {
      return await ApiService.get('/admin/majors/stats');
    } catch (error) {
      console.warn('API getMajorStats failed, using dummy data:', error);
      const total_majors = dummyMajors.length;
      const active_majors = dummyMajors.filter(m => m.status === 'active').length;
      const total_students = dummyMajors.reduce((acc, m) => acc + (m.student_count || 0), 0);
      const total_courses = dummyMajors.reduce((acc, m) => acc + (m.course_count || 0), 0);

      return {
        data: {
          total_majors,
          active_majors,
          total_students,
          total_courses
          
        }
      };
    }
  }
}

export default new MajorService();
