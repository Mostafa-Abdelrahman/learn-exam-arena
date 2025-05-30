
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

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
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
            onClick={() => onQuestionSelect(index)}
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
