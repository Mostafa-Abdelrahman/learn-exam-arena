
declare interface Course {
  id: string;
  course_id?: string; // For backward compatibility
  name: string;
  course_name?: string; // For backward compatibility
  code: string;
  course_code?: string; // For backward compatibility
  description?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  doctors?: {
    id: string;
    name: string;
  }[];
  students?: {
    id: string;
    name: string;
  }[];
  exam_count?: number;
  student_count?: number;
  doctor_count?: number;
  major_id?: string;
  major?: {
    id: string;
    name: string;
  };
}
