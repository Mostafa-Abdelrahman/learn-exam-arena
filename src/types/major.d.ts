
declare interface Major {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  student_count?: number;
  course_count?: number;
  courses?: Course[];
}
