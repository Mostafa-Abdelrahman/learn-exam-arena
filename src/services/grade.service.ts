
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

class GradeService {
  async getGrades(): Promise<{ data: Grade[] }> {
    return await ApiService.get('/doctor/grades');
  }

  async gradeExam(examId: string, studentId: string, gradeData: any): Promise<{ message: string }> {
    return await ApiService.post(`/doctor/exams/${examId}/students/${studentId}/grade`, gradeData);
  }
}

export default new GradeService();
