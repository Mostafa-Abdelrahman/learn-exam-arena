
import ApiService from './api.service';

export interface QuestionFilters {
  type?: 'mcq' | 'written' | 'true_false' | 'fill_blank';
  difficulty?: 'easy' | 'medium' | 'hard';
  chapter?: string;
  course_id?: string;
  created_by?: string;
}

export interface CreateQuestionData {
  text: string;
  type: 'mcq' | 'written' | 'true_false' | 'fill_blank';
  difficulty: 'easy' | 'medium' | 'hard';
  chapter?: string;
  course_id?: string;
  evaluation_criteria?: string;
  marks: number;
  choices?: Array<{
    text: string;
    is_correct: boolean;
  }>;
}

export interface UpdateQuestionData {
  text?: string;
  type?: 'mcq' | 'written' | 'true_false' | 'fill_blank';
  difficulty?: 'easy' | 'medium' | 'hard';
  chapter?: string;
  evaluation_criteria?: string;
  marks?: number;
}

export interface QuestionStats {
  total_questions: number;
  by_type: {
    mcq: number;
    written: number;
    true_false: number;
    fill_blank: number;
  };
  by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  usage_stats: {
    most_used: Question[];
    least_used: Question[];
  };
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

  async duplicateQuestion(questionId: string): Promise<{ question: Question; message: string }> {
    return await ApiService.post(`/doctor/questions/${questionId}/duplicate`);
  }

  // Choice Management
  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    return await ApiService.get(`/questions/${questionId}/choices`);
  }

  async addChoice(questionId: string, choiceData: {
    text: string;
    is_correct: boolean;
  }): Promise<{ choice: Choice; message: string }> {
    return await ApiService.post(`/doctor/questions/${questionId}/choices`, choiceData);
  }

  async updateChoice(choiceId: string, choiceData: {
    text?: string;
    is_correct?: boolean;
  }): Promise<{ choice: Choice; message: string }> {
    return await ApiService.put(`/doctor/choices/${choiceId}`, choiceData);
  }

  async deleteChoice(choiceId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/doctor/choices/${choiceId}`);
  }

  // Question Bank
  async getQuestionBank(courseId?: string): Promise<{ data: Question[] }> {
    const params = courseId ? { course_id: courseId } : {};
    return await ApiService.get('/doctor/question-bank', params);
  }

  async importQuestions(file: File, courseId?: string): Promise<{ imported: number; errors: any[] }> {
    const additionalData = courseId ? { course_id: courseId } : {};
    return await ApiService.upload('/doctor/questions/import', file, additionalData);
  }

  async exportQuestions(filters?: QuestionFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(filters as any).toString() : '';
    const response = await fetch(`${ApiService['baseURL']}/doctor/questions/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.blob();
  }

  // Question Templates
  async getQuestionTemplates(): Promise<{ data: any[] }> {
    return await ApiService.get('/doctor/question-templates');
  }

  async createQuestionFromTemplate(templateId: string, data: any): Promise<{ question: Question; message: string }> {
    return await ApiService.post(`/doctor/question-templates/${templateId}/create`, data);
  }

  // Bulk Operations
  async bulkUpdateQuestions(questionIds: string[], updates: UpdateQuestionData): Promise<{ updated: number; errors: any[] }> {
    return await ApiService.put('/doctor/questions/bulk', {
      question_ids: questionIds,
      updates
    });
  }

  async bulkDeleteQuestions(questionIds: string[]): Promise<{ deleted: number; errors: any[] }> {
    return await ApiService.delete('/doctor/questions/bulk', {
      question_ids: questionIds
    });
  }

  // Statistics
  async getQuestionStats(): Promise<{ data: QuestionStats }> {
    return await ApiService.get('/admin/questions/stats');
  }

  async getQuestionUsage(questionId: string): Promise<{ data: any }> {
    return await ApiService.get(`/admin/questions/${questionId}/usage`);
  }

  // Search and Recommendations
  async searchQuestions(query: string, filters?: QuestionFilters): Promise<{ data: Question[] }> {
    return await ApiService.get('/questions/search', { q: query, ...filters });
  }

  async getRecommendedQuestions(courseId: string, examType?: string): Promise<{ data: Question[] }> {
    return await ApiService.get('/doctor/questions/recommendations', {
      course_id: courseId,
      exam_type: examType
    });
  }
}

export default new QuestionService();
