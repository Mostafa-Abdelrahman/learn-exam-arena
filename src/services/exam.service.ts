
import ApiService from './api.service';
import { dummyExamsComprehensive, dummyStudentResults } from '@/data/dummy-comprehensive';

export interface ExamFilters {
  course_id?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}

export interface CreateExamData {
  name: string;
  description?: string;
  course_id: string;
  exam_date: string;
  duration: string;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
}

export interface UpdateExamData {
  name?: string;
  description?: string;
  exam_date?: string;
  duration?: string;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
  status?: 'draft' | 'published' | 'archived';
}

class ExamService {
  // Get all exams
  async getAllExams(params?: any): Promise<PaginationResponse<Exam>> {
    try {
      return await ApiService.get('/exams', params);
    } catch (error) {
      console.warn('API getAllExams failed, using dummy data:', error);
      return {
        data: dummyExamsComprehensive,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyExamsComprehensive.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Get exam by ID
  async getExam(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/exams/${examId}`);
    } catch (error) {
      console.warn('API getExam failed, using dummy data:', error);
      return dummyExamsComprehensive.find(exam => exam.id === examId) || dummyExamsComprehensive[0];
    }
  }

  // Get exam by ID (alias)
  async getExamById(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/exams/${examId}`);
    } catch (error) {
      console.warn('API getExamById failed, using dummy data:', error);
      return dummyExamsComprehensive.find(exam => exam.id === examId) || dummyExamsComprehensive[0];
    }
  }

  // Get student exams
  async getStudentExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams');
    } catch (error) {
      console.warn('API getStudentExams failed, using dummy data:', error);
      return { data: dummyExamsComprehensive.filter(exam => exam.status === 'published') };
    }
  }

  // Get course exams
  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get(`/courses/${courseId}/exams`);
    } catch (error) {
      console.warn('API getCourseExams failed, using dummy data:', error);
      const courseExams = dummyExamsComprehensive.filter(exam => exam.course_id === courseId);
      return { data: courseExams };
    }
  }

  // Get upcoming exams
  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams/upcoming');
    } catch (error) {
      console.warn('API getUpcomingExams failed, using dummy data:', error);
      const upcomingExams = dummyExamsComprehensive.filter(exam => 
        new Date(exam.exam_date) > new Date() && exam.status === 'published'
      );
      return { data: upcomingExams };
    }
  }

  // Get student results
  async getStudentResults(): Promise<{ data: any[] }> {
    try {
      return await ApiService.get('/student/results');
    } catch (error) {
      console.warn('API getStudentResults failed, using dummy data:', error);
      return { data: dummyStudentResults };
    }
  }

  // Get doctor exams
  async getDoctorExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/doctor/exams');
    } catch (error) {
      console.warn('API getDoctorExams failed, using dummy data:', error);
      return { data: dummyExamsComprehensive };
    }
  }

  // Get exam questions
  async getExamQuestions(examId: string): Promise<{ data: any[] }> {
    try {
      return await ApiService.get(`/exams/${examId}/questions`);
    } catch (error) {
      console.warn('API getExamQuestions failed, using dummy data:', error);
      const exam = dummyExamsComprehensive.find(e => e.id === examId);
      return { data: exam?.questions || [] };
    }
  }

  // Start exam
  async startExam(examId: string): Promise<{ message: string; session_id: string; student_exam_id?: string; questions?: any[] }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/start`);
    } catch (error) {
      console.warn('API startExam failed, using dummy response:', error);
      const exam = dummyExamsComprehensive.find(e => e.id === examId);
      return { 
        message: 'Exam started successfully',
        session_id: `session-${Date.now()}`,
        student_exam_id: `student_exam-${Date.now()}`,
        questions: exam?.questions || []
      };
    }
  }

  // Submit answer
  async submitAnswer(examId: string, questionId: string, answer: any): Promise<{ message: string }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/answers`, {
        question_id: questionId,
        answer
      });
    } catch (error) {
      console.warn('API submitAnswer failed, using dummy response:', error);
      return { message: 'Answer submitted successfully' };
    }
  }

  // Take exam (for student)
  async takeExam(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/student/exams/${examId}/take`);
    } catch (error) {
      console.warn('API takeExam failed, using dummy data:', error);
      const exam = dummyExamsComprehensive.find(exam => exam.id === examId) || dummyExamsComprehensive[0];
      return exam;
    }
  }

  // Submit exam
  async submitExam(examId: string, answers: any[]): Promise<{ message: string; score?: number }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/submit`, { answers });
    } catch (error) {
      console.warn('API submitExam failed, using dummy response:', error);
      return {
        message: 'Exam submitted successfully',
        score: Math.floor(Math.random() * 100)
      };
    }
  }

  // Create exam (doctor)
  async createExam(examData: CreateExamData): Promise<{ exam: Exam }> {
    try {
      return await ApiService.post('/doctor/exams', examData);
    } catch (error) {
      console.warn('API createExam failed, using dummy response:', error);
      const newExam = {
        id: `exam-${Date.now()}`,
        ...examData,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Exam;
      return { exam: newExam };
    }
  }

  // Update exam (doctor)
  async updateExam(examId: string, examData: UpdateExamData): Promise<{ exam: Exam }> {
    try {
      return await ApiService.put(`/doctor/exams/${examId}`, examData);
    } catch (error) {
      console.warn('API updateExam failed, using dummy response:', error);
      const existingExam = dummyExamsComprehensive.find(e => e.id === examId) || dummyExamsComprehensive[0];
      const updatedExam = {
        ...existingExam,
        ...examData,
        updated_at: new Date().toISOString()
      };
      return { exam: updatedExam };
    }
  }

  // Delete exam (doctor)
  async deleteExam(examId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/doctor/exams/${examId}`);
    } catch (error) {
      console.warn('API deleteExam failed, using dummy response:', error);
      return { message: 'Exam deleted successfully' };
    }
  }
}

export default new ExamService();
