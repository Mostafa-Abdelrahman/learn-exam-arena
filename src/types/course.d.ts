declare interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id?: string;
  status: 'active' | 'inactive';
  academic_year: string;
  student_count?: number;
  created_at: string;
  updated_at?: string;
}

declare interface StudentCourse {
  student_course_id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'completed' | 'dropped';
  course: {
    course_id: string;
    course_name: string;
    course_code: string;
    description?: string;
    student_count?: number;
    exam_count?: number;
    doctor?: {
      id: string;
      name: string;
      email: string;
    };
  };
}
