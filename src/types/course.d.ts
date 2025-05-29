
declare interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  doctor_id?: string;
  major_id?: string;
  student_count?: number;
  enrolled_students?: number;
  exam_count?: number;
  created_at?: string;
  updated_at?: string;
}

declare interface StudentCourse {
  student_course_id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  course: {
    course_id: string;
    course_name: string;
    course_code: string;
    description?: string;
    student_count?: number;
    exam_count?: number;
  };
}
