
import api from '../api/config';

export interface StudentStats {
  total_courses: number;
  total_exams: number;
  upcoming_exams: number;
  completed_exams: number;
  average_grade: number;
  total_credits: number;
  gpa: number;
  recent_activity: Array<{
    type: string;
    exam_name?: string;
    course_name?: string;
    date: string;
    grade?: number;
  }>;
}

export interface CourseEnrollment {
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
}

const StudentService = {
  // Student Stats
  async getStudentStats(): Promise<{ data: StudentStats }> {
    const response = await api.get('/student/stats');
    return response.data;
  },

  // Course Management
  async getStudentCourses(): Promise<{ data: Course[] }> {
    const response = await api.get('/courses');
    return response.data;
  },

  async enrollInCourse(studentId: string, courseId: string): Promise<{ message: string; enrollment: CourseEnrollment }> {
    const response = await api.post(`/students/${studentId}/courses`, {
      course_id: courseId
    });
    return response.data;
  },

  // Grades
  async getStudentGrades(studentId: string): Promise<{ data: Grade[] }> {
    const response = await api.get(`/students/${studentId}/grades`);
    return response.data;
  },

  // Profile
  async getProfile(): Promise<{ data: any }> {
    const response = await api.get('/user');
    return response.data;
  }
};

export default StudentService;
