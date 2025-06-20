
import { Button } from "@/components/ui/button";

interface QuestionNavigationProps {
  questions: any[];
  currentQuestionIndex: number;
  answers: any[];
  onQuestionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const QuestionNavigation = ({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting
}: QuestionNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const currentAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex]?.id);

  return (
    <div className="flex items-center justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
      >
        Previous
      </Button>

      <div className="flex items-center gap-4">
        {currentAnswer ? (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Answered</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm">Not answered</span>
          </div>
        )}
      </div>

      {isLastQuestion ? (
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default QuestionNavigation;
