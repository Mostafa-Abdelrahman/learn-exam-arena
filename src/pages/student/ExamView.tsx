import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import ExamService from "@/services/exam.service";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ExamView = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("--:--:--");
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  
  // Fetch exam details
  const { data: exam, isLoading: isLoadingExam } = useQuery({
    queryKey: ["exam-details", examId],
    queryFn: async () => {
      try {
        const response = await ExamService.getExam(examId || "");
        return response;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exam details",
          variant: "destructive",
        });
        return null;
      }
    },
  });
  
  // Fetch exam questions
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["exam-questions", examId],
    queryFn: async () => {
      try {
        const response = await ExamService.getExamQuestions(examId || "");
        
        // Initialize answers object with empty values for each question
        const initialAnswers = {};
        response.data.forEach((question) => {
          initialAnswers[question.exam_question_id] = {
            question_id: question.question_id,
            question_type: question.question_type,
            answer: question.question_type === 'multiple-choice' ? null : '',
            exam_question_id: question.exam_question_id,
          };
        });
        setAnswers(initialAnswers);
        
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exam questions",
          variant: "destructive",
        });
        return [];
      }
    },
  });
  
  const isLoading = isLoadingExam || isLoadingQuestions;
  
  // Update time remaining
  useEffect(() => {
    if (exam && !examFinished) {
      const examDate = new Date(exam.exam_date);
      const examDurationHours = parseInt(exam.exam_duration);
      const examEndTime = new Date(examDate.getTime() + examDurationHours * 60 * 60 * 1000);
      
      const timer = setInterval(() => {
        const now = new Date();
        const diff = examEndTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          clearInterval(timer);
          setTimeRemaining("00:00:00");
          handleSubmitExam();
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [exam, examFinished]);
  
  // Handle answer change
  const handleAnswerChange = (questionId, newValue) => {
    setAnswers({
      ...answers,
      [questionId]: {
        ...answers[questionId],
        answer: newValue,
      },
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Submit exam
  const handleSubmitExam = async () => {
    if (isSubmitting || !currentUser || !examId) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the answers for submission - convert to StudentAnswer format
      const formattedAnswers: StudentAnswer[] = Object.keys(answers).map((key) => ({
        questionId: answers[key].question_id,
        answer: answers[key].answer || '',
      }));
      
      // Submit using the ExamService
      await ExamService.submitExam(examId, formattedAnswers);
      
      setExamFinished(true);
      
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit your exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // When exam is finished, show completion screen
  if (examFinished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Exam Completed</CardTitle>
            <CardDescription>
              Your answers have been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <h3 className="font-semibold text-lg">{exam?.name}</h3>
            <p className="text-muted-foreground">
              Thank you for completing this exam. Your results will be available after grading.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/student/exams")}>
              View All Exams
            </Button>
            <Button onClick={() => navigate("/student/dashboard")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading || !questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-8 w-24" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Check if it's a multiple choice question
  const isMultipleChoice = currentQuestion?.question_type === 'multiple-choice';
  
  // Calculate progress
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  
  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      {/* Exam header */}
      <div className="fixed top-0 left-0 right-0 z-10 border-b bg-background p-4 shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate("/student/exams")}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{exam?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {exam?.course?.name || exam?.course_name} ({exam?.course?.code || exam?.course_code})
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm bg-muted px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 mr-1" />
              <span
                className={timeRemaining.startsWith("00:") ? "text-destructive font-semibold" : ""}
              >
                {timeRemaining}
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="container mx-auto mt-2">
          <Progress value={progress} className="h-1" />
        </div>
      </div>
      
      <div className="container mx-auto mt-24">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <CardDescription className="flex items-center">
              <span className="capitalize">{currentQuestion.question_type} Question</span>
              {currentQuestion.difficulty_level && (
                <>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{currentQuestion.difficulty_level} difficulty</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Question text */}
            <div className="text-lg font-medium">
              {currentQuestion.question_text}
            </div>
            
            {/* Answers */}
            <div className="pt-4">
              {isMultipleChoice ? (
                <RadioGroup
                  value={answers[currentQuestion.exam_question_id]?.answer || ""}
                  onValueChange={(value) => 
                    handleAnswerChange(currentQuestion.exam_question_id, value)
                  }
                  className="space-y-3"
                >
                  {currentQuestion.choices?.map((choice) => (
                    <div key={choice.choice_id} className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value={choice.choice_id.toString()} 
                        id={`choice-${choice.choice_id}`} 
                      />
                      <Label 
                        htmlFor={`choice-${choice.choice_id}`}
                        className="text-base leading-normal"
                      >
                        {choice.choice_text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="written-answer">Your Answer:</Label>
                  <Textarea
                    id="written-answer"
                    placeholder="Type your answer here..."
                    rows={6}
                    value={answers[currentQuestion.exam_question_id]?.answer || ""}
                    onChange={(e) => 
                      handleAnswerChange(currentQuestion.exam_question_id, e.target.value)
                    }
                    className="resize-none"
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>Next</Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Finish Exam</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Exam</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit your exam? You won't be able to make changes after submission.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSubmitExam}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Exam"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardFooter>
        </Card>
        
        {/* Question navigation */}
        <div className="w-full max-w-4xl mx-auto mt-6 mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : 
                       answers[questions[index].exam_question_id]?.answer ? "outline" : "ghost"}
                size="sm"
                className={`w-10 h-10 p-0 ${
                  answers[questions[index].exam_question_id]?.answer ? 
                  "border-primary text-primary" : ""
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamView;
