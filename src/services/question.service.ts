
import api from '../api/config';

const QuestionService = {
  // Get all questions
  async getAllQuestions() {
    const response = await api.get('/questions');
    return response.data;
  },
  
  // Get a specific question by ID
  async getQuestion(id: string) {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  
  // Create a new question
  async createQuestion(questionData: Omit<Question, 'id'>) {
    const response = await api.post('/questions', questionData);
    return response.data;
  },
  
  // Update a question
  async updateQuestion(id: string, questionData: Partial<Question>) {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },
  
  // Delete a question
  async deleteQuestion(id: string) {
    await api.delete(`/questions/${id}`);
    return true;
  },
  
  // Create choices for a question
  async createChoices(questionId: string, choices: Omit<Choice, 'id'>[]) {
    // The Laravel route for choices may differ, adjust as needed
    const choicesWithQuestionId = choices.map(choice => ({
      ...choice,
      question_id: questionId
    }));
    
    const response = await api.post(`/questions/${questionId}/choices`, { choices: choicesWithQuestionId });
    return response.data;
  },
  
  // Get choices for a question
  async getChoicesForQuestion(questionId: string) {
    // Adapt this to the appropriate Laravel endpoint
    const response = await api.get(`/questions/${questionId}/choices`);
    return response.data;
  }
};

export default QuestionService;
