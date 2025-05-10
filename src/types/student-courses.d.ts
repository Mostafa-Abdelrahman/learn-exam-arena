
// Define the interface for student courses
declare interface StudentCourse {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the interface for courses displayed in student pages
declare interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  doctors: {
    id: string;
    name: string;
  }[];
  exam_count: number;
  created_at?: string;
  updated_at?: string;
}
