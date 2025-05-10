
import { supabase } from "@/integrations/supabase/client";

const QuestionService = {
  // Get all questions
  async getAllQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get a specific question by ID
  async getQuestion(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, choices(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new question
  async createQuestion(questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a question
  async updateQuestion(id: string, questionData: Partial<Question>) {
    // Ensure created_by is not undefined if it's required
    if (!questionData.created_by && !questionData.id) {
      console.error("created_by is required when updating a question");
      throw new Error("created_by is required");
    }
    
    const { data, error } = await supabase
      .from('questions')
      .update(questionData as any) // Type assertion to bypass TypeScript error
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a question
  async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Create choices for a question
  async createChoices(questionId: string, choices: Omit<Choice, 'id' | 'created_at' | 'updated_at'>[]) {
    const choicesWithQuestionId = choices.map(choice => ({
      ...choice,
      question_id: questionId
    }));
    
    const { data, error } = await supabase
      .from('choices')
      .insert(choicesWithQuestionId)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Get choices for a question
  async getChoicesForQuestion(questionId: string) {
    const { data, error } = await supabase
      .from('choices')
      .select('*')
      .eq('question_id', questionId);
    
    if (error) throw error;
    return data;
  }
};

export default QuestionService;
