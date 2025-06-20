// Define the interface for student courses
export interface StudentCourse {
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

// Define the interface for courses displayed in student pages
export interface Course {
  id: string;
  course_id?: string; // For backward compatibility
  name: string;
  course_name?: string; // For backward compatibility
  code: string;
  course_code?: string; // For backward compatibility
  description: string;
  credits: number;
  semester: string;
  major_id: string;
  doctor_id?: string;
  status: 'active' | 'inactive';
  academic_year: string;
  doctors: {
    id: string;
    name: string;
  }[];
  exam_count: number;
  student_count?: number;
  doctor_count?: number;
  created_at: string;
  updated_at?: string;
}

// Ensure data mapping between API responses and our interface
export const mapCourseData = (courseData: any): Course => {
  return {
    id: courseData.id || courseData.course_id,
    course_id: courseData.id || courseData.course_id,
    name: courseData.name || courseData.course_name,
    course_name: courseData.name || courseData.course_name,
    code: courseData.code || courseData.course_code,
    course_code: courseData.code || courseData.course_code,
    description: courseData.description || "",
    credits: courseData.credits || 0,
    semester: courseData.semester || "",
    major_id: courseData.major_id || "",
    doctor_id: courseData.doctor_id,
    status: courseData.status || "active",
    academic_year: courseData.academic_year || "",
    doctors: courseData.doctors || [],
    exam_count: courseData.exam_count || 0,
    student_count: courseData.student_count || 0,
    doctor_count: courseData.doctor_count || 0,
    created_at: courseData.created_at,
    updated_at: courseData.updated_at
  };
};
