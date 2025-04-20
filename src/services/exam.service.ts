
import API from "./api.service";

const ExamService = {
  // Get all exams
  getAllExams() {
    return API.get("/exams");
  },

  // Get a specific exam
  getExam(id: number) {
    return API.get(`/exams/${id}`);
  },

  // Get exams for a specific course
  getCourseExams(courseId: number) {
    return API.get(`/courses/${courseId}/exams`);
  },

  // Get exams created by a specific doctor
  getDoctorExams(doctorId: number) {
    return API.get(`/doctors/${doctorId}/exams`);
  },

  // Get exams available for a specific student
  getStudentExams(studentId: number) {
    return API.get(`/students/${studentId}/exams`);
  },

  // Create a new exam (doctor only)
  createExam(examData: any) {
    return API.post("/exams", examData);
  },

  // Update an exam (doctor only)
  updateExam(id: number, examData: any) {
    return API.put(`/exams/${id}`, examData);
  },

  // Delete an exam (doctor only)
  deleteExam(id: number) {
    return API.delete(`/exams/${id}`);
  },

  // Publish an exam (doctor only)
  publishExam(id: number) {
    return API.patch(`/exams/${id}/publish`);
  },

  // Add questions to an exam (doctor only)
  addQuestionsToExam(examId: number, questionsData: any) {
    return API.post(`/exams/${examId}/questions`, questionsData);
  },

  // Remove a question from an exam (doctor only)
  removeQuestionFromExam(examQuestionId: number) {
    return API.delete(`/exam-questions/${examQuestionId}`);
  },

  // Get exam questions
  getExamQuestions(examId: number) {
    return API.get(`/exams/${examId}/questions`);
  },

  // Submit student exam answers
  submitExamAnswers(examId: number, studentId: number, answersData: any) {
    return API.post(`/exams/${examId}/submit`, { 
      student_id: studentId,
      answers: answersData 
    });
  },

  // Get student exam results
  getStudentExamResults(studentId: number, examId: number) {
    return API.get(`/students/${studentId}/exams/${examId}/results`);
  },

  // Grade a written answer (doctor only)
  gradeWrittenAnswer(studentExamAnswerId: number, gradeData: any) {
    return API.patch(`/student-exam-answers/${studentExamAnswerId}/grade`, gradeData);
  },

  // Get all student answers for an exam (doctor only)
  getExamStudentAnswers(examId: number) {
    return API.get(`/exams/${examId}/student-answers`);
  },
};

export default ExamService;
