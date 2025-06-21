import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  ArrowRight,
  Send
} from "lucide-react";
import { useExamTaking } from "@/hooks/useExamTaking";
import { Separator } from "@/components/ui/separator";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionNavigation from "@/components/exam/QuestionNavigation";

const TakeExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
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
  } = useExamTaking(examId!);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  const answeredCount = answers.length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleFinishExam = async () => {
    const success = await handleSubmitExam();
    if (success) {
      toast({
        title: "Exam Submitted Successfully",
        description: "Your answers have been recorded. Results will be available soon.",
      });
      navigate("/student/exams");
    }
    setShowSubmitConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Exam Not Found</CardTitle>
            <CardDescription>The requested exam could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/student/exams")} className="w-full">
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6" />
              <CardTitle>{exam.name}</CardTitle>
            </div>
            <CardDescription>
              {exam.course?.name} • Duration: {exam.duration} minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Exam Date</Label>
                <p className="text-sm">{new Date(exam.exam_date).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-sm">{exam.duration} minutes</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Total Questions</Label>
                <p className="text-sm">{questions.length} questions</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Total Marks</Label>
                <p className="text-sm">{exam.total_marks || 100} marks</p>
              </div>
            </div>

            {exam.instructions && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Instructions</Label>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm">{exam.instructions}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Important Reminders:</span>
              </div>
              <ul className="text-sm space-y-1 ml-6 list-disc">
                <li>Once started, the timer cannot be paused</li>
                <li>Your answers will be auto-saved as you progress</li>
                <li>Make sure you have a stable internet connection</li>
                <li>You can navigate between questions freely</li>
                <li>Submit before time runs out to avoid losing answers</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/student/exams")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Exams
              </Button>
              <Button onClick={handleStartExam} className="flex-1">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{exam.name}</h1>
              <p className="text-sm text-muted-foreground">{exam.course?.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-medium">{answeredCount}/{questions.length}</p>
              </div>
              <ExamTimer timeRemaining={timeRemaining} />
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowSubmitConfirm(true)}
                disabled={submitting}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        {/* Question Navigation Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Questions</CardTitle>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const isAnswered = answers.some(a => a.questionId === questions[index]?.id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionSelect(index)}
                      className={`
                        w-8 h-8 rounded text-xs font-medium transition-colors
                        ${isCurrent 
                          ? 'bg-primary text-white' 
                          : isAnswered 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }
                        hover:bg-opacity-80
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Not answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Current</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="flex-1">
          {currentQuestion && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <Badge variant="outline">
                    {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice' : 'Written Answer'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-base leading-relaxed">{currentQuestion.text}</p>
                </div>

                <Separator />

                {currentQuestion.type === 'multiple_choice' && currentQuestion.choices ? (
                  <RadioGroup 
                    value={currentAnswer?.answer || ""} 
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.choices.map((choice) => (
                        <div key={choice.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                          <RadioGroupItem value={choice.id} id={choice.id} />
                          <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                            {choice.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="written-answer">Your Answer:</Label>
                    <Textarea
                      id="written-answer"
                      placeholder="Type your answer here..."
                      value={currentAnswer?.answer || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                )}

                <QuestionNavigation
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  answers={answers}
                  onQuestionSelect={handleQuestionSelect}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={() => setShowSubmitConfirm(true)}
                  isSubmitting={submitting}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Exam?</CardTitle>
              <CardDescription>
                Are you sure you want to submit your exam? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="text-sm"><strong>Answered:</strong> {answeredCount} of {questions.length} questions</p>
                <p className="text-sm"><strong>Time Remaining:</strong> <ExamTimer timeRemaining={timeRemaining} /></p>
              </div>
              
              {answeredCount < questions.length && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">You have unanswered questions.</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1"
                >
                  Continue Exam
                </Button>
                <Button 
                  onClick={handleFinishExam}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
