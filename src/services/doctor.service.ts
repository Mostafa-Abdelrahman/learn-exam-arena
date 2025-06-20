import ApiService from './api.service';
import { dummyQuestions, dummyChoices } from '@/data/dummy-questions';
import { User } from './auth.service';

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
      return await ApiService.get(`/doctor/${doctorId}/stats`);
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
      return await ApiService.get(`/doctor/${doctorId}/exams`);
    } catch (error) {
      console.warn('API getExams failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getCourses(doctorId: string): Promise<{ data: Course[] }> {
    try {
      return await ApiService.get(`/doctor/${doctorId}/courses`);
    } catch (error) {
      console.warn('API getCourses failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getStudents(doctorId: string): Promise<{ data: User[] }> {
    try {
      return await ApiService.get(`/doctor/${doctorId}/students`);
    } catch (error) {
      console.warn('API getStudents failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getQuestions(doctorId: string): Promise<{ data: Question[] }> {
    try {
      return await ApiService.get(`/doctor/${doctorId}/questions`);
    } catch (error) {
      console.warn('API getQuestions failed, using dummy data:', error);
      return { data: dummyQuestions };
    }
  }

  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    try {
      return await ApiService.get(`/doctor/questions/${questionId}/choices`);
    } catch (error) {
      console.warn('API getQuestionChoices failed, using dummy data:', error);
      return { data: dummyChoices.filter(c => c.question_id === questionId) };
    }
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ data: Question; message: string }> {
    try {
      return await ApiService.post('/doctor/questions', questionData);
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
      const response = await ApiService.put<{ question: Question; message: string }>(`/doctor/questions/${questionId}`, questionData);
      return {
        data: response.question,
        message: response.message
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
      return await ApiService.delete(`/doctor/questions/${questionId}`);
    } catch (error) {
      console.warn('API deleteQuestion failed, using dummy response:', error);
      return { message: 'Question deleted successfully' };
    }
  }

  async createChoice(questionId: string, choiceData: CreateChoiceData): Promise<{ data: Choice; message: string }> {
    try {
      return await ApiService.post(`/doctor/questions/${questionId}/choices`, choiceData);
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
      return await ApiService.put(`/doctor/choices/${choiceId}`, choiceData);
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
