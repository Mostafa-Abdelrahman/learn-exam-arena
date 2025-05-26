
import api from '../api/config';

export interface Question {
  id: string;
  question_id?: string;
  text: string;
  question_text?: string;
  type: 'mcq' | 'written';
  question_type?: string;
  chapter?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  difficulty_level?: string;
  created_by: string;
  evaluation_criteria?: string;
  choices?: QuestionChoice[];
}

export interface QuestionChoice {
  id: string;
  choice_id?: string;
  question_id: string;
  text: string;
  choice_text?: string;
  is_correct: boolean;
}

const QuestionService = {
  // Get all questions for a doctor
  async getDoctorQuestions(doctorId?: string): Promise<{ data: Question[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/questions${params}`);
    return response.data;
  },

  // Create a new question
  async createQuestion(questionData: Partial<Question>): Promise<{ data: Question }> {
    const response = await api.post('/doctor/questions', questionData);
    return response.data;
  },

  // Update a question
  async updateQuestion(questionId: string, questionData: Partial<Question>): Promise<{ data: Question }> {
    const response = await api.put(`/doctor/questions/${questionId}`, questionData);
    return response.data;
  },

  // Delete a question
  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/questions/${questionId}`);
    return response.data;
  },

  // Get choices for a question
  async getQuestionChoices(questionId: string): Promise<{ data: QuestionChoice[] }> {
    const response = await api.get(`/doctor/questions/${questionId}/choices`);
    return response.data;
  },

  // Create a choice for a question
  async createChoice(questionId: string, choiceData: Partial<QuestionChoice>): Promise<{ data: QuestionChoice }> {
    const response = await api.post(`/doctor/questions/${questionId}/choices`, choiceData);
    return response.data;
  },

  // Update a choice
  async updateChoice(choiceId: string, choiceData: Partial<QuestionChoice>): Promise<{ data: QuestionChoice }> {
    const response = await api.put(`/doctor/choices/${choiceId}`, choiceData);
    return response.data;
  },

  // Delete a choice
  async deleteChoice(choiceId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/choices/${choiceId}`);
    return response.data;
  },

  // Get all question types
  async getQuestionTypes(): Promise<{ data: any[] }> {
    const response = await api.get('/question-types');
    return response.data;
  }
};

export default QuestionService;
