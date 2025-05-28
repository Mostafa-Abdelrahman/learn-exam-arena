
import ApiService from './api.service';

export interface CourseFilters {
  major_id?: string;
  doctor_id?: string;
  status?: 'active' | 'inactive' | 'archived';
  search?: string;
}

export interface CourseStats {
  total_courses: number;
  active_courses: number;
  courses_by_major: Array<{
    major_id: string;
    major_name: string;
    course_count: number;
  }>;
  enrollment_stats: {
    total_enrollments: number;
    avg_enrollment_per_course: number;
  };
}

export interface CreateCourseData {
  name: string;
  code: string;
  description?: string;
  major_id: string;
  credits?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateCourseData {
  name?: string;
  code?: string;
  description?: string;
  major_id?: string;
  credits?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export interface EnrollmentData {
  student_id: string;
  enrollment_date?: string;
  status?: 'enrolled' | 'completed' | 'dropped';
}

class CourseService {
  // Course Management
  async getAllCourses(filters?: CourseFilters, pagination?: PaginationParams): Promise<{
    data: Course[];
    pagination: any;
  }> {
    const params = { ...filters, ...pagination };
    return await ApiService.get('/courses', params);
  }

  async getCourseById(courseId: string): Promise<{ data: Course }> {
    return await ApiService.get(`/courses/${courseId}`);
  }

  async createCourse(courseData: CreateCourseData): Promise<{ course: Course; message: string }> {
    return await ApiService.post('/admin/courses', courseData);
  }

  async updateCourse(courseId: string, courseData: UpdateCourseData): Promise<{ course: Course; message: string }> {
    return await ApiService.put(`/admin/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/courses/${courseId}`);
  }

  async archiveCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.post(`/admin/courses/${courseId}/archive`);
  }

  // Student Enrollment
  async enrollStudent(courseId: string, enrollmentData: EnrollmentData): Promise<{ message: string }> {
    return await ApiService.post(`/admin/courses/${courseId}/enrollments`, enrollmentData);
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/courses/${courseId}/enrollments/${studentId}`);
  }

  async getEnrolledStudents(courseId: string): Promise<{ data: any[] }> {
    return await ApiService.get(`/courses/${courseId}/students`);
  }

  async bulkEnrollStudents(courseId: string, studentIds: string[]): Promise<{ enrolled: number; errors: any[] }> {
    return await ApiService.post(`/admin/courses/${courseId}/enrollments/bulk`, { student_ids: studentIds });
  }

  // Doctor Assignment
  async assignDoctor(courseId: string, doctorId: string): Promise<{ message: string }> {
    return await ApiService.post(`/admin/courses/${courseId}/doctors`, { doctor_id: doctorId });
  }

  async unassignDoctor(courseId: string, doctorId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/admin/courses/${courseId}/doctors/${doctorId}`);
  }

  async getAssignedDoctors(courseId: string): Promise<{ data: any[] }> {
    return await ApiService.get(`/courses/${courseId}/doctors`);
  }

  // Student Course Operations
  async getStudentCourses(studentId?: string): Promise<{ data: Course[] }> {
    const endpoint = studentId ? `/students/${studentId}/courses` : '/student/courses';
    return await ApiService.get(endpoint);
  }

  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.post(`/student/courses/${courseId}/enroll`);
  }

  async dropCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.post(`/student/courses/${courseId}/drop`);
  }

  // Doctor Course Operations
  async getDoctorCourses(doctorId?: string): Promise<{ data: Course[] }> {
    const endpoint = doctorId ? `/doctors/${doctorId}/courses` : '/doctor/courses';
    return await ApiService.get(endpoint);
  }

  // Course Statistics
  async getCourseStats(): Promise<{ data: CourseStats }> {
    return await ApiService.get('/admin/courses/stats');
  }

  async getCourseAnalytics(courseId: string): Promise<{ data: any }> {
    return await ApiService.get(`/admin/courses/${courseId}/analytics`);
  }
}

export default new CourseService();
