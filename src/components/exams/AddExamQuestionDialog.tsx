
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "@/data/exam-data";

interface AddExamQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  examId: string;
  onQuestionsAdded: () => void;
}

const AddExamQuestionDialog = ({ isOpen, onOpenChange, examId, onQuestionsAdded }: AddExamQuestionDialogProps) => {
  const { toast } = useToast();
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      loadAvailableQuestions();
    }
  }, [isOpen]);

  const loadAvailableQuestions = () => {
    const questions = getFromStorage(STORAGE_KEYS.QUESTIONS, []);
    setAvailableQuestions(questions);
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddQuestions = () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "No questions selected",
        description: "Please select at least one question to add to the exam.",
        variant: "destructive"
      });
      return;
    }

    // Get exam data
    const exams = getFromStorage(STORAGE_KEYS.EXAMS, []);
    const examIndex = exams.findIndex((e: Exam) => e.id === examId);
    
    if (examIndex === -1) {
      toast({
        title: "Exam not found",
        description: "Could not find the exam to add questions to.",
        variant: "destructive"
      });
      return;
    }

    // Add selected questions to exam
    const selectedQuestionData = availableQuestions.filter(q => selectedQuestions.includes(q.id));
    
    if (!exams[examIndex].questions) {
      exams[examIndex].questions = [];
    }

    selectedQuestionData.forEach(question => {
      const examQuestion = {
        id: `eq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        question_id: question.id,
        exam_id: examId,
        text: question.text,
        type: question.type,
        weight: 10,
        difficulty_level: question.difficulty,
        choices: question.choices?.map(choice => ({
          id: choice.id,
          text: choice.text,
          is_correct: choice.is_correct
        }))
      };
      
      // Check if question is already in exam
      const exists = exams[examIndex].questions?.some((eq: any) => eq.question_id === question.id);
      if (!exists) {
        exams[examIndex].questions.push(examQuestion);
      }
    });

    saveToStorage(STORAGE_KEYS.EXAMS, exams);

    toast({
      title: "Questions added",
      description: `${selectedQuestions.length} question(s) added to the exam successfully.`
    });

    setSelectedQuestions([]);
    onQuestionsAdded();
    onOpenChange(false);
  };

  const filteredQuestions = availableQuestions.filter(question => {
    const typeMatch = filterType === "all" || question.type === filterType;
    const difficultyMatch = filterDifficulty === "all" || question.difficulty === filterDifficulty;
    return typeMatch && difficultyMatch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Questions to Exam</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="written">Written Answer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredQuestions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No questions available. Create some questions first.
              </p>
            ) : (
              filteredQuestions.map((question) => (
                <Card key={question.id} className="cursor-pointer hover:bg-gray-50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={() => handleQuestionToggle(question.id)}
                        />
                        <CardTitle className="text-base">{question.text}</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">
                          {question.type === 'mcq' ? 'Multiple Choice' : 'Written Answer'}
                        </Badge>
                        <Badge 
                          variant={
                            question.difficulty === 'easy' ? 'default' :
                            question.difficulty === 'medium' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {question.difficulty || 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  {question.type === 'mcq' && question.choices && (
                    <CardContent className="pt-0">
                      <div className="text-sm text-muted-foreground">
                        <strong>Choices:</strong>
                        <ul className="mt-1 space-y-1">
                          {question.choices.map((choice) => (
                            <li key={choice.id} className={choice.is_correct ? "text-green-600 font-medium" : ""}>
                              • {choice.text} {choice.is_correct && "(Correct)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>

          {selectedQuestions.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800">
                {selectedQuestions.length} question(s) selected
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddQuestions} disabled={selectedQuestions.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add Questions ({selectedQuestions.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamQuestionDialog;
