
import ApiService from './api.service';

export interface ExamFilters {
  course_id?: string;
  doctor_id?: string;
  status?: 'draft' | 'published' | 'completed' | 'archived';
  exam_date_from?: string;
  exam_date_to?: string;
}

export interface CreateExamData {
  name: string;
  course_id: string;
  exam_date: string;
  duration: string;
  instructions?: string;
  status: 'draft' | 'published';
  total_marks?: number;
  passing_marks?: number;
}

export interface UpdateExamData {
  name?: string;
  exam_date?: string;
  duration?: string;
  instructions?: string;
  status?: 'draft' | 'published' | 'completed' | 'archived';
  total_marks?: number;
  passing_marks?: number;
}

export interface ExamSubmission {
  exam_id: string;
  answers: Array<{
    question_id: string;
    answer: string;
    selected_choices?: string[];
  }>;
}

export interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  status: 'completed' | 'graded' | 'pending';
  submitted_at: string;
  graded_at?: string;
  feedback?: string;
}

export interface GradingData {
  student_exam_id: string;
  score: number;
  feedback?: string;
  answer_grades?: Array<{
    question_id: string;
    score: number;
    feedback?: string;
  }>;
}

class ExamService {
  // Exam Management (Doctor/Admin)
  async getAllExams(filters?: ExamFilters, pagination?: PaginationParams): Promise<{
    data: Exam[];
    pagination: any;
  }> {
    const params = { ...filters, ...pagination };
    return await ApiService.get('/exams', params);
  }

  async getExamById(examId: string): Promise<{ data: Exam }> {
    return await ApiService.get(`/exams/${examId}`);
  }

  async getExam(examId: string): Promise<{ data: Exam }> {
    return await ApiService.get(`/exams/${examId}`);
  }

  async createExam(examData: CreateExamData): Promise<{ exam: Exam; message: string }> {
    return await ApiService.post('/doctor/exams', examData);
  }

  async updateExam(examId: string, examData: UpdateExamData): Promise<{ exam: Exam; message: string }> {
    return await ApiService.put(`/doctor/exams/${examId}`, examData);
  }

  async deleteExam(examId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/doctor/exams/${examId}`);
  }

  async publishExam(examId: string): Promise<{ message: string }> {
    return await ApiService.post(`/doctor/exams/${examId}/publish`);
  }

  async archiveExam(examId: string): Promise<{ message: string }> {
    return await ApiService.post(`/doctor/exams/${examId}/archive`);
  }

  // Question Management
  async getExamQuestions(examId: string): Promise<{ data: ExamQuestion[] }> {
    return await ApiService.get(`/exams/${examId}/questions`);
  }

  async addQuestionToExam(examId: string, questionId: string, weight?: number): Promise<{ message: string }> {
    return await ApiService.post(`/doctor/exams/${examId}/questions`, {
      question_id: questionId,
      weight: weight || 1
    });
  }

  async removeQuestionFromExam(examQuestionId: string): Promise<{ message: string }> {
    return await ApiService.delete(`/doctor/exam-questions/${examQuestionId}`);
  }

  async updateQuestionWeight(examQuestionId: string, weight: number): Promise<{ message: string }> {
    return await ApiService.put(`/doctor/exam-questions/${examQuestionId}`, { weight });
  }

  // Student Exam Operations
  async getAvailableExams(): Promise<{ data: Exam[] }> {
    return await ApiService.get('/student/exams/available');
  }

  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    return await ApiService.get('/student/exams/upcoming');
  }

  async getStudentExams(): Promise<{ data: Exam[] }> {
    return await ApiService.get('/student/exams');
  }

  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    return await ApiService.get(`/courses/${courseId}/exams`);
  }

  async startExam(examId: string): Promise<{ student_exam_id: string; questions: ExamQuestion[] }> {
    return await ApiService.post(`/student/exams/${examId}/start`);
  }

  async submitExam(examId: string, answers: any[]): Promise<{ message: string; result_id: string }> {
    const submission: ExamSubmission = {
      exam_id: examId,
      answers: answers.map(answer => ({
        question_id: answer.questionId,
        answer: answer.answer
      }))
    };
    return await ApiService.post(`/student/exams/${examId}/submit`, submission);
  }

  async submitAnswer(examId: string, questionId: string, answer: string): Promise<{ message: string }> {
    return await ApiService.post(`/student/exams/${examId}/questions/${questionId}/answer`, { answer });
  }

  async saveExamProgress(examId: string, answers: any[]): Promise<{ message: string }> {
    return await ApiService.post(`/student/exams/${examId}/save-progress`, { answers });
  }

  async getExamProgress(examId: string): Promise<{ data: any }> {
    return await ApiService.get(`/student/exams/${examId}/progress`);
  }

  // Results and Grading
  async getExamResults(examId: string): Promise<{ data: ExamResult[] }> {
    return await ApiService.get(`/doctor/exams/${examId}/results`);
  }

  async getStudentResults(studentId?: string): Promise<{ data: ExamResult[] }> {
    const endpoint = studentId ? `/admin/students/${studentId}/results` : '/student/results';
    return await ApiService.get(endpoint);
  }

  async gradeExam(gradingData: GradingData): Promise<{ message: string }> {
    return await ApiService.post('/doctor/grading', gradingData);
  }

  async bulkGradeExams(gradingDataList: GradingData[]): Promise<{ graded: number; errors: any[] }> {
    return await ApiService.post('/doctor/grading/bulk', { grades: gradingDataList });
  }

  // Analytics
  async getExamAnalytics(examId: string): Promise<{ data: any }> {
    return await ApiService.get(`/admin/exams/${examId}/analytics`);
  }

  async getExamStats(): Promise<{ data: any }> {
    return await ApiService.get('/admin/exams/stats');
  }
}

export default new ExamService();
