
declare interface Question {
  id: string;
  text: string;
  type: "mcq" | "written";
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
  created_by: string;
  created_at?: string;
  updated_at?: string;
  evaluation_criteria?: string;
}

declare interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  created_at?: string;
  updated_at?: string;
}

declare interface McqChoice {
  id?: string;
  text: string;
  is_correct: boolean;
}
