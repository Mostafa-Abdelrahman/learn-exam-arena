
import api from '../api/config';

const CourseService = {
  // Get all courses
  async getAllCourses(): Promise<{ data: Course[] }> {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get specific course
  async getCourse(courseId: string): Promise<{ data: Course }> {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get student courses (for enrolled courses)
  async getStudentCourses(): Promise<{ data: Course[] }> {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get course students
  async getCourseStudents(courseId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  },

  // Get course doctors
  async getCourseDoctors(courseId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/courses/${courseId}/doctors`);
    return response.data;
  },

  // Create course
  async createCourse(courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },
};

export default CourseService;
