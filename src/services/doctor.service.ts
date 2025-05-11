
import API from "./api.service";

// Types for questions and exams management
export interface Question {
  id: string;
  text: string;
  type: "mcq" | "written";
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
  created_by: string;
  evaluation_criteria?: string;
}

export interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
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
  course?: {
    name: string;
    code: string;
  };
  needs_grading?: boolean;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  weight: number;
  question?: Question;
}

const DoctorService = {
  // Questions related methods
  getQuestions(doctorId: string) {
    return API.get(`/doctor/questions?doctor_id=${doctorId}`);
  },
  
  createQuestion(questionData: Partial<Question>) {
    return API.post('/doctor/questions', questionData);
  },
  
  updateQuestion(questionId: string, questionData: Partial<Question>) {
    return API.put(`/doctor/questions/${questionId}`, questionData);
  },
  
  deleteQuestion(questionId: string) {
    return API.delete(`/doctor/questions/${questionId}`);
  },
  
  // Choices related methods
  getQuestionChoices(questionId: string) {
    return API.get(`/doctor/questions/${questionId}/choices`);
  },
  
  createChoice(questionId: string, choiceData: Partial<Choice>) {
    return API.post(`/doctor/questions/${questionId}/choices`, choiceData);
  },
  
  updateChoice(choiceId: string, choiceData: Partial<Choice>) {
    return API.put(`/doctor/choices/${choiceId}`, choiceData);
  },
  
  deleteChoice(choiceId: string) {
    return API.delete(`/doctor/choices/${choiceId}`);
  },
  
  // Exams related methods
  getExams(doctorId: string) {
    return API.get(`/doctor/exams?doctor_id=${doctorId}`);
  },
  
  createExam(examData: Partial<Exam>) {
    return API.post('/doctor/exams', examData);
  },
  
  updateExam(examId: string, examData: Partial<Exam>) {
    return API.put(`/doctor/exams/${examId}`, examData);
  },
  
  deleteExam(examId: string) {
    return API.delete(`/doctor/exams/${examId}`);
  },
  
  // Exam questions related methods
  getExamQuestions(examId: string) {
    return API.get(`/doctor/exams/${examId}/questions`);
  },
  
  addQuestionToExam(examId: string, questionId: string, weight: number = 1) {
    return API.post(`/doctor/exams/${examId}/questions`, { 
      question_id: questionId,
      weight
    });
  },
  
  removeQuestionFromExam(examQuestionId: string) {
    return API.delete(`/doctor/exam-questions/${examQuestionId}`);
  },
  
  // Course related methods
  getCourses(doctorId: string) {
    return API.get(`/doctor/courses?doctor_id=${doctorId}`);
  }
};

export default DoctorService;
