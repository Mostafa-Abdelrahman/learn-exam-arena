
import ApiService from './api.service';

export interface StudentGrade {
  grade_id: string;
  student_id: string;
  exam: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
      code: string;
    };
  };
  score: number;
  created_at: string;
}

class StudentService {
  async getStudentCourses(studentId?: string): Promise<{ data: Course[] }> {
    const endpoint = studentId ? `/admin/students/${studentId}/courses` : '/student/courses';
    return await ApiService.get(endpoint);
  }

  async getStudentGrades(studentId: string): Promise<{ data: StudentGrade[] }> {
    return await ApiService.get(`/admin/students/${studentId}/grades`);
  }

  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.post(`/student/courses/${courseId}/enroll`);
  }

  async dropCourse(courseId: string): Promise<{ message: string }> {
    return await ApiService.post(`/student/courses/${courseId}/drop`);
  }
}

export default new StudentService();
