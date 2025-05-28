
import api from '../api/config';

export interface DoctorStats {
  total_courses: number;
  total_students: number;
  total_exams: number;
  pending_grading: number;
  total_questions: number;
  recent_submissions: number;
  courses_breakdown: Array<{
    course_name: string;
    students: number;
    exams: number;
    pending_grades: number;
  }>;
}

export interface Question {
  id: string;
  text: string;
  type: "mcq" | "written";
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
  evaluation_criteria?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamQuestion {
  id?: string;
  exam_id?: string;
  question_id: string;
  weight?: number;
  question?: Question;
}

const DoctorService = {
  // Doctor Stats
  async getDoctorStats(): Promise<{ data: DoctorStats }> {
    const response = await api.get('/doctor/stats');
    return response.data;
  },

  // Courses
  async getCourses(doctorId?: string): Promise<{ data: Course[] }> {
    const params = doctorId ? `?doctor_id=${doctorId}` : '';
    const response = await api.get(`/doctor/courses${params}`);
    return response.data;
  },

  // Exams
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

  // Exam Questions
  async getExamQuestions(examId: string): Promise<{ data: ExamQuestion[] }> {
    const response = await api.get(`/doctor/exams/${examId}/questions`);
    return response.data;
  },

  async addQuestionToExam(examId: string, questionId: string): Promise<{ message: string }> {
    const response = await api.post(`/doctor/exams/${examId}/questions`, {
      question_id: questionId
    });
    return response.data;
  },

  async removeQuestionFromExam(examQuestionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/exam-questions/${examQuestionId}`);
    return response.data;
  },

  // Questions
  async getQuestions(doctorId?: string, filters?: {
    type?: string;
    difficulty?: string;
  }): Promise<{ data: Question[] }> {
    let params = doctorId ? `?doctor_id=${doctorId}` : '?';
    if (filters?.type) params += `&type=${filters.type}`;
    if (filters?.difficulty) params += `&difficulty=${filters.difficulty}`;
    
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

  // Question Choices
  async getQuestionChoices(questionId: string): Promise<{ data: Choice[] }> {
    const response = await api.get(`/doctor/questions/${questionId}/choices`);
    return response.data;
  },

  async createChoice(questionId: string, choiceData: Partial<Choice>): Promise<{ data: Choice }> {
    const response = await api.post(`/doctor/questions/${questionId}/choices`, choiceData);
    return response.data;
  },

  async updateChoice(choiceId: string, choiceData: Partial<Choice>): Promise<{ data: Choice }> {
    const response = await api.put(`/doctor/choices/${choiceId}`, choiceData);
    return response.data;
  },

  async deleteChoice(choiceId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/choices/${choiceId}`);
    return response.data;
  }
};

export default DoctorService;
