
import api from '../api/config';

export interface DoctorCourse {
  id: string;
  course_id?: string;
  name: string;
  course_name?: string;
  code: string;
  course_code?: string;
  description?: string;
  student_count: number;
  exam_count?: number;
}

export interface CourseStudent {
  id: string;
  student_id?: string;
  name: string;
  email: string;
  major?: string;
}

export interface Exam {
  id: string;
  name: string;
  course_id: string;
  exam_date: string;
  duration: string;
  instructions?: string;
  status: "draft" | "published" | "archived";
  created_by: string;
  created_at?: string;
  updated_at?: string;
  course?: {
    name: string;
    code: string;
  };
  submission_count?: number;
}

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

export interface Choice {
  id: string;
  choice_id?: string;
  question_id: string;
  text: string;
  choice_text?: string;
  is_correct: boolean;
}

export interface QuestionChoice {
  id: string;
  choice_id?: string;
  question_id: string;
  text: string;
  choice_text?: string;
  is_correct: boolean;
}

export interface ExamQuestion {
  id?: string;
  exam_id: string;
  question_id: string;
  weight: number;
  question?: Question;
}

const DoctorService = {
  // Get courses assigned to doctor
  async getDoctorCourses(doctorId?: string): Promise<{ data: DoctorCourse[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/courses${params}`);
    return response.data;
  },

  // Alias for getDoctorCourses
  async getCourses(doctorId?: string): Promise<{ data: DoctorCourse[] }> {
    return this.getDoctorCourses(doctorId);
  },

  // Get students in a specific course
  async getCourseStudents(courseId: string): Promise<{ data: CourseStudent[] }> {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  },

  // Get doctor's dashboard statistics
  async getDoctorStats(doctorId?: string): Promise<{ data: any }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/stats${params}`);
    return response.data;
  },

  // Exam management
  async getExams(doctorId?: string): Promise<{ data: Exam[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/exams${params}`);
    return response.data;
  },

  async createExam(examData: Partial<Exam>): Promise<{ data: Exam }> {
    const response = await api.post('/doctor/exams', examData);
    return response.data;
  },

  async updateExam(examId: string, examData: Partial<Exam>): Promise<{ data: Exam }> {
    const response = await api.put(`/doctor/exams/${examId}`, examData);
    return response.data;
  },

  async deleteExam(examId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/exams/${examId}`);
    return response.data;
  },

  // Exam questions management
  async getExamQuestions(examId: string): Promise<{ data: ExamQuestion[] }> {
    const response = await api.get(`/doctor/exams/${examId}/questions`);
    return response.data;
  },

  async addQuestionToExam(examId: string, questionId: string): Promise<{ data: ExamQuestion }> {
    const response = await api.post(`/doctor/exams/${examId}/questions`, { question_id: questionId });
    return response.data;
  },

  async removeQuestionFromExam(examQuestionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/exam-questions/${examQuestionId}`);
    return response.data;
  },

  // Question management
  async getQuestions(doctorId?: string): Promise<{ data: Question[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/questions${params}`);
    return response.data;
  },

  async createQuestion(questionData: Partial<Question>): Promise<{ data: Question }> {
    const response = await api.post('/doctor/questions', questionData);
    return response.data;
  },

  async updateQuestion(questionId: string, questionData: Partial<Question>): Promise<{ data: Question }> {
    const response = await api.put(`/doctor/questions/${questionId}`, questionData);
    return response.data;
  },

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/questions/${questionId}`);
    return response.data;
  },

  // Question choices management
  async getQuestionChoices(questionId: string): Promise<{ data: QuestionChoice[] }> {
    const response = await api.get(`/doctor/questions/${questionId}/choices`);
    return response.data;
  },

  async createChoice(questionId: string, choiceData: Partial<QuestionChoice>): Promise<{ data: QuestionChoice }> {
    const response = await api.post(`/doctor/questions/${questionId}/choices`, choiceData);
    return response.data;
  },

  async updateChoice(choiceId: string, choiceData: Partial<QuestionChoice>): Promise<{ data: QuestionChoice }> {
    const response = await api.put(`/doctor/choices/${choiceId}`, choiceData);
    return response.data;
  },

  async deleteChoice(choiceId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/choices/${choiceId}`);
    return response.data;
  },

  // Admin functions for doctors
  async getAllDoctors(): Promise<{ data: any[] }> {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  async createDoctor(doctorData: any): Promise<{ data: any }> {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  async updateDoctor(doctorId: string, doctorData: any): Promise<{ data: any }> {
    const response = await api.put(`/admin/doctors/${doctorId}`, doctorData);
    return response.data;
  },

  async deleteDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/doctors/${doctorId}`);
    return response.data;
  },

  // Get all question types
  async getQuestionTypes(): Promise<{ data: any[] }> {
    const response = await api.get('/question-types');
    return response.data;
  }
};

export default DoctorService;
