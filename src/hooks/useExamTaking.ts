
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ExamService from "@/services/exam.service";

interface ExamQuestion {
  id: string;
  text: string;
  type: "mcq" | "written" | "multiple-choice";
  choices?: {
    id: string;
    text: string;
  }[];
}

interface StudentAnswer {
  questionId: string;
  answer: string;
}

export const useExamTaking = (examId: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [studentExamId, setStudentExamId] = useState<string>("");

  useEffect(() => {
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await ExamService.getExamById(examId);
      
      if (response) {
        setExam(response);
        
        const transformedQuestions: ExamQuestion[] = (response.questions || []).map((q: any) => ({
          id: q.id || q.exam_question_id,
          text: q.text || q.question_text,
          type: q.type === 'multiple-choice' ? 'mcq' : q.type,
          choices: q.choices?.map((c: any) => ({
            id: c.id || c.choice_id,
            text: c.text || c.choice_text
          }))
        }));
        
        setQuestions(transformedQuestions);
        setTimeRemaining(parseInt(response.duration) * 60);
      }
    } catch (error: any) {
      console.error("Error fetching exam:", error);
      toast({
        title: "Error loading exam",
        description: error.message || "Could not load exam details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    try {
      const response = await ExamService.startExam(examId);
      
      if (response) {
        setStudentExamId(response.student_exam_id || response.session_id);
        setExamStarted(true);
        
        if (response.questions) {
          const transformedQuestions: ExamQuestion[] = response.questions.map((q: any) => ({
            id: q.id || q.exam_question_id,
            text: q.text || q.question_text,
            type: q.type === 'multiple-choice' ? 'mcq' : q.type,
            choices: q.choices?.map((c: any) => ({
              id: c.id || c.choice_id,
              text: c.text || c.choice_text
            }))
          }));
          setQuestions(transformedQuestions);
        }
        
        toast({
          title: "Exam started",
          description: "Good luck! Timer has begun.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error starting exam",
        description: error.message || "Could not start the exam.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId ? { ...a, answer } : a
        );
      }
      return [...prev, { questionId, answer }];
    });

    if (examId && studentExamId) {
      ExamService.submitAnswer(examId, questionId, answer).catch(error => {
        console.error("Error saving answer:", error);
      });
    }
  };

  const handleSubmitExam = async () => {
    try {
      setSubmitting(true);
      await ExamService.submitExam(examId, answers);
      
      toast({
        title: "Exam submitted successfully",
        description: "Your answers have been saved. Results will be available soon.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error submitting exam",
        description: error.message || "Could not submit your exam.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    exam,
    questions,
    answers,
    currentQuestionIndex,
    timeRemaining,
    examStarted,
    setCurrentQuestionIndex,
    handleStartExam,
    handleAnswerChange,
    handleSubmitExam,
  };
};
