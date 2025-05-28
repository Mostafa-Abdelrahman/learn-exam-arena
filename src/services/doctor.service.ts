
import ApiService from './api.service';

export interface DoctorStats {
  total_courses: number;
  total_exams: number;
  total_students: number;
  pending_grades: number;
}

class DoctorService {
  async getDoctorStats(doctorId: string): Promise<{ data: DoctorStats }> {
    return await ApiService.get(`/doctor/${doctorId}/stats`);
  }

  async getExams(doctorId: string): Promise<{ data: Exam[] }> {
    return await ApiService.get(`/doctor/${doctorId}/exams`);
  }

  async getCourses(doctorId: string): Promise<{ data: Course[] }> {
    return await ApiService.get(`/doctor/${doctorId}/courses`);
  }

  async getStudents(doctorId: string): Promise<{ data: User[] }> {
    return await ApiService.get(`/doctor/${doctorId}/students`);
  }
}

export default new DoctorService();
