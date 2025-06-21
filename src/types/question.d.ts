export interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "programming" | "essay";
  difficulty?: "easy" | "medium" | "hard";
  chapter?: string;
  evaluation_criteria?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  choices?: Choice[];
}

declare interface Choice {
  id: string;
  choice_id?: string; // For backward compatibility
  question_id: string;
  text: string;
  choice_text?: string; // For backward compatibility
  is_correct: boolean;
  created_at?: string;
  updated_at?: string;
}

declare interface McqChoice {
  id?: string;
  text: string;
  is_correct: boolean;
}
