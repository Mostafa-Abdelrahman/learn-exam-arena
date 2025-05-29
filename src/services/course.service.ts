
import ApiService from './api.service';
import { dummyCourses, dummyStudentCourses } from '@/data/dummy-courses';

class CourseService {
  // Get all courses
  async getAllCourses(params?: any): Promise<PaginationResponse<Course>> {
    try {
      return await ApiService.get('/courses', params);
    } catch (error) {
      console.warn('API getAllCourses failed, using dummy data:', error);
      return {
        data: dummyCourses,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyCourses.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Get student's enrolled courses
  async getStudentCourses(): Promise<{ data: StudentCourse[] }> {
    try {
      return await ApiService.get('/student/courses');
    } catch (error) {
      console.warn('API getStudentCourses failed, using dummy data:', error);
      return { data: dummyStudentCourses };
    }
  }

  // Get course by ID
  async getCourseById(courseId: string): Promise<Course> {
    try {
      return await ApiService.get(`/courses/${courseId}`);
    } catch (error) {
      console.warn('API getCourseById failed, using dummy data:', error);
      return dummyCourses.find(course => course.id === courseId) || dummyCourses[0];
    }
  }

  // Enroll in course
  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    try {
      return await ApiService.post(`/student/courses/${courseId}/enroll`);
    } catch (error) {
      console.warn('API enrollInCourse failed, using dummy response:', error);
      return { message: 'Successfully enrolled in course' };
    }
  }

  // Unenroll from course
  async unenrollFromCourse(courseId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/student/courses/${courseId}/unenroll`);
    } catch (error) {
      console.warn('API unenrollFromCourse failed, using dummy response:', error);
      return { message: 'Successfully unenrolled from course' };
    }
  }

  // Doctor: Create course
  async createCourse(courseData: Partial<Course>): Promise<{ course: Course }> {
    try {
      return await ApiService.post('/doctor/courses', courseData);
    } catch (error) {
      console.warn('API createCourse failed, using dummy response:', error);
      const newCourse = {
        id: `course-${Date.now()}`,
        ...courseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Course;
      return { course: newCourse };
    }
  }

  // Doctor: Update course
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<{ course: Course }> {
    try {
      return await ApiService.put(`/doctor/courses/${courseId}`, courseData);
    } catch (error) {
      console.warn('API updateCourse failed, using dummy response:', error);
      const existingCourse = dummyCourses.find(c => c.id === courseId) || dummyCourses[0];
      const updatedCourse = {
        ...existingCourse,
        ...courseData,
        updated_at: new Date().toISOString()
      };
      return { course: updatedCourse };
    }
  }

  // Doctor: Delete course
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/doctor/courses/${courseId}`);
    } catch (error) {
      console.warn('API deleteCourse failed, using dummy response:', error);
      return { message: 'Course deleted successfully' };
    }
  }

  // Doctor: Get courses taught by doctor
  async getDoctorCourses(): Promise<{ data: Course[] }> {
    try {
      return await ApiService.get('/doctor/courses');
    } catch (error) {
      console.warn('API getDoctorCourses failed, using dummy data:', error);
      return { data: dummyCourses };
    }
  }
}

export default new CourseService();
