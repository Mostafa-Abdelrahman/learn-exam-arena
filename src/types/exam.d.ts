declare interface Exam {
  id: string;
  name: string;
  exam_name?: string; // For backward compatibility
  course_id: string;
  exam_date: string;
  duration: string;
  exam_duration?: string; // For backward compatibility
  instructions?: string;
  status: "draft" | "published" | "archived";
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  needs_grading?: boolean;
  total_marks?: number;
  course?: {
    id?: string;
    name: string;
    course_name?: string;
    code: string;
    course_code?: string;
  };
  course_name?: string;
  course_code?: string;
  questions?: ExamQuestion[];
  submission_count?: number;
}

declare interface ExamQuestion {
  id?: string;
  exam_question_id?: string;
  exam_id?: string;
  question_id: string;
  text?: string;
  question_text?: string;
  type?: "multiple_choice" | "true_false" | "short_answer" | "programming" | "essay";
  question_type?: string;
  weight?: number;
  difficulty_level?: string;
  question?: Question;
  choices?: {
    id: string;
    choice_id?: string;
    text: string;
    choice_text?: string;
    is_correct?: boolean;
  }[];
}

declare interface StudentAnswer {
  questionId: string;
  answer: string;
}
