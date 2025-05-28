
import ApiService from './api.service';

export interface QuestionFilters {
  course_id?: string;
  type?: 'mcq' | 'written' | 'multiple-choice';
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
}

export interface CreateQuestionData {
  text: string;
  type: 'mcq' | 'written' | 'multiple-choice';
  course_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  marks?: number;
  choices?: Array<{
    text: string;
    is_correct: boolean;
  }>;
  correct_answer?: string;
  explanation?: string;
}

export interface UpdateQuestionData {
  text?: string;
  type?: 'mcq' | 'written' | 'multiple-choice';
  course_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  marks?: number;
  choices?: Array<{
    id?: string;
    text: string;
    is_correct: boolean;
  }>;
  correct_answer?: string;
  explanation?: string;
}

export interface QuestionStats {
  total_questions: number;
  questions_by_type: {
    mcq: number;
    written: number;
    multiple_choice: number;
  };
  questions_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  questions_by_course: Array<{
    course_id: string;
    course_name: string;
    question_count: number;
  }>;
}

class QuestionService {
  // Question Management
  async getAllQuestions(filters?: QuestionFilters, pagination?: PaginationParams): Promise<{
    data: Question[];
    pagination: any;
  }> {
    const params = { ...filters, ...pagination };
    return await ApiService.get('/questions', params);
  }

  async getQuestionById(questionId: string): Promise<{ data: Question }> {
    return await ApiService.get(`/questions/${questionId}`);
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ question: Question; message: string }> {
    return await ApiService.post('/doctor/questions', questionData);
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ question: Question; message: string }> {
    return await ApiService.put(`/doctor/questions/${questionId}`, questionData);
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/doctor/questions/${questionId}`);
  }

  // Course Questions
  async getCourseQuestions(courseId: string): Promise<{ data: Question[] }> {
    return await ApiService.get(`/courses/${courseId}/questions`);
  }

  async getDoctorQuestions(doctorId?: string): Promise<{ data: Question[] }> {
    const endpoint = doctorId ? `/doctors/${doctorId}/questions` : '/doctor/questions';
    return await ApiService.get(endpoint);
  }

  // Question Bank Management
  async importQuestions(file: File, courseId?: string): Promise<{ imported: number; errors: any[] }> {
    const additionalData = courseId ? { course_id: courseId } : undefined;
    return await ApiService.upload('/doctor/questions/import', file, additionalData);
  }

  async exportQuestions(filters?: QuestionFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/doctor/questions/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async duplicateQuestion(questionId: string, newCourseId?: string): Promise<{ question: Question; message: string }> {
    return await ApiService.post(`/doctor/questions/${questionId}/duplicate`, { course_id: newCourseId });
  }

  // Bulk Operations
  async bulkDeleteQuestions(questionIds: string[]): Promise<{ deleted: number; errors: any[] }> {
    return await ApiService.post('/doctor/questions/bulk/delete', { question_ids: questionIds });
  }

  async bulkUpdateQuestions(questionIds: string[], updates: Partial<UpdateQuestionData>): Promise<{ updated: number; errors: any[] }> {
    return await ApiService.put('/doctor/questions/bulk', { question_ids: questionIds, updates });
  }

  // Statistics
  async getQuestionStats(): Promise<{ data: QuestionStats }> {
    return await ApiService.get('/admin/questions/stats');
  }

  async getQuestionAnalytics(questionId: string): Promise<{ data: any }> {
    return await ApiService.get(`/admin/questions/${questionId}/analytics`);
  }

  // Question Validation
  async validateQuestion(questionData: CreateQuestionData | UpdateQuestionData): Promise<{ valid: boolean; errors: string[] }> {
    return await ApiService.post('/doctor/questions/validate', questionData);
  }

  // Random Question Generation
  async getRandomQuestions(filters: {
    course_id?: string;
    type?: string;
    difficulty?: string;
    count: number;
  }): Promise<{ data: Question[] }> {
    return await ApiService.get('/questions/random', filters);
  }
}

export default new QuestionService();
