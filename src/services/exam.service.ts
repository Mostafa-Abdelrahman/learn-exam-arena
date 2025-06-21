
import ApiService from './api.service';
import { dummyExamsComprehensive, dummyStudentResults } from '@/data/dummy-comprehensive';
import { mockExams, STORAGE_KEYS, saveToStorage, getFromStorage, initializeMockData } from '@/data/exam-data';

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
  constructor() {
    initializeMockData();
  }

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
      console.warn('API getAllExams failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      return {
        data: mockData,
        pagination: this.getDefaultPagination(mockData.length)
      };
    }
  }

  // Get exam by ID
  async getExam(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/exams/${examId}`);
      const responseData = response.data || response;
      return responseData || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API getExam failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      return mockData.find((exam: Exam) => exam.id === examId) || this.getDefaultExam(examId);
    }
  }

  // Get exam by ID (alias)
  async getExamById(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/exams/${examId}`);
      const responseData = response.data || response;
      return responseData || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API getExamById failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      return mockData.find((exam: Exam) => exam.id === examId) || this.getDefaultExam(examId);
    }
  }

  // Get student exams
  async getStudentExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/student/exams');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudentExams failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      return { data: mockData.filter((exam: Exam) => exam.status === 'published') };
    }
  }

  // Get course exams
  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get(`/courses/${courseId}/exams`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getCourseExams failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const courseExams = mockData.filter((exam: Exam) => exam.course_id === courseId);
      return { data: courseExams };
    }
  }

  // Get upcoming exams
  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/student/exams/upcoming');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getUpcomingExams failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const upcomingExams = mockData.filter((exam: Exam) => 
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
      console.warn('API getStudentResults failed, using mock data:', error);
      return { data: getFromStorage(STORAGE_KEYS.EXAM_RESULTS, []) };
    }
  }

  // Get doctor exams
  async getDoctorExams(): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/doctor/exams');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorExams failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      return { data: mockData };
    }
  }

  // Get exam questions
  async getExamQuestions(examId: string): Promise<{ data: any[] }> {
    try {
      const response = await ApiService.get(`/exams/${examId}/questions`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getExamQuestions failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const exam = mockData.find((e: Exam) => e.id === examId);
      return { data: exam?.questions || [] };
    }
  }

  // Start exam
  async startExam(examId: string): Promise<{ message: string; session_id: string; student_exam_id?: string; questions?: any[] }> {
    try {
      const response = await ApiService.post(`/student/exams/${examId}/start`);
      const responseData = response.data || response;
      const data = responseData || {};
      return {
        message: response.message || 'Exam started successfully',
        session_id: (data as any).session_id || `session-${Date.now()}`,
        student_exam_id: (data as any).student_exam_id,
        questions: (data as any).questions
      };
    } catch (error) {
      console.warn('API startExam failed, using mock response:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const exam = mockData.find((e: Exam) => e.id === examId);
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
      console.warn('API submitAnswer failed, using local storage:', error);
      // Save answer to local storage
      const key = `${STORAGE_KEYS.EXAM_ANSWERS}${examId}`;
      const existingAnswers = getFromStorage(key, {});
      existingAnswers[questionId] = answer;
      saveToStorage(key, existingAnswers);
      return { message: 'Answer submitted successfully' };
    }
  }

  // Take exam (for student)
  async takeExam(examId: string): Promise<Exam> {
    try {
      const response = await ApiService.get(`/student/exams/${examId}/take`);
      const responseData = response.data || response;
      return responseData || this.getDefaultExam(examId);
    } catch (error) {
      console.warn('API takeExam failed, using mock data:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const exam = mockData.find((exam: Exam) => exam.id === examId) || this.getDefaultExam(examId);
      return exam;
    }
  }

  // Submit exam
  async submitExam(examId: string, answers: any[]): Promise<{ message: string; score?: number }> {
    try {
      const response = await ApiService.post(`/student/exams/${examId}/submit`, { answers });
      const responseData = response.data || response;
      const data = responseData || {};
      return {
        message: response.message || 'Exam submitted successfully',
        score: (data as any).score
      };
    } catch (error) {
      console.warn('API submitExam failed, using mock calculation:', error);
      
      // Calculate score based on mock data
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const exam = mockData.find((e: Exam) => e.id === examId);
      let score = 0;
      
      if (exam && exam.questions) {
        let totalQuestions = exam.questions.length;
        let correctAnswers = 0;
        
        answers.forEach((answer: any) => {
          const question = exam.questions?.find((q: any) => q.id === answer.questionId);
          if (question && question.type === 'mcq' && question.choices) {
            const correctChoice = question.choices.find((c: any) => c.is_correct);
            if (correctChoice && correctChoice.id === answer.answer) {
              correctAnswers++;
            }
          }
        });
        
        score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      }
      
      // Save result to local storage
      const results = getFromStorage(STORAGE_KEYS.EXAM_RESULTS, []);
      results.push({
        id: `result-${Date.now()}`,
        exam_id: examId,
        score,
        submitted_at: new Date().toISOString(),
        answers
      });
      saveToStorage(STORAGE_KEYS.EXAM_RESULTS, results);
      
      return {
        message: 'Exam submitted successfully',
        score
      };
    }
  }

  // Create exam (doctor)
  async createExam(examData: CreateExamData): Promise<{ exam: Exam }> {
    try {
      const response = await ApiService.post('/doctor/exams', examData);
      const responseData = response.data || response;
      return { exam: responseData || this.createDefaultExam(examData) };
    } catch (error) {
      console.warn('API createExam failed, using mock creation:', error);
      const newExam = this.createDefaultExam(examData);
      
      // Save to local storage
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      mockData.push(newExam);
      saveToStorage(STORAGE_KEYS.EXAMS, mockData);
      
      return { exam: newExam };
    }
  }

  // Update exam (doctor)
  async updateExam(examId: string, examData: UpdateExamData): Promise<{ exam: Exam }> {
    try {
      const response = await ApiService.put(`/doctor/exams/${examId}`, examData);
      const responseData = response.data || response;
      return { exam: responseData || this.getDefaultExam(examId) };
    } catch (error) {
      console.warn('API updateExam failed, using mock update:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const examIndex = mockData.findIndex((e: Exam) => e.id === examId);
      
      if (examIndex !== -1) {
        mockData[examIndex] = {
          ...mockData[examIndex],
          ...examData,
          updated_at: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.EXAMS, mockData);
        return { exam: mockData[examIndex] };
      }
      
      return { exam: this.getDefaultExam(examId) };
    }
  }

  // Delete exam (doctor)
  async deleteExam(examId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/doctor/exams/${examId}`);
      return { message: response.message || 'Exam deleted successfully' };
    } catch (error) {
      console.warn('API deleteExam failed, using mock deletion:', error);
      const mockData = getFromStorage(STORAGE_KEYS.EXAMS, mockExams);
      const filteredData = mockData.filter((e: Exam) => e.id !== examId);
      saveToStorage(STORAGE_KEYS.EXAMS, filteredData);
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
      total_marks: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private createDefaultExam(examData: CreateExamData): Exam {
    return {
      id: `exam-${Date.now()}`,
      ...examData,
      status: 'draft' as const,
      total_marks: examData.total_marks || 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

export default new ExamService();
