import ApiService from './api.service';
import { dummyQuestions, dummyChoices } from '@/data/dummy-questions';
import { STORAGE_KEYS, getFromStorage, saveToStorage, mockQuestions } from '@/data/exam-data';
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
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'programming' | 'essay';
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
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'programming' | 'essay';
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
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
      
      // Handle nested data structure: {success: true, data: {data: {...}}}
      let statsData = null;
      const responseData = response.data as any;
      if (responseData && responseData.data) {
        statsData = responseData.data;
      } else if (responseData && typeof responseData === 'object') {
        statsData = responseData;
      }
      
      return { data: statsData || this.getDefaultStats() };
    } catch (error) {
      console.warn('API getDoctorStats failed, using default stats:', error);
      return { data: this.getDefaultStats() };
    }
  }

  async getExams(doctorId: string): Promise<{ data: Exam[] }> {
    try {
      const response = await ApiService.get('/doctor/exams');
      
      // Handle nested data structure
      let examsArray = [];
      const responseData = response.data as any;
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        examsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        examsArray = responseData;
      }
      
      // Filter by doctor ID if provided (the backend already filters by authenticated user)
      if (doctorId) {
        examsArray = examsArray.filter((exam: any) => exam.created_by === doctorId);
      }
      
      return { data: examsArray };
    } catch (error) {
      console.warn('API getExams failed, using mock data:', error);
      return { data: [] };
    }
  }

  async getCourses(doctorId: string): Promise<{ data: Course[] }> {
    try {
      const response = await ApiService.get('/doctor/courses');
      
      // Handle nested data structure
      let coursesArray = [];
      const responseData = response.data as any;
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        coursesArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        coursesArray = responseData;
      }
      
      return { data: coursesArray };
    } catch (error) {
      console.warn('API getCourses failed, using mock data:', error);
      return { data: [] };
    }
  }

  async getStudents(doctorId: string): Promise<{ data: User[] }> {
    try {
      const response = await ApiService.get(`/doctor/${doctorId}/students`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getStudents failed, using dummy data:', error);
      return { data: [] };
    }
  }

  async getQuestions(doctorId: string): Promise<{ data: Question[] }> {
    try {
      const response = await ApiService.get('/doctor/questions');
      
      // Handle nested data structure: {success: true, data: {data: Array(3)}}
      let questionsArray = [];
      const responseData = response.data as any;
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        questionsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        questionsArray = responseData;
      }
      
      return { data: questionsArray };
    } catch (error) {
      console.warn('API getQuestions failed, using mock data:', error);
      return { data: getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions) };
    }
  }

  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    try {
      const response = await ApiService.get(`/doctor/questions/${questionId}/choices`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getQuestionChoices failed, using mock data:', error);
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      const question = questions.find((q: Question) => q.id === questionId);
      return { data: question?.choices || [] };
    }
  }

  async createQuestion(questionData: CreateQuestionData): Promise<{ data: Question; message: string }> {
    try {
      const response = await ApiService.post('/doctor/questions', questionData);
      const responseData = response.data || response;
      const dataObj = responseData as Record<string, any>;
      if (dataObj && typeof dataObj === 'object' && 'data' in dataObj && dataObj.data && 'id' in dataObj.data) {
        return {
          data: dataObj.data as Question,
          message: (dataObj as any).message || 'Question created successfully',
        };
      } else {
        // fallback to mock if structure is not as expected
        const newQuestion = this.createDefaultQuestion(questionData);
        return {
          data: newQuestion,
          message: 'Question created successfully',
        };
      }
    } catch (error) {
      console.warn('API createQuestion failed, using mock creation:', error);
      const newQuestion = this.createDefaultQuestion(questionData);
      // Save to mock data
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      questions.push(newQuestion);
      saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
      return {
        data: newQuestion,
        message: 'Question created successfully',
      };
    }
  }

  async updateQuestion(questionId: string, questionData: UpdateQuestionData): Promise<{ data: Question; message: string }> {
    try {
      const response = await ApiService.put(`/doctor/questions/${questionId}`, questionData);
      const responseData = response.data || response;
      return {
        data: responseData || this.createDefaultQuestion({ ...questionData, text: questionData.text || '', type: 'multiple_choice' }),
        message: response.message || 'Question updated successfully'
      };
    } catch (error) {
      console.warn('API updateQuestion failed, using mock update:', error);
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      const questionIndex = questions.findIndex((q: Question) => q.id === questionId);
      
      if (questionIndex !== -1) {
        questions[questionIndex] = {
          ...questions[questionIndex],
          ...questionData,
          updated_at: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
        return { 
          data: questions[questionIndex],
          message: 'Question updated successfully'
        };
      }
      
      return { 
        data: this.createDefaultQuestion({ text: '', type: 'multiple_choice' }),
        message: 'Question updated successfully'
      };
    }
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete(`/doctor/questions/${questionId}`);
      return { message: response.message || 'Question deleted successfully' };
    } catch (error) {
      console.warn('API deleteQuestion failed, using mock deletion:', error);
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      const filteredQuestions = questions.filter((q: Question) => q.id !== questionId);
      saveToStorage(STORAGE_KEYS.QUESTIONS, filteredQuestions);
      return { message: 'Question deleted successfully' };
    }
  }

  async createChoice(questionId: string, choiceData: CreateChoiceData): Promise<{ data: Choice; message: string }> {
    try {
      const response = await ApiService.post(`/doctor/questions/${questionId}/choices`, choiceData);
      const responseData = response.data || response;
      return {
        data: responseData || this.createDefaultChoice(questionId, choiceData),
        message: response.message || 'Choice created successfully'
      };
    } catch (error) {
      console.warn('API createChoice failed, using mock creation:', error);
      const newChoice = this.createDefaultChoice(questionId, choiceData);
      
      // Add choice to question in mock data
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      const questionIndex = questions.findIndex((q: Question) => q.id === questionId);
      
      if (questionIndex !== -1) {
        if (!questions[questionIndex].choices) {
          questions[questionIndex].choices = [];
        }
        questions[questionIndex].choices.push(newChoice);
        saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
      }
      
      return {
        data: newChoice,
        message: 'Choice created successfully'
      };
    }
  }

  async updateChoice(choiceId: string, choiceData: UpdateChoiceData): Promise<{ data: Choice }> {
    try {
      const response = await ApiService.put(`/doctor/choices/${choiceId}`, choiceData);
      const responseData = response.data || response;
      return { data: responseData || this.createDefaultChoice('', { text: choiceData.text || '', is_correct: choiceData.is_correct || false }) };
    } catch (error) {
      console.warn('API updateChoice failed, using mock update:', error);
      const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, mockQuestions);
      
      // Find and update choice
      for (let question of questions) {
        if (question.choices) {
          const choiceIndex = question.choices.findIndex((c: Choice) => c.id === choiceId);
          if (choiceIndex !== -1) {
            question.choices[choiceIndex] = {
              ...question.choices[choiceIndex],
              ...choiceData
            };
            saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
            return { data: question.choices[choiceIndex] };
          }
        }
      }
      
      return { data: this.createDefaultChoice('', { text: '', is_correct: false }) };
    }
  }

  private getDefaultStats(): DoctorStats {
    return {
      total_courses: 3,
      total_exams: 5,
      total_students: 45,
      pending_grades: 2
    };
  }

  private createDefaultQuestion(questionData: Partial<CreateQuestionData>): Question {
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: questionData.text || '',
      type: questionData.type || 'multiple_choice',
      difficulty: questionData.difficulty || 'easy',
      chapter: questionData.chapter,
      evaluation_criteria: questionData.evaluation_criteria,
      created_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private createDefaultChoice(questionId: string, choiceData: Partial<CreateChoiceData>): Choice {
    return {
      id: Math.random().toString(36).substr(2, 9),
      question_id: questionId,
      text: choiceData.text || '',
      is_correct: choiceData.is_correct || false
    };
  }
}

export default new DoctorService();
