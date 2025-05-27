
import api from '../api/config';

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  major?: {
    name: string;
  };
  enrollment: {
    enrolled_at: string;
    status: string;
  };
  grades: {
    average: number;
    exam_count: number;
  };
}

export interface CourseDoctor {
  id: string;
  name: string;
  email: string;
  assignment: {
    assigned_at: string;
    role: string;
  };
}

const CourseService = {
  // Get all courses
  async getAllCourses(): Promise<{ data: Course[] }> {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get course details
  async getCourse(courseId: string): Promise<{ data: Course }> {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get course students
  async getCourseStudents(courseId: string): Promise<{ data: CourseStudent[] }> {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  },

  // Get course doctors
  async getCourseDoctors(courseId: string): Promise<{ data: CourseDoctor[] }> {
    const response = await api.get(`/courses/${courseId}/doctors`);
    return response.data;
  },

  // Create course (admin only)
  async createCourse(courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  },

  // Update course (admin only)
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course (admin only)
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  }
};

export default CourseService;
