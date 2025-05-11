
// Define the interface for student courses
export interface StudentCourse {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at?: string;
  updated_at?: string;
}

// Define the interface for courses displayed in student pages
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  doctors: {
    id: string;
    name: string;
  }[];
  exam_count: number;
  updated_at?: string;
}
