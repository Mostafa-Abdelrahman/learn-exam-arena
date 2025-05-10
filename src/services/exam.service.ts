
import API from "./api.service";
import { supabase } from "@/integrations/supabase/client";

const ExamService = {
  // Get all exams
  getAllExams() {
    return API.get("/exams");
  },

  // Get a specific exam
  getExam(id: number) {
    return API.get(`/exams/${id}`);
  },

  // Get exams for a specific course
  getCourseExams(courseId: number) {
    return API.get(`/courses/${courseId}/exams`);
  },

  // Get exams created by a specific doctor
  getDoctorExams(doctorId: number) {
    return API.get(`/doctors/${doctorId}/exams`);
  },

  // Get exams available for a specific student
  getStudentExams(studentId: number) {
    return API.get(`/students/${studentId}/exams`);
  },

  // Create a new exam (doctor only)
  createExam(examData: any) {
    return API.post("/exams", examData);
  },

  // Update an exam (doctor only)
  updateExam(id: number, examData: any) {
    return API.put(`/exams/${id}`, examData);
  },

  // Delete an exam (doctor only)
  deleteExam(id: number) {
    return API.delete(`/exams/${id}`);
  },

  // Publish an exam (doctor only)
  publishExam(id: number) {
    return API.patch(`/exams/${id}/publish`);
  },

  // Add questions to an exam (doctor only)
  addQuestionsToExam(examId: number, questionsData: any) {
    return API.post(`/exams/${examId}/questions`, questionsData);
  },

  // Remove a question from an exam (doctor only)
  removeQuestionFromExam(examQuestionId: number) {
    return API.delete(`/exam-questions/${examQuestionId}`);
  },

  // Get exam questions
  getExamQuestions(examId: number) {
    return API.get(`/exams/${examId}/questions`);
  },

  // Submit student exam answers
  submitExamAnswers(examId: number, studentId: number, answersData: any) {
    return API.post(`/exams/${examId}/submit`, { 
      student_id: studentId,
      answers: answersData 
    });
  },

  // Submit exam with Supabase
  async submitExamWithSupabase(examId: string, studentId: string, answers: any[]) {
    try {
      // Check if an attempt already exists for this exam and student
      // We need to use any type here to avoid TypeScript errors until Supabase types are updated
      const { data: existingAttempt, error: checkError } = await supabase
        .from('student_exams')
        .select('id')
        .eq('student_id', studentId)
        .eq('exam_id', examId)
        .maybeSingle() as any;

      if (checkError) throw checkError;

      let studentExamId;

      if (existingAttempt) {
        // Update the existing attempt
        studentExamId = existingAttempt.id;
        
        // We need to use any type here to avoid TypeScript errors until Supabase types are updated
        const { error: updateError } = await supabase
          .from('student_exams')
          .update({
            end_time: new Date().toISOString(),
            completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', studentExamId) as any;

        if (updateError) throw updateError;
      } else {
        // Create a new exam attempt
        // We need to use any type here to avoid TypeScript errors until Supabase types are updated
        const { data: newAttempt, error: createError } = await supabase
          .from('student_exams')
          .insert({
            student_id: studentId,
            exam_id: examId,
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString(),
            completed: true
          })
          .select('id')
          .single() as any;

        if (createError) throw createError;
        studentExamId = newAttempt.id;
      }

      // Submit all answers
      const formattedAnswers = answers.map(answer => ({
        student_exam_id: studentExamId,
        exam_question_id: answer.exam_question_id,
        answer: answer.answer
      }));

      // We need to use any type here to avoid TypeScript errors until Supabase types are updated
      const { error: answersError } = await supabase
        .from('student_exam_answers')
        .insert(formattedAnswers) as any;

      if (answersError) throw answersError;

      return { success: true, studentExamId };
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  },

  // Get student exam results
  getStudentExamResults(studentId: number, examId: number) {
    return API.get(`/students/${studentId}/exams/${examId}/results`);
  },

  // Grade a written answer (doctor only)
  gradeWrittenAnswer(studentExamAnswerId: number, gradeData: any) {
    return API.patch(`/student-exam-answers/${studentExamAnswerId}/grade`, gradeData);
  },

  // Get all student answers for an exam (doctor only)
  getExamStudentAnswers(examId: number) {
    return API.get(`/exams/${examId}/student-answers`);
  },
};

export default ExamService;
