
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

interface PaginationParams {
  page?: number;
  limit?: number;
}

class QuestionService {
  // Question Management
  async getAllQuestions(filters?: QuestionFilters, pagination?: PaginationParams): Promise<{
    data: Question[];
    pagination: any;
  }> {
    const params = { ...filters, ...pagination };
    const response = await ApiService.get('/questions', params);
    return {
      data: response.data,
      pagination: response.meta?.pagination || {
        current_page: 1,
        total_pages: 1,
        total_count: response.data?.length || 0,
        per_page: 25
      }
    };
  }

  async getQuestionById(questionId: string): Promise<{ data: Question }> {
    const response = await ApiService.get(`/questions/${questionId}`);
    return { data: response.data };
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ question: Question; message: string }> {
    const response = await ApiService.post('/doctor/questions', questionData);
    return { 
      question: response.data, 
      message: response.message || 'Question created successfully' 
    };
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ question: Question; message: string }> {
    const response = await ApiService.put(`/doctor/questions/${questionId}`, questionData);
    return { 
      question: response.data, 
      message: response.message || 'Question updated successfully' 
    };
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    const response = await ApiService.delete(`/doctor/questions/${questionId}`);
    return { message: response.message || 'Question deleted successfully' };
  }

  // Course Questions
  async getCourseQuestions(courseId: string): Promise<{ data: Question[] }> {
    const response = await ApiService.get(`/courses/${courseId}/questions`);
    return { data: response.data };
  }

  async getDoctorQuestions(doctorId?: string): Promise<{ data: Question[] }> {
    const endpoint = doctorId ? `/doctors/${doctorId}/questions` : '/doctor/questions';
    const response = await ApiService.get(endpoint);
    return { data: response.data };
  }

  // Question Bank Management
  async importQuestions(file: File, courseId?: string): Promise<{ imported: number; errors: any[] }> {
    const additionalData = courseId ? { course_id: courseId } : undefined;
    const response = await ApiService.upload('/doctor/questions/import', file, additionalData);
    return { 
      imported: response.data?.imported || 0, 
      errors: response.data?.errors || [] 
    };
  }

  async exportQuestions(filters?: QuestionFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/doctor/questions/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  async duplicateQuestion(questionId: string, newCourseId?: string): Promise<{ question: Question; message: string }> {
    const response = await ApiService.post(`/doctor/questions/${questionId}/duplicate`, { course_id: newCourseId });
    return { 
      question: response.data, 
      message: response.message || 'Question duplicated successfully' 
    };
  }

  // Bulk Operations
  async bulkDeleteQuestions(questionIds: string[]): Promise<{ deleted: number; errors: any[] }> {
    const response = await ApiService.post('/doctor/questions/bulk/delete', { question_ids: questionIds });
    return { 
      deleted: response.data?.deleted || 0, 
      errors: response.data?.errors || [] 
    };
  }

  async bulkUpdateQuestions(questionIds: string[], updates: Partial<UpdateQuestionData>): Promise<{ updated: number; errors: any[] }> {
    const response = await ApiService.put('/doctor/questions/bulk', { question_ids: questionIds, updates });
    return { 
      updated: response.data?.updated || 0, 
      errors: response.data?.errors || [] 
    };
  }

  // Statistics
  async getQuestionStats(): Promise<{ data: QuestionStats }> {
    const response = await ApiService.get('/admin/questions/stats');
    return { data: response.data };
  }

  async getQuestionAnalytics(questionId: string): Promise<{ data: any }> {
    const response = await ApiService.get(`/admin/questions/${questionId}/analytics`);
    return { data: response.data };
  }

  // Question Validation
  async validateQuestion(questionData: CreateQuestionData | UpdateQuestionData): Promise<{ valid: boolean; errors: string[] }> {
    const response = await ApiService.post('/doctor/questions/validate', questionData);
    return { 
      valid: response.data?.valid || false, 
      errors: response.data?.errors || [] 
    };
  }

  // Random Question Generation
  async getRandomQuestions(filters: {
    course_id?: string;
    type?: string;
    difficulty?: string;
    count: number;
  }): Promise<{ data: Question[] }> {
    const response = await ApiService.get('/questions/random', filters);
    return { data: response.data };
  }
}

export default new QuestionService();
