
declare interface Question {
  id: string;
  text: string;
  question_text?: string; // For backward compatibility
  type: "mcq" | "written" | "multiple-choice";
  question_type?: string; // For backward compatibility
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
  difficulty_level?: string; // For backward compatibility
  created_by: string;
  created_at?: string;
  updated_at?: string;
  evaluation_criteria?: string;
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
