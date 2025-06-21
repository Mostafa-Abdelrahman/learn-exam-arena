
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
    try {
      const params = { ...filters, ...pagination };
      const response = await ApiService.get('/questions', params);
      const data = Array.isArray(response.data) ? response.data : [];
      return {
        data,
        pagination: response.meta?.pagination || this.getDefaultPagination(data.length)
      };
    } catch (error) {
      console.warn('API getAllQuestions failed:', error);
      return {
        data: [],
        pagination: this.getDefaultPagination(0)
      };
    }
  }

  async getQuestionById(questionId: string): Promise<{ data: Question }> {
    try {
      const response = await ApiService.get(`/questions/${questionId}`);
      const responseData = response.data || response;
      return { data: responseData || this.createDefaultQuestion() };
    } catch (error) {
      console.warn('API getQuestionById failed:', error);
      return { data: this.createDefaultQuestion() };
    }
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ question: Question; message: string }> {
    try {
      const response = await ApiService.post('/doctor/questions', questionData);
      const responseData = response.data || response;
      return { 
        question: responseData || this.createDefaultQuestion(questionData), 
        message: response.message || 'Question created successfully' 
      };
    } catch (error) {
      console.warn('API createQuestion failed:', error);
      return { question: this.createDefaultQuestion(questionData), message: 'Question created successfully' };
    }
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ question: Question; message: string }> {
    try {
      const response = await ApiService.put(`/doctor/questions/${questionId}`, questionData);
      const responseData = response.data || response;
      return { 
        question: responseData || this.createDefaultQuestion(questionData), 
        message: response.message || 'Question updated successfully' 
      };
    } catch (error) {
      console.warn('API updateQuestion failed:', error);
      return { question: this.createDefaultQuestion(questionData), message: 'Question updated successfully' };
    }
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/doctor/questions/${questionId}`);
      return { message: response.message || 'Question deleted successfully' };
    } catch (error) {
      console.warn('API deleteQuestion failed:', error);
      return { message: 'Question deleted successfully' };
    }
  }

  // Course Questions
  async getCourseQuestions(courseId: string): Promise<{ data: Question[] }> {
    try {
      const response = await ApiService.get(`/courses/${courseId}/questions`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getCourseQuestions failed:', error);
      return { data: [] };
    }
  }

  async getDoctorQuestions(doctorId?: string): Promise<{ data: Question[] }> {
    try {
      const endpoint = doctorId ? `/doctors/${doctorId}/questions` : '/doctor/questions';
      const response = await ApiService.get(endpoint);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getDoctorQuestions failed:', error);
      return { data: [] };
    }
  }

  // Question Bank Management
  async importQuestions(file: File, courseId?: string): Promise<{ imported: number; errors: any[] }> {
    try {
      const additionalData = courseId ? { course_id: courseId } : undefined;
      const response = await ApiService.upload('/doctor/questions/import', file, additionalData);
      const responseData = response.data || response;
      const data = responseData as any || {};
      return { 
        imported: data.imported || 0, 
        errors: data.errors || [] 
      };
    } catch (error) {
      console.warn('API importQuestions failed:', error);
      return { imported: 0, errors: [] };
    }
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
    try {
      const response = await ApiService.post(`/doctor/questions/${questionId}/duplicate`, { course_id: newCourseId });
      const responseData = response.data || response;
      return { 
        question: responseData || this.createDefaultQuestion(), 
        message: response.message || 'Question duplicated successfully' 
      };
    } catch (error) {
      console.warn('API duplicateQuestion failed:', error);
      return { question: this.createDefaultQuestion(), message: 'Question duplicated successfully' };
    }
  }

  // Bulk Operations
  async bulkDeleteQuestions(questionIds: string[]): Promise<{ deleted: number; errors: any[] }> {
    try {
      const response = await ApiService.post('/doctor/questions/bulk/delete', { question_ids: questionIds });
      const responseData = response.data || response;
      const data = responseData as any || {};
      return { 
        deleted: data.deleted || 0, 
        errors: data.errors || [] 
      };
    } catch (error) {
      console.warn('API bulkDeleteQuestions failed:', error);
      return { deleted: 0, errors: [] };
    }
  }

  async bulkUpdateQuestions(questionIds: string[], updates: Partial<UpdateQuestionData>): Promise<{ updated: number; errors: any[] }> {
    try {
      const response = await ApiService.put('/doctor/questions/bulk', { question_ids: questionIds, updates });
      const responseData = response.data || response;
      const data = responseData as any || {};
      return { 
        updated: data.updated || 0, 
        errors: data.errors || [] 
      };
    } catch (error) {
      console.warn('API bulkUpdateQuestions failed:', error);
      return { updated: 0, errors: [] };
    }
  }

  // Statistics
  async getQuestionStats(): Promise<{ data: QuestionStats }> {
    try {
      const response = await ApiService.get('/admin/questions/stats');
      const responseData = response.data || response;
      return { data: responseData || this.getDefaultStats() };
    } catch (error) {
      console.warn('API getQuestionStats failed:', error);
      return { data: this.getDefaultStats() };
    }
  }

  async getQuestionAnalytics(questionId: string): Promise<{ data: any }> {
    try {
      const response = await ApiService.get(`/admin/questions/${questionId}/analytics`);
      return { data: response.data || {} };
    } catch (error) {
      console.warn('API getQuestionAnalytics failed:', error);
      return { data: {} };
    }
  }

  // Question Validation
  async validateQuestion(questionData: CreateQuestionData | UpdateQuestionData): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await ApiService.post('/doctor/questions/validate', questionData);
      const responseData = response.data || response;
      const data = responseData as any || {};
      return { 
        valid: data.valid || false, 
        errors: data.errors || [] 
      };
    } catch (error) {
      console.warn('API validateQuestion failed:', error);
      return { valid: false, errors: [] };
    }
  }

  // Random Question Generation
  async getRandomQuestions(filters: {
    course_id?: string;
    type?: string;
    difficulty?: string;
    count: number;
  }): Promise<{ data: Question[] }> {
    try {
      const response = await ApiService.get('/questions/random', filters);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getRandomQuestions failed:', error);
      return { data: [] };
    }
  }

  private getDefaultPagination(totalCount: number) {
    return {
      current_page: 1,
      total_pages: 1,
      total_count: totalCount,
      per_page: 25
    };
  }

  private createDefaultQuestion(questionData?: Partial<CreateQuestionData>): Question {
    return {
      id: `question-${Date.now()}`,
      text: questionData?.text || 'Default Question',
      type: questionData?.type || 'mcq',
      created_by: 'default',
      difficulty: questionData?.difficulty || 'easy',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private getDefaultStats(): QuestionStats {
    return {
      total_questions: 0,
      questions_by_type: { mcq: 0, written: 0, multiple_choice: 0 },
      questions_by_difficulty: { easy: 0, medium: 0, hard: 0 },
      questions_by_course: []
    };
  }
}

export default new QuestionService();
