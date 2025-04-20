
import API from "./api.service";

const QuestionService = {
  // Get all questions
  getAllQuestions() {
    return API.get("/questions");
  },

  // Get a specific question
  getQuestion(id: number) {
    return API.get(`/questions/${id}`);
  },

  // Get questions created by a specific doctor
  getDoctorQuestions(doctorId: number) {
    return API.get(`/doctors/${doctorId}/questions`);
  },

  // Get questions by type
  getQuestionsByType(typeId: number) {
    return API.get(`/question-types/${typeId}/questions`);
  },

  // Create a new question (doctor only)
  createQuestion(questionData: any) {
    return API.post("/questions", questionData);
  },

  // Update a question (doctor only)
  updateQuestion(id: number, questionData: any) {
    return API.put(`/questions/${id}`, questionData);
  },

  // Delete a question (doctor only)
  deleteQuestion(id: number) {
    return API.delete(`/questions/${id}`);
  },

  // Get question types
  getQuestionTypes() {
    return API.get("/question-types");
  },

  // Add choices to a multiple choice question (doctor only)
  addChoicesToQuestion(questionId: number, choicesData: any) {
    return API.post(`/questions/${questionId}/choices`, choicesData);
  },

  // Update a choice (doctor only)
  updateChoice(choiceId: number, choiceData: any) {
    return API.put(`/choices/${choiceId}`, choiceData);
  },

  // Delete a choice (doctor only)
  deleteChoice(choiceId: number) {
    return API.delete(`/choices/${choiceId}`);
  },

  // Add evaluation criteria to a written question (doctor only)
  addEvaluationCriteria(questionId: number, criteriaData: any) {
    return API.post(`/questions/${questionId}/evaluation-criteria`, criteriaData);
  },
};

export default QuestionService;
