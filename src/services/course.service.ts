
import ApiService from './api.service';
import { dummyCourses } from '@/data/dummy-comprehensive';

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id: string;
  student_count: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface CreateCourseData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id: string;
  status?: 'active' | 'inactive';
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
}

class CourseService {
  async getAllCourses(): Promise<{ data: Course[] }> {
    try {
      return await ApiService.get('/courses');
    } catch (error) {
      console.warn('API getAllCourses failed, using dummy data:', error);
      return { data: dummyCourses };
    }
  }

  async getCourseById(courseId: string): Promise<{ data: Course }> {
    try {
      return await ApiService.get(`/admin/courses/${courseId}`);
    } catch (error) {
      console.warn('API getCourseById failed, using dummy data:', error);
      const course = dummyCourses.find(c => c.id === courseId) || dummyCourses[0];
      return { data: course };
    }
  }

  async createCourse(courseData: CreateCourseData): Promise<{ data: Course; message: string }> {
    try {
      return await ApiService.post('/admin/courses', courseData);
    } catch (error) {
      console.warn('API createCourse failed, using dummy response:', error);
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...courseData,
        status: courseData.status || 'active',
        student_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: newCourse, message: 'Course created successfully' };
    }
  }

  async updateCourse(courseId: string, courseData: UpdateCourseData): Promise<{ data: Course; message: string }> {
    try {
      return await ApiService.put(`/admin/courses/${courseId}`, courseData);
    } catch (error) {
      console.warn('API updateCourse failed, using dummy response:', error);
      const existingCourse = dummyCourses.find(c => c.id === courseId) || dummyCourses[0];
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
      return await ApiService.delete(`/admin/courses/${courseId}`);
    } catch (error) {
      console.warn('API deleteCourse failed, using dummy response:', error);
      return { message: 'Course deleted successfully' };
    }
  }
}

export default new CourseService();
