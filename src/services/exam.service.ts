
import api from '../api/config';

export interface Exam {
  id: string;
  name: string;
  exam_name?: string;
  course_id: string;
  exam_date: string;
  duration: string;
  exam_duration?: string;
  instructions?: string;
  status: 'draft' | 'published' | 'archived';
  created_by?: string;
  course?: {
    name: string;
    course_name?: string;
    code: string;
    course_code?: string;
  };
  needs_grading?: boolean;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  exam_question_id: string;
  question_id: string;
  text: string;
  question_text: string;
  type: 'mcq' | 'written' | 'multiple-choice';
  question_type: string;
  weight?: number;
  difficulty_level?: string;
  choices?: {
    id: string;
    choice_id: string;
    text: string;
    choice_text: string;
    is_correct?: boolean;
  }[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string;
}

const ExamService = {
  // Student exam methods
  async getStudentExams(): Promise<{ data: Exam[] }> {
    const response = await api.get('/exams/available');
    return response.data;
  },

  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    const response = await api.get(`/courses/${courseId}/exams`);
    return response.data;
  },

  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    const response = await api.get('/exams/upcoming');
    return response.data;
  },

  async getExam(examId: string): Promise<{ data: Exam }> {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  },

  async getExamQuestions(examId: string): Promise<{ data: ExamQuestion[] }> {
    const response = await api.get(`/exams/${examId}/questions`);
    return response.data;
  },

  async startExam(examId: string): Promise<{ data: { student_exam_id: string } }> {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  },

  async submitAnswer(examId: string, questionId: string, answer: string): Promise<{ message: string }> {
    const response = await api.post(`/exams/${examId}/questions/${questionId}/answer`, {
      answer
    });
    return response.data;
  },

  async submitExam(examId: string, answers: StudentAnswer[]): Promise<{ message: string }> {
    const response = await api.post(`/exams/${examId}/submit`, {
      answers
    });
    return response.data;
  },

  async getAllStudentResults(): Promise<{ data: any[] }> {
    const response = await api.get('/results');
    return response.data;
  },

  async getExamResults(examId: string): Promise<{ data: any }> {
    const response = await api.get(`/results/${examId}`);
    return response.data;
  },

  // Doctor exam methods
  async getDoctorExams(doctorId?: string): Promise<{ data: Exam[] }> {
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

  async getExamSubmissions(examId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/exams/${examId}/submissions`);
    return response.data;
  },

  async addQuestionToExam(examId: string, questionId: string, weight: number): Promise<{ data: any }> {
    const response = await api.post(`/doctor/exams/${examId}/questions`, {
      question_id: questionId,
      weight
    });
    return response.data;
  },

  async removeQuestionFromExam(examQuestionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/doctor/exam-questions/${examQuestionId}`);
    return response.data;
  },

  async gradeAnswer(answerId: string, score: number, feedback?: string): Promise<{ message: string }> {
    const response = await api.post(`/answers/${answerId}/grade`, {
      score,
      feedback
    });
    return response.data;
  },

  async assignFinalGrade(examId: string, studentId: string, score: number, feedback?: string): Promise<{ message: string }> {
    const response = await api.post(`/exams/${examId}/student/${studentId}/grade`, {
      score,
      feedback
    });
    return response.data;
  }
};

export default ExamService;
