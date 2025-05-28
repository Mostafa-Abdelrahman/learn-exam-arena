import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import {
  Loader2,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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

const TakeExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
    if (examId && currentUser) {
      fetchExamDetails();
    }
  }, [examId, currentUser]);

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
    if (!examId) return;

    try {
      setLoading(true);
      const response = await ExamService.getExamById(examId);
      
      if (response && response.data) {
        setExam(response.data);
        
        // Transform the questions to match our local interface
        const transformedQuestions: ExamQuestion[] = (response.data.questions || []).map((q: any) => ({
          id: q.id || q.exam_question_id,
          text: q.text || q.question_text,
          type: q.type === 'multiple-choice' ? 'mcq' : q.type,
          choices: q.choices?.map((c: any) => ({
            id: c.id || c.choice_id,
            text: c.text || c.choice_text
          }))
        }));
        
        setQuestions(transformedQuestions);
        setTimeRemaining(parseInt(response.data.duration) * 60); // Convert minutes to seconds
      }
    } catch (error: any) {
      console.error("Error fetching exam:", error);
      toast({
        title: "Error loading exam",
        description: error.message || "Could not load exam details.",
        variant: "destructive",
      });
      navigate("/student/exams");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (!examId) return;

    try {
      const response = await ExamService.startExam(examId);
      
      if (response) {
        setStudentExamId(response.student_exam_id);
        setExamStarted(true);
        
        // Update questions if returned from start exam
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

    // Auto-save answer
    if (examId && studentExamId) {
      ExamService.submitAnswer(examId, questionId, answer).catch(error => {
        console.error("Error saving answer:", error);
      });
    }
  };

  const handleSubmitExam = async () => {
    if (!examId || !studentExamId) return;

    try {
      setSubmitting(true);
      
      await ExamService.submitExam(examId, answers);
      
      toast({
        title: "Exam submitted successfully",
        description: "Your answers have been saved. Results will be available soon.",
      });

      navigate("/student/results");
    } catch (error: any) {
      toast({
        title: "Error submitting exam",
        description: error.message || "Could not submit your exam.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id)?.answer || "";
  const answeredQuestions = answers.length;
  const totalQuestions = questions.length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-20">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Exam not found</h3>
        <p className="text-muted-foreground">The exam you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{exam.name}</span>
            </CardTitle>
            <CardDescription>
              {exam.course?.name} ({exam.course?.code})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {exam.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Questions: {questions.length}</span>
              </div>
            </div>

            {exam.instructions && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Instructions:</h4>
                <p className="text-sm text-muted-foreground">{exam.instructions}</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Important:</span>
              </div>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Once started, the timer cannot be paused</li>
                <li>• Your answers are auto-saved as you progress</li>
                <li>• You can navigate between questions freely</li>
                <li>• The exam will auto-submit when time runs out</li>
              </ul>
            </div>

            <Button onClick={handleStartExam} className="w-full" size="lg">
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with timer and progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{exam.name}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{answeredQuestions}/{totalQuestions} answered</span>
              </Badge>
              
              <Badge variant={timeRemaining < 300 ? "destructive" : "default"} className="space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === "mcq" && currentQuestion.choices ? (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.choices.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice.id} id={choice.id} />
                    <Label htmlFor={choice.id} className="flex-1">
                      {choice.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Enter your answer..."
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                rows={6}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 p-0 ${
                    answers.find(a => a.questionId === questions[index].id)
                      ? "bg-green-100 border-green-300"
                      : ""
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Submit Exam</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit your exam? You have answered {answeredQuestions} out of {totalQuestions} questions.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmitExam} disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Exam
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeExam;
