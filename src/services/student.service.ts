
import api from '../api/config';

export interface StudentCourse {
  student_course_id: string;
  student_id: string;
  course_id: string;
  enrolled_at?: string;
  course: {
    course_id: string;
    course_name: string;
    course_code: string;
    description?: string;
    student_count?: number;
    exam_count?: number;
    doctors?: {
      id: string;
      name: string;
    }[];
  };
}

export interface StudentExamAnswer {
  student_exam_answer_id: string;
  student_id: string;
  exam_question_id: string;
  written_answer: string;
}

export interface Grade {
  grade_id: string;
  student_id: string;
  exam_id: string;
  grade: number;
  created_at?: string;
  exam: {
    exam_name: string;
    course: {
      course_name: string;
      course_code: string;
    };
  };
}

const StudentService = {
  async getStudentCourses(studentId?: string): Promise<{ data: StudentCourse[] }> {
    const url = studentId ? `/students/${studentId}/courses` : '/courses';
    const response = await api.get(url);
    return response.data;
  },

  async enrollInCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    const response = await api.post(`/students/${studentId}/courses`, { course_id: courseId });
    return response.data;
  },

  async unenrollFromCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/students/${studentId}/courses/${courseId}`);
    return response.data;
  },

  async getGrades(studentId: string): Promise<{ data: Grade[] }> {
    const response = await api.get(`/students/${studentId}/grades`);
    return response.data;
  },

  async submitExamAnswer(examQuestionId: string, answer: string): Promise<{ message: string }> {
    const response = await api.post('/student-exam-answers', {
      exam_question_id: examQuestionId,
      written_answer: answer,
    });
    return response.data;
  },

  async getExamAnswers(studentId: string, examId: string): Promise<{ data: StudentExamAnswer[] }> {
    const response = await api.get(`/students/${studentId}/exams/${examId}/answers`);
    return response.data;
  },

  // Get all students (admin/doctor access)
  async getAllStudents(): Promise<{ data: any[] }> {
    const response = await api.get('/admin/students');
    return response.data;
  },

  // Create student (admin only)
  async createStudent(studentData: any): Promise<{ data: any }> {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },

  // Update student (admin only)
  async updateStudent(studentId: string, studentData: any): Promise<{ data: any }> {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  },

  // Delete student (admin only)
  async deleteStudent(studentId: string): Promise<{ message: string }> {
    const response = await api.delete(`/admin/students/${studentId}`);
    return response.data;
  },

  // Get student dashboard stats
  async getStudentStats(studentId?: string): Promise<{ data: any }> {
    const url = studentId ? `/students/${studentId}/stats` : '/student/stats';
    const response = await api.get(url);
    return response.data;
  }
};

export default StudentService;
