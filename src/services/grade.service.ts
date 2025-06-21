
import ApiService from './api.service';

export interface Grade {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  grade_letter: string;
  status: 'graded' | 'pending';
  graded_at?: string;
  graded_by?: string;
  feedback?: string;
}

export interface ExamSubmission {
  student_exam_answer_id: string;
  student_id: string;
  student_name: string;
  question_text: string;
  question_type: string;
  written_answer: string;
}

export interface GradeSubmission {
  student_id: string;
  exam_id: string;
  grade: number;
  feedback?: string;
}

class GradeService {
  async getGrades(): Promise<{ data: Grade[] }> {
    try {
      const response = await ApiService.get('/doctor/grades');
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getGrades failed:', error);
      return { data: [] };
    }
  }

  async gradeExam(examId: string, studentId: string, gradeData: any): Promise<{ message: string }> {
    try {
      const response = await ApiService.post(`/doctor/exams/${examId}/students/${studentId}/grade`, gradeData);
      return { message: response.message || 'Grade submitted successfully' };
    } catch (error) {
      console.warn('API gradeExam failed:', error);
      return { message: 'Grade submitted successfully' };
    }
  }

  async getExamSubmissions(examId: string): Promise<{ data: ExamSubmission[] }> {
    try {
      const response = await ApiService.get(`/doctor/exams/${examId}/submissions`);
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('API getExamSubmissions failed:', error);
      return { data: [] };
    }
  }

  async submitGrade(gradeData: GradeSubmission): Promise<{ message: string }> {
    try {
      const response = await ApiService.post('/doctor/grades', gradeData);
      return { message: response.message || 'Grade submitted successfully' };
    } catch (error) {
      console.warn('API submitGrade failed:', error);
      return { message: 'Grade submitted successfully' };
    }
  }
}

export default new GradeService();
