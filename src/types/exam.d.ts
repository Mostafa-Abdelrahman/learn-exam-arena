
declare interface Exam {
  id: string;
  name: string;
  course_id: string;
  exam_date: string;
  duration: string;
  instructions?: string;
  status: "draft" | "published" | "archived";
  created_by: string;
  created_at?: string;
  updated_at?: string;
  course?: {
    name: string;
    code: string;
  };
}

declare interface ExamQuestion {
  id?: string;
  exam_id: string;
  question_id: string;
  weight: number;
  question?: Question;
}
