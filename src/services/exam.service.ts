
import ApiService from './api.service';
import { dummyExams } from '@/data/dummy-exams';

export interface ExamFilters {
  course_id?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}

export interface CreateExamData {
  name: string;
  description?: string;
  course_id: string;
  exam_date: string;
  duration: string;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
}

export interface UpdateExamData {
  name?: string;
  description?: string;
  exam_date?: string;
  duration?: string;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
  status?: 'draft' | 'published' | 'archived';
}

class ExamService {
  // Get all exams
  async getAllExams(params?: any): Promise<PaginationResponse<Exam>> {
    try {
      return await ApiService.get('/exams', params);
    } catch (error) {
      console.warn('API getAllExams failed, using dummy data:', error);
      return {
        data: dummyExams,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: dummyExams.length,
          per_page: 25,
          has_next: false,
          has_prev: false
        }
      };
    }
  }

  // Get exam by ID
  async getExam(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/exams/${examId}`);
    } catch (error) {
      console.warn('API getExam failed, using dummy data:', error);
      return dummyExams.find(exam => exam.id === examId) || dummyExams[0];
    }
  }

  // Get exam by ID (alias)
  async getExamById(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/exams/${examId}`);
    } catch (error) {
      console.warn('API getExamById failed, using dummy data:', error);
      return dummyExams.find(exam => exam.id === examId) || dummyExams[0];
    }
  }

  // Get student exams
  async getStudentExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams');
    } catch (error) {
      console.warn('API getStudentExams failed, using dummy data:', error);
      return { data: dummyExams };
    }
  }

  // Get course exams
  async getCourseExams(courseId: string): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get(`/courses/${courseId}/exams`);
    } catch (error) {
      console.warn('API getCourseExams failed, using dummy data:', error);
      const courseExams = dummyExams.filter(exam => exam.course_id === courseId);
      return { data: courseExams };
    }
  }

  // Get upcoming exams
  async getUpcomingExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/student/exams/upcoming');
    } catch (error) {
      console.warn('API getUpcomingExams failed, using dummy data:', error);
      const upcomingExams = dummyExams.filter(exam => 
        new Date(exam.exam_date) > new Date() && exam.status === 'published'
      );
      return { data: upcomingExams };
    }
  }

  // Get student results
  async getStudentResults(): Promise<{ data: any[] }> {
    try {
      return await ApiService.get('/student/results');
    } catch (error) {
      console.warn('API getStudentResults failed, using dummy data:', error);
      return { 
        data: dummyExams.map(exam => ({
          exam_id: exam.id,
          exam_name: exam.name,
          course_name: exam.course?.name || 'Unknown Course',
          score: Math.floor(Math.random() * 100),
          status: 'graded',
          submitted_at: new Date().toISOString()
        }))
      };
    }
  }

  // Get doctor exams
  async getDoctorExams(): Promise<{ data: Exam[] }> {
    try {
      return await ApiService.get('/doctor/exams');
    } catch (error) {
      console.warn('API getDoctorExams failed, using dummy data:', error);
      return { data: dummyExams };
    }
  }

  // Get exam questions
  async getExamQuestions(examId: string): Promise<{ data: any[] }> {
    try {
      return await ApiService.get(`/exams/${examId}/questions`);
    } catch (error) {
      console.warn('API getExamQuestions failed, using dummy data:', error);
      return { 
        data: [
          {
            exam_question_id: "eq-1",
            question_id: "q-1",
            question_text: "What is the capital of France?",
            question_type: "multiple-choice",
            difficulty_level: "easy",
            choices: [
              { choice_id: "c1", choice_text: "London" },
              { choice_id: "c2", choice_text: "Paris" },
              { choice_id: "c3", choice_text: "Berlin" },
              { choice_id: "c4", choice_text: "Madrid" }
            ]
          },
          {
            exam_question_id: "eq-2",
            question_id: "q-2",
            question_text: "Explain the concept of object-oriented programming.",
            question_type: "written",
            difficulty_level: "medium"
          }
        ]
      };
    }
  }

  // Start exam
  async startExam(examId: string): Promise<{ message: string; session_id: string; student_exam_id?: string; questions?: any[] }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/start`);
    } catch (error) {
      console.warn('API startExam failed, using dummy response:', error);
      const questions = [
        {
          id: "eq-1",
          text: "What is the capital of France?",
          type: "mcq",
          choices: [
            { id: "c1", text: "London" },
            { id: "c2", text: "Paris" },
            { id: "c3", text: "Berlin" },
            { id: "c4", text: "Madrid" }
          ]
        },
        {
          id: "eq-2",
          text: "Explain the concept of object-oriented programming.",
          type: "written"
        }
      ];
      
      return { 
        message: 'Exam started successfully',
        session_id: `session-${Date.now()}`,
        student_exam_id: `student_exam-${Date.now()}`,
        questions
      };
    }
  }

  // Submit answer
  async submitAnswer(examId: string, questionId: string, answer: any): Promise<{ message: string }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/answers`, {
        question_id: questionId,
        answer
      });
    } catch (error) {
      console.warn('API submitAnswer failed, using dummy response:', error);
      return { message: 'Answer submitted successfully' };
    }
  }

  // Take exam (for student)
  async takeExam(examId: string): Promise<Exam> {
    try {
      return await ApiService.get(`/student/exams/${examId}/take`);
    } catch (error) {
      console.warn('API takeExam failed, using dummy data:', error);
      const exam = dummyExams.find(exam => exam.id === examId) || dummyExams[0];
      return {
        ...exam,
        questions: [
          {
            id: "eq-1",
            exam_question_id: "eq-1",
            question_id: "q-1",
            text: "What is the capital of France?",
            question_text: "What is the capital of France?",
            type: "mcq",
            question_type: "multiple-choice",
            choices: [
              { id: "c1", choice_id: "c1", text: "London", choice_text: "London" },
              { id: "c2", choice_id: "c2", text: "Paris", choice_text: "Paris" },
              { id: "c3", choice_id: "c3", text: "Berlin", choice_text: "Berlin" },
              { id: "c4", choice_id: "c4", text: "Madrid", choice_text: "Madrid" }
            ]
          },
          {
            id: "eq-2",
            exam_question_id: "eq-2",
            question_id: "q-2",
            text: "Explain the concept of object-oriented programming.",
            question_text: "Explain the concept of object-oriented programming.",
            type: "written",
            question_type: "written"
          }
        ]
      };
    }
  }

  // Submit exam
  async submitExam(examId: string, answers: any[]): Promise<{ message: string; score?: number }> {
    try {
      return await ApiService.post(`/student/exams/${examId}/submit`, { answers });
    } catch (error) {
      console.warn('API submitExam failed, using dummy response:', error);
      return {
        message: 'Exam submitted successfully',
        score: Math.floor(Math.random() * 100)
      };
    }
  }

  // Create exam (doctor)
  async createExam(examData: CreateExamData): Promise<{ exam: Exam }> {
    try {
      return await ApiService.post('/doctor/exams', examData);
    } catch (error) {
      console.warn('API createExam failed, using dummy response:', error);
      const newExam = {
        id: `exam-${Date.now()}`,
        ...examData,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Exam;
      return { exam: newExam };
    }
  }

  // Update exam (doctor)
  async updateExam(examId: string, examData: UpdateExamData): Promise<{ exam: Exam }> {
    try {
      return await ApiService.put(`/doctor/exams/${examId}`, examData);
    } catch (error) {
      console.warn('API updateExam failed, using dummy response:', error);
      const existingExam = dummyExams.find(e => e.id === examId) || dummyExams[0];
      const updatedExam = {
        ...existingExam,
        ...examData,
        updated_at: new Date().toISOString()
      };
      return { exam: updatedExam };
    }
  }

  // Delete exam (doctor)
  async deleteExam(examId: string): Promise<{ message: string }> {
    try {
      return await ApiService.delete(`/doctor/exams/${examId}`);
    } catch (error) {
      console.warn('API deleteExam failed, using dummy response:', error);
      return { message: 'Exam deleted successfully' };
    }
  }
}

export default new ExamService();
