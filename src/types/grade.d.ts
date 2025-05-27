
declare interface Grade {
  id: string;
  student_id: string;
  exam_id: string;
  course_id?: string;
  score: number;
  max_score?: number;
  percentage?: number;
  grade_letter?: string;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  created_at?: string;
  updated_at?: string;
  student?: {
    id: string;
    name: string;
  };
  exam?: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    name: string;
    code: string;
  };
}

declare interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  max_score: number;
  percentage: number;
  status: "completed" | "pending" | "graded";
  started_at?: string;
  submitted_at?: string;
  graded_at?: string;
  exam: Exam;
  answers?: {
    id: string;
    question_id: string;
    answer: string;
    score?: number;
    max_score?: number;
    feedback?: string;
  }[];
}
