
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
  course_id?: string; // For backward compatibility
  name: string;
  course_name?: string; // For backward compatibility
  code: string;
  course_code?: string; // For backward compatibility
  description: string;
  doctors: {
    id: string;
    name: string;
  }[];
  exam_count: number;
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
    doctors: courseData.doctors || [],
    exam_count: courseData.exam_count || 0,
    updated_at: courseData.updated_at
  };
};
