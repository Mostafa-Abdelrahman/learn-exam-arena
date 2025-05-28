
import ApiService from './api.service';

export interface DoctorStats {
  total_courses: number;
  total_exams: number;
  total_students: number;
  pending_grades: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'written';
  difficulty?: 'easy' | 'medium' | 'hard';
  chapter?: string;
  evaluation_criteria?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
}

export interface CreateQuestionData {
  text: string;
  type: 'mcq' | 'written';
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  created_by: string;
  evaluation_criteria?: string;
}

export interface UpdateQuestionData {
  text?: string;
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  evaluation_criteria?: string;
}

export interface CreateChoiceData {
  text: string;
  is_correct: boolean;
}

export interface UpdateChoiceData {
  text: string;
  is_correct: boolean;
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

  async getQuestions(doctorId: string): Promise<{ data: Question[] }> {
    return await ApiService.get(`/doctor/${doctorId}/questions`);
  }

  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    return await ApiService.get(`/doctor/questions/${questionId}/choices`);
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ data: Question }> {
    return await ApiService.post('/doctor/questions', questionData);
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ data: Question }> {
    return await ApiService.put(`/doctor/questions/${questionId}`, questionData);
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/doctor/questions/${questionId}`);
  }

  async createChoice(questionId: string, choiceData: CreateChoiceData): Promise<{ data: Choice }> {
    return await ApiService.post(`/doctor/questions/${questionId}/choices`, choiceData);
  }

  async updateChoice(choiceId: string, choiceData: UpdateChoiceData): Promise<{ data: Choice }> {
    return await ApiService.put(`/doctor/choices/${choiceId}`, choiceData);
  }
}

export default new DoctorService();
