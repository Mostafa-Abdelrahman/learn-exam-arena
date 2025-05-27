
import api from '../api/config';

export interface DoctorStats {
  total_courses: number;
  total_students: number;
  total_exams: number;
  pending_grading: number;
  total_questions: number;
  recent_submissions: number;
  courses_breakdown: Array<{
    course_name: string;
    students: number;
    exams: number;
    pending_grades: number;
  }>;
}

const DoctorService = {
  // Doctor Stats
  async getDoctorStats(): Promise<{ data: DoctorStats }> {
    const response = await api.get('/doctor/stats');
    return response.data;
  },

  // Courses
  async getCourses(doctorId?: string): Promise<{ data: Course[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/courses${params}`);
    return response.data;
  },

  // Exams
  async getExams(doctorId?: string): Promise<{ data: Exam[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/exams${params}`);
    return response.data;
  },

  // Questions
  async getQuestions(doctorId?: string, filters?: {
    type?: string;
    difficulty?: string;
  }): Promise<{ data: Question[] }> {
    let params = doctorId ? `?doctor_id=${doctorId}` : '?';
    if (filters?.type) params += `&type=${filters.type}`;
    if (filters?.difficulty) params += `&difficulty=${filters.difficulty}`;
    
    const response = await api.get(`/doctor/questions${params}`);
    return response.data;
  }
};

export default DoctorService;
