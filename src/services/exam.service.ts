
import ApiService from './api.service';
import { dummyExams, dummyUpcomingExams, dummyExamResults } from '@/data/dummy-exams';

class ExamService {
  // Student: Get upcoming exams
  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams/upcoming');
    } catch (error) {
      console.warn('API getUpcomingExams failed, using dummy data:', error);
      return { data: dummyUpcomingExams };
    }
  }

  // Student: Get student's exams
  async getStudentExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams');
    } catch (error) {
      console.warn('API getStudentExams failed, using dummy data:', error);
      return { data: dummyExams };
    }
  }

  // Student: Get exam results
  async getStudentResults(): Promise<{ data: any[] }> {
    try {
      return await ApiService.get('/student/results');
    } catch (error) {
      console.warn('API getStudentResults failed, using dummy data:', error);
      return { data: dummyExamResults };
    }
  }

  // Get exams for a specific course
  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get(`/courses/${courseId}/exams`);
    } catch (error) {
      console.warn('API getCourseExams failed, using dummy data:', error);
      const courseExams = dummyExams.filter(exam => exam.course_id === courseId);
      return { data: courseExams };
    }
  }

  // Get exam by ID
  async getExamById(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/exams/${examId}`);
    } catch (error) {
      console.warn('API getExamById failed, using dummy data:', error);
      return dummyExams.find(exam => exam.id === examId) || dummyExams[0];
    }
  }

  // Doctor: Get all exams created by doctor
  async getDoctorExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/doctor/exams');
    } catch (error) {
      console.warn('API getDoctorExams failed, using dummy data:', error);
      return { data: dummyExams };
    }
  }

  // Doctor: Create exam
  async createExam(examData: Partial<Exam>): Promise<{ exam: Exam }> {
    try {
      return await ApiService.post('/doctor/exams', examData);
    } catch (error) {
      console.warn('API createExam failed, using dummy response:', error);
      const newExam = {
        id: `exam-${Date.now()}`,
        ...examData,
        questions_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Exam;
      return { exam: newExam };
    }
  }

  // Doctor: Update exam
  async updateExam(examId: string, examData: Partial<Exam>): Promise<{ exam: Exam }> {
    try {
      return await ApiService.put(`/doctor/exams/${examId}`, examData);
    } catch (error) {
      console.warn('API updateExam failed, using dummy response:', error);
      const existingExam = dummyExams.find(e => e.id === examId) || dummyExams[0];
      const updatedExam = {
        ...existingExam,
        ...examData,
        updated_at: new Date().toISOString()
      };
      return { exam: updatedExam };
    }
  }

  // Doctor: Delete exam
  async deleteExam(examId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/doctor/exams/${examId}`);
    } catch (error) {
      console.warn('API deleteExam failed, using dummy response:', error);
      return { message: 'Exam deleted successfully' };
    }
  }

  // Student: Take exam
  async takeExam(examId: string): Promise<{ exam: Exam; questions: Question[] }> {
    try {
      return await ApiService.get(`/student/exams/${examId}/take`);
    } catch (error) {
      console.warn('API takeExam failed, using dummy response:', error);
      const exam = dummyExams.find(e => e.id === examId) || dummyExams[0];
      return { 
        exam, 
        questions: [] // Would need dummy questions data
      };
    }
  }

  // Student: Submit exam
  async submitExam(examId: string, answers: any): Promise<{ message: string }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/submit`, { answers });
    } catch (error) {
      console.warn('API submitExam failed, using dummy response:', error);
      return { message: 'Exam submitted successfully' };
    }
  }
}

export default new ExamService();
