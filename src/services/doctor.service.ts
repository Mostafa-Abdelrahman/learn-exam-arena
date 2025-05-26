
import api from '../api/config';

export interface DoctorCourse {
  id: string;
  course_id?: string;
  name: string;
  course_name?: string;
  code: string;
  course_code?: string;
  description?: string;
  student_count: number;
  exam_count?: number;
}

export interface CourseStudent {
  id: string;
  student_id?: string;
  name: string;
  email: string;
  major?: string;
}

const DoctorService = {
  // Get courses assigned to doctor
  async getDoctorCourses(doctorId?: string): Promise<{ data: DoctorCourse[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/courses${params}`);
    return response.data;
  },

  // Get students in a specific course
  async getCourseStudents(courseId: string): Promise<{ data: CourseStudent[] }> {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  },

  // Get doctor's dashboard statistics
  async getDoctorStats(doctorId?: string): Promise<{ data: any }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/stats${params}`);
    return response.data;
  },

  // Get all doctors (admin only)
  async getAllDoctors(): Promise<{ data: any[] }> {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  // Create doctor (admin only)
  async createDoctor(doctorData: any): Promise<{ data: any }> {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  // Update doctor (admin only)
  async updateDoctor(doctorId: string, doctorData: any): Promise<{ data: any }> {
    const response = await api.put(`/admin/doctors/${doctorId}`, doctorData);
    return response.data;
  },

  // Delete doctor (admin only)
  async deleteDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/doctors/${doctorId}`);
    return response.data;
  }
};

export default DoctorService;
