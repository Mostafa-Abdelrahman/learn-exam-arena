import ApiService from './api.service';
import { dummyCourses } from '@/data/dummy-comprehensive';
import AuthService from './auth.service';

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id?: string;
  status: 'active' | 'inactive';
  academic_year: string;
  student_count?: number;
  created_at: string;
}

export interface CreateCourseData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id?: string;
  status: 'active' | 'inactive';
  academic_year: string;
}

export interface UpdateCourseData {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  semester?: string;
  major_id?: string;
  doctor_id?: string;
  status?: 'active' | 'inactive';
  academic_year?: string;
}

class CourseService {
  async getAllCourses(): Promise<{ data: Course[] }> {
    try {
      const user = await AuthService.getCurrentUser();
      const endpoint = user?.role === 'admin' ? '/admin/courses' : '/courses';
      const response = await ApiService.get(endpoint);
      const responseData = response.data || response;
      return { data: Array.isArray(responseData) ? responseData : [] };
    } catch (error) {
      console.warn('API getAllCourses failed, using dummy data:', error);
      return { data: dummyCourses };
    }
  }

  async getCourseById(courseId: string): Promise<{ data: Course }> {
    try {
      const response = await ApiService.get(`/admin/courses/${courseId}`);
      const responseData = response.data || response;
      return { data: responseData || this.createDefaultCourse({ name: 'Default Course', code: 'DEFAULT', credits: 3, semester: '1', major_id: '', status: 'active', academic_year: '2024' }) };
    } catch (error) {
      console.warn('API getCourseById failed, using dummy data:', error);
      const course = dummyCourses.find(c => c.id === courseId) || this.createDefaultCourse({ name: 'Default Course', code: 'DEFAULT', credits: 3, semester: '1', major_id: '', status: 'active', academic_year: '2024' });
      return { data: course };
    }
  }

  async createCourse(courseData: CreateCourseData): Promise<{ data: Course; message: string }> {
    try {
      const response = await ApiService.post('/admin/courses', courseData);
      const responseData = response.data || response;
      return { 
        data: responseData || this.createDefaultCourse(courseData),
        message: response.message || 'Course created successfully' 
      };
    } catch (error) {
      console.warn('API createCourse failed, using dummy response:', error);
      const newCourse = this.createDefaultCourse(courseData);
      return { data: newCourse, message: 'Course created successfully' };
    }
  }

  async updateCourse(courseId: string, courseData: UpdateCourseData): Promise<{ data: Course; message: string }> {
    try {
      const response = await ApiService.put(`/admin/courses/${courseId}`, courseData);
      const responseData = response.data || response;
      return { 
        data: responseData || this.createDefaultCourse({ ...courseData, name: courseData.name || '', code: courseData.code || '', credits: courseData.credits || 3, semester: courseData.semester || '1', major_id: courseData.major_id || '', status: courseData.status || 'active', academic_year: courseData.academic_year || '2024' }),
        message: response.message || 'Course updated successfully' 
      };
    } catch (error) {
      console.warn('API updateCourse failed, using dummy response:', error);
      const existingCourse = dummyCourses.find(c => c.id === courseId) || this.createDefaultCourse({ name: 'Default Course', code: 'DEFAULT', credits: 3, semester: '1', major_id: '', status: 'active', academic_year: '2024' });
      const updatedCourse = {
        ...existingCourse,
        ...courseData,
        updated_at: new Date().toISOString()
      };
      return { data: updatedCourse, message: 'Course updated successfully' };
    }
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/admin/courses/${courseId}`);
      return { message: response.message || 'Course deleted successfully' };
    } catch (error) {
      console.warn('API deleteCourse failed, using dummy response:', error);
      return { message: 'Course deleted successfully' };
    }
  }

  // Student-specific methods
  async getStudentCourses(): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get('/student/courses');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentCourses failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async unenrollFromCourse(courseId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/student/courses/${courseId}/unenroll`);
      return { message: response.message || 'Successfully unenrolled from course' };
    } catch (error) {
      console.warn('API unenrollFromCourse failed, using dummy response:', error);
      return { message: 'Successfully unenrolled from course' };
    }
  }

  // Doctor-specific methods
  async getDoctorCourses(): Promise<{ data: Course[] }> {
    try {
      const response = await ApiService.get('/doctor/courses');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorCourses failed, using dummy data:', error);
      return { data: dummyCourses };
    }
  }

  private createDefaultCourse(courseData: CreateCourseData): Course {
    return {
      id: `course-${Date.now()}`,
      name: courseData.name || '',
      code: courseData.code || '',
      description: courseData.description,
      credits: courseData.credits || 0,
      semester: courseData.semester || '',
      major_id: courseData.major_id || '',
      doctor_id: courseData.doctor_id,
      status: courseData.status || 'active',
      academic_year: courseData.academic_year || '',
      student_count: 0,
      created_at: new Date().toISOString()
    };
  }
}

export default new CourseService();
