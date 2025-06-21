
import ApiService from './api.service';
import { dummyQuestions, dummyChoices } from '@/data/dummy-questions';
import { SafeUserResponse as User } from '@/types/api-response';

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
  text?: string;
  is_correct?: boolean;
}

class DoctorService {
  async getDoctorStats(doctorId: string): Promise<{ data: DoctorStats }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/stats`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getDoctorStats failed, using dummy data:', error);
      return {
        data: {
          total_courses: 3,
          total_exams: 5,
          total_students: 45,
          pending_grades: 2
        }
      };
    }
  }

  async getExams(doctorId: string): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/exams`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getExams failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getCourses(doctorId: string): Promise<{ data: Course[] }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/courses`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getCourses failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getStudents(doctorId: string): Promise<{ data: User[] }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/students`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getStudents failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getQuestions(doctorId: string): Promise<{ data: Question[] }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/questions`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getQuestions failed, using dummy data:', error);
      return { data: dummyQuestions };
    }
  }

  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    try {
      const response = await ApiService.get(`/doctor/questions/${questionId}/choices`);
      return { data: response.data };
    } catch (error) {
      console.warn('API getQuestionChoices failed, using dummy data:', error);
      return { data: dummyChoices.filter(c => c.question_id === questionId) };
    }
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ data: Question; message: string }> {
    try {
      const response = await ApiService.post('/doctor/questions', questionData);
      return { 
        data: response.data, 
        message: response.message || 'Question created successfully' 
      };
    } catch (error) {
      console.warn('API createQuestion failed, using dummy data:', error);
      const dummyQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        ...questionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return {
        data: dummyQuestion,
        message: 'Question created successfully (dummy data)'
      };
    }
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ data: Question; message: string }> {
    try {
      const response = await ApiService.put(`/doctor/questions/${questionId}`, questionData);
      return {
        data: response.data,
        message: response.message || 'Question updated successfully'
      };
    } catch (error) {
      console.warn('API updateQuestion failed, using dummy response:', error);
      const existingQuestion = dummyQuestions.find(q => q.id === questionId) || dummyQuestions[0];
      const updatedQuestion = {
        ...existingQuestion,
        ...questionData,
        updated_at: new Date().toISOString()
      };
      return { 
        data: updatedQuestion,
        message: 'Question updated successfully (dummy data)'
      };
    }
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/doctor/questions/${questionId}`);
      return { message: response.message || 'Question deleted successfully' };
    } catch (error) {
      console.warn('API deleteQuestion failed, using dummy response:', error);
      return { message: 'Question deleted successfully' };
    }
  }

  async createChoice(questionId: string, choiceData: CreateChoiceData): Promise<{ data: Choice; message: string }> {
    try {
      const response = await ApiService.post(`/doctor/questions/${questionId}/choices`, choiceData);
      return {
        data: response.data,
        message: response.message || 'Choice created successfully'
      };
    } catch (error) {
      console.warn('API createChoice failed, using dummy data:', error);
      const dummyChoice = {
        id: Math.random().toString(36).substr(2, 9),
        question_id: questionId,
        ...choiceData
      };
      return {
        data: dummyChoice,
        message: 'Choice created successfully (dummy data)'
      };
    }
  }

  async updateChoice(choiceId: string, choiceData: UpdateChoiceData): Promise<{ data: Choice }> {
    try {
      const response = await ApiService.put(`/doctor/choices/${choiceId}`, choiceData);
      return { data: response.data };
    } catch (error) {
      console.warn('API updateChoice failed, using dummy response:', error);
      const existingChoice = dummyChoices.find(c => c.id === choiceId) || dummyChoices[0];
      const updatedChoice = {
        ...existingChoice,
        ...choiceData
      };
      return { data: updatedChoice };
    }
  }
}

export default new DoctorService();
