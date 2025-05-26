
import api from '../api/config';

export interface GradeSubmission {
  student_id: string;
  exam_id: string;
  grade: number;
}

export interface ExamSubmission {
  student_exam_answer_id: string;
  student_id: string;
  student_name: string;
  exam_question_id: string;
  written_answer: string;
  question_text: string;
  question_type: string;
}

const GradeService = {
  async getExamSubmissions(examId: string): Promise<{ data: ExamSubmission[] }> {
    const response = await api.get(`/exams/${examId}/submissions`);
    return response.data;
  },

  async submitGrade(gradeData: GradeSubmission): Promise<{ message: string }> {
    const response = await api.post('/grades', gradeData);
    return response.data;
  },

  async updateGrade(gradeId: string, grade: number): Promise<{ message: string }> {
    const response = await api.put(`/grades/${gradeId}`, { grade });
    return response.data;
  },

  async getStudentGrades(studentId: string): Promise<{ data: any[] }> {
    const response = await api.get(`/students/${studentId}/grades`);
    return response.data;
  },
};

export default GradeService;
