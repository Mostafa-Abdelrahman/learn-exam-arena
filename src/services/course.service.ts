
import api from '../api/config';
import { Course, mapCourseData } from '../types/student-courses';

interface CoursesResponse {
  data: Course[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const CourseService = {
  // Get all courses
  async getAllCourses(): Promise<CoursesResponse> {
    const response = await api.get('/courses');
    return {
      data: (response.data.data || []).map(mapCourseData),
      meta: response.data.meta
    };
  },

  // Get a specific course
  async getCourse(id: string): Promise<{data: Course}> {
    const response = await api.get(`/courses/${id}`);
    return {
      data: mapCourseData(response.data.data || response.data)
    };
  },

  // Get courses for the authenticated student
  async getStudentCourses(): Promise<CoursesResponse> {
    const response = await api.get('/courses');
    return {
      data: (response.data.data || []).map(mapCourseData)
    };
  },

  // Get courses assigned to a specific doctor
  async getDoctorCourses(doctorId: string): Promise<CoursesResponse> {
    const response = await api.get(`/doctor/courses?doctor_id=${doctorId}`);
    return {
      data: (response.data.data || []).map(mapCourseData)
    };
  },

  // Admin course management
  async createCourse(courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.post('/admin/courses', courseData);
    return {
      data: mapCourseData(response.data.data)
    };
  },

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return {
      data: mapCourseData(response.data.data)
    };
  },

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  },

  // Course enrollment management
  async enrollStudent(courseId: string, studentId: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response.data;
  },

  async unenrollStudent(courseId: string, studentId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/assignments/students/${studentId}/courses/${courseId}`);
    return response.data;
  },

  async assignDoctor(courseId: string, doctorId: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response.data;
  },

  async unassignDoctor(courseId: string, doctorId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/assignments/doctors/${doctorId}/courses/${courseId}`);
    return response.data;
  },

  // Get course students and doctors
  async getCourseStudents(courseId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  },

  async getCourseDoctors(courseId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/courses/${courseId}/doctors`);
    return response.data;
  },

  // Get course exams
  async getCourseExams(courseId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/courses/${courseId}/exams`);
    return response.data;
  }
};

export default CourseService;
