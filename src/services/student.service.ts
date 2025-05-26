
import api from '../api/config';

export interface StudentCourse {
  student_course_id: string;
  student_id: string;
  course_id: string;
  course: {
    course_id: string;
    course_name: string;
    course_code: string;
    description?: string;
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
  exam: {
    exam_name: string;
    course: {
      course_name: string;
      course_code: string;
    };
  };
}

const StudentService = {
  async getStudentCourses(studentId: string): Promise<{ data: StudentCourse[] }> {
    const response = await api.get(`/students/${studentId}/courses`);
    return response.data;
  },

  async enrollInCourse(studentId: string, courseId: string): Promise<{ message: string }> {
    const response = await api.post(`/students/${studentId}/courses`, { course_id: courseId });
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
};

export default StudentService;
