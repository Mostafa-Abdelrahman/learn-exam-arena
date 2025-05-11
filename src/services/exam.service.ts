
import api from '../api/config';

const ExamService = {
  // Get all exams
  async getAllExams() {
    const response = await api.get('/exams');
    return response.data;
  },

  // Get a specific exam
  async getExam(id: string) {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  // Get exams for a specific course
  async getCourseExams(courseId: string) {
    const response = await api.get(`/courses/${courseId}/exams`);
    return response.data;
  },

  // Get exams created by a specific doctor
  async getDoctorExams(doctorId: string) {
    const response = await api.get('/exams');
    return response.data;
  },

  // Get exams available for a specific student
  async getStudentExams() {
    const response = await api.get('/exams/available');
    return response.data;
  },
  
  // Get upcoming exams for a student
  async getUpcomingExams() {
    const response = await api.get('/exams/upcoming');
    return response.data;
  },

  // Create a new exam (doctor only)
  async createExam(examData: any) {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  // Update an exam (doctor only)
  async updateExam(id: string, examData: any) {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  // Delete an exam (doctor only)
  async deleteExam(id: string) {
    await api.delete(`/exams/${id}`);
    return true;
  },

  // Publish an exam (doctor only)
  async publishExam(id: string) {
    const response = await api.put(`/exams/${id}/status`, { status: 'published' });
    return response.data;
  },

  // Add questions to an exam (doctor only)
  async addQuestionToExam(examId: string, questionData: any) {
    const response = await api.post(`/exams/${examId}/questions`, questionData);
    return response.data;
  },

  // Remove a question from an exam (doctor only)
  async removeQuestionFromExam(examId: string, questionId: string) {
    await api.delete(`/exams/${examId}/questions/${questionId}`);
    return true;
  },

  // Get exam questions
  async getExamQuestions(examId: string) {
    const response = await api.get(`/exams/${examId}`);
    return response.data.questions || [];
  },

  // Start an exam for a student
  async startExam(examId: string) {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  },

  // Submit answer to a specific question
  async submitAnswer(examId: string, questionId: string, answer: string) {
    const response = await api.post(`/exams/${examId}/questions/${questionId}/answer`, { answer });
    return response.data;
  },

  // Submit exam with all answers
  async submitExam(examId: string, answers: any[]) {
    const response = await api.post(`/exams/${examId}/submit`, { answers });
    return response.data;
  },

  // Get student exam results
  async getStudentExamResults(examId: string) {
    const response = await api.get(`/results/${examId}`);
    return response.data;
  },

  // Get all student results
  async getAllStudentResults() {
    const response = await api.get('/results');
    return response.data;
  },

  // Grade a written answer (doctor only)
  async gradeWrittenAnswer(answerId: string, gradeData: any) {
    const response = await api.post(`/answers/${answerId}/grade`, gradeData);
    return response.data;
  },

  // Assign final grade to student exam (doctor only)
  async assignFinalGrade(examId: string, studentId: string, gradeData: any) {
    const response = await api.post(`/exams/${examId}/student/${studentId}/grade`, gradeData);
    return response.data;
  },

  // Get exam results (doctor only)
  async getExamResults(examId: string) {
    const response = await api.get(`/exams/${examId}/results`);
    return response.data;
  },
};

export default ExamService;
