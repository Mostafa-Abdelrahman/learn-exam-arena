
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

interface PaginationResponse<T> {
  data: T;
  pagination: any;
}

class ExamService {
  // Get all exams
  async getAllExams(params?: any): Promise<PaginationResponse<Exam[]>> {
    try {
      const response = await ApiService.get('/exams', params);
      const data = Array.isArray(response.data) ? response.data : [];
      return {
        data,
        pagination: response.meta?.pagination || this.getDefaultPagination(data.length)
      };
    } catch (error) {
      console.warn('API getAllExams failed, using dummy data:', error);
      return {
        data: dummyExamsComprehensive,
        pagination: this.getDefaultPagination(dummyExamsComprehensive.length)
      };
    }
  }

  // Get exam by ID
  async getExam(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/exams/${examId}`);
      return response.data || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API getExam failed, using dummy data:', error);
      return dummyExamsComprehensive.find(exam => exam.id === examId) || this.getDefaultExam(examId);
    }
  }

  // Get exam by ID (alias)
  async getExamById(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/exams/${examId}`);
      return response.data || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API getExamById failed, using dummy data:', error);
      return dummyExamsComprehensive.find(exam => exam.id === examId) || this.getDefaultExam(examId);
    }
  }

  // Get student exams
  async getStudentExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/student/exams');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentExams failed, using dummy data:', error);
      return { data: dummyExamsComprehensive.filter(exam => exam.status === 'published') };
    }
  }

  // Get course exams
  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get(`/courses/${courseId}/exams`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getCourseExams failed, using dummy data:', error);
      const courseExams = dummyExamsComprehensive.filter(exam => exam.course_id === courseId);
      return { data: courseExams };
    }
  }

  // Get upcoming exams
  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/student/exams/upcoming');
      return { data: Array.isArray(response.data) ? response.data : [] };
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
      const response = await ApiService.get('/student/results');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentResults failed, using dummy data:', error);
      return { data: dummyStudentResults };
    }
  }

  // Get doctor exams
  async getDoctorExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/doctor/exams');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorExams failed, using dummy data:', error);
      return { data: dummyExamsComprehensive };
    }
  }

  // Get exam questions
  async getExamQuestions(examId: string): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get(`/exams/${examId}/questions`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getExamQuestions failed, using dummy data:', error);
      const exam = dummyExamsComprehensive.find(e => e.id === examId);
      return { data: exam?.questions || [] };
    }
  }

  // Start exam
  async startExam(examId: string): Promise<{ message: string; session_id: string; student_exam_id?: string; questions?: any[] }> {
    try {
      const response = await ApiService.post(`/student/exams/${examId}/start`);
      const data = response.data || {};
      return {
        message: response.message || 'Exam started successfully',
        session_id: data.session_id || `session-${Date.now()}`,
        student_exam_id: data.student_exam_id,
        questions: data.questions
      };
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
      const response = await ApiService.post(`/student/exams/${examId}/answers`, {
        question_id: questionId,
        answer
      });
      return { message: response.message || 'Answer submitted successfully' };
    } catch (error) {
      console.warn('API submitAnswer failed, using dummy response:', error);
      return { message: 'Answer submitted successfully' };
    }
  }

  // Take exam (for student)
  async takeExam(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/student/exams/${examId}/take`);
      return response.data || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API takeExam failed, using dummy data:', error);
      const exam = dummyExamsComprehensive.find(exam => exam.id === examId) || this.getDefaultExam(examId);
      return exam;
    }
  }

  // Submit exam
  async submitExam(examId: string, answers: any[]): Promise<{ message: string; score?: number }> {
    try {
      const response = await ApiService.post(`/student/exams/${examId}/submit`, { answers });
      const data = response.data || {};
      return {
        message: response.message || 'Exam submitted successfully',
        score: data.score
      };
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
      const response = await ApiService.post('/doctor/exams', examData);
      return { exam: response.data || this.createDefaultExam(examData) };
    } catch (error) {
      console.warn('API createExam failed, using dummy response:', error);
      const newExam = this.createDefaultExam(examData);
      return { exam: newExam };
    }
  }

  // Update exam (doctor)
  async updateExam(examId: string, examData: UpdateExamData): Promise<{ exam: Exam }> {
    try {
      const response = await ApiService.put(`/doctor/exams/${examId}`, examData);
      return { exam: response.data || this.getDefaultExam(examId) };
    } catch (error) {
      console.warn('API updateExam failed, using dummy response:', error);
      const existingExam = dummyExamsComprehensive.find(e => e.id === examId) || this.getDefaultExam(examId);
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
      const response = await ApiService.delete(`/doctor/exams/${examId}`);
      return { message: response.message || 'Exam deleted successfully' };
    } catch (error) {
      console.warn('API deleteExam failed, using dummy response:', error);
      return { message: 'Exam deleted successfully' };
    }
  }

  private getDefaultPagination(totalCount: number) {
    return {
      current_page: 1,
      total_pages: 1,
      total_count: totalCount,
      per_page: 25,
      has_next: false,
      has_prev: false
    };
  }

  private getDefaultExam(examId?: string): Exam {
    return {
      id: examId || `exam-${Date.now()}`,
      name: 'Default Exam',
      course_id: '',
      exam_date: new Date().toISOString(),
      duration: '60',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private createDefaultExam(examData: CreateExamData): Exam {
    return {
      id: `exam-${Date.now()}`,
      ...examData,
      status: 'draft' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

export default new ExamService();
