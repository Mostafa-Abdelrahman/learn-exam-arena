import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  type: "mcq" | "written";
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
  created_by: string;
  evaluation_criteria?: string;
}

interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
}

interface McqChoice {
  id?: string;
  text: string;
  is_correct: boolean;
}

const DoctorQuestions = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [choices, setChoices] = useState<Choice[]>([]);

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"mcq" | "written">("mcq");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [chapter, setChapter] = useState("");
  const [evaluationCriteria, setEvaluationCriteria] = useState("");
  const [mcqChoices, setMcqChoices] = useState<McqChoice[]>([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data: questionsData, error } = await supabase
        .from("questions")
        .select("*")
        .eq("created_by", currentUser.id);

      if (error) throw error;

      // Type cast to ensure compatibility
      setQuestions(questionsData as Question[]);

      if (questionsData.length > 0) {
        const mcqQuestionIds = questionsData
          .filter(q => q.type === "mcq")
          .map(q => q.id);

        if (mcqQuestionIds.length > 0) {
          const { data: choicesData, error: choicesError } = await supabase
            .from("choices")
            .select("*")
            .in("question_id", mcqQuestionIds);

          if (choicesError) throw choicesError;
          // Type cast to ensure compatibility
          setChoices(choicesData as Choice[]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching questions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!questionText.trim()) {
        toast({
          title: "Validation error",
          description: "Question text is required",
          variant: "destructive",
        });
        return;
      }

      if (questionType === "mcq") {
        const hasEmptyChoice = mcqChoices.some(choice => !choice.text.trim());
        if (hasEmptyChoice) {
          toast({
            title: "Validation error",
            description: "All choices must have text",
            variant: "destructive",
          });
          return;
        }

        const hasCorrectChoice = mcqChoices.some(choice => choice.is_correct);
        if (!hasCorrectChoice) {
          toast({
            title: "Validation error",
            description: "At least one choice must be marked as correct",
            variant: "destructive",
          });
          return;
        }
      }

      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert({
          text: questionText,
          type: questionType,
          chapter: chapter || null,
          difficulty: difficulty || null,
          created_by: currentUser.id,
          evaluation_criteria: questionType === "written" ? evaluationCriteria : null,
        })
        .select()
        .single();

      if (questionError) throw questionError;

      if (questionType === "mcq" && questionData) {
        const choicesForInsert = mcqChoices.map(choice => ({
          question_id: questionData.id,
          text: choice.text,
          is_correct: choice.is_correct,
        }));

        // Use `from("choices")` with proper type casting
        const { error: choicesError } = await supabase
          .from("choices")
          .insert(choicesForInsert);

        if (choicesError) throw choicesError;
      }

      toast({
        title: "Success",
        description: "Question added successfully",
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error adding question",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });

      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error deleting question",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setQuestionText(question.text);
    setQuestionType(question.type);
    setDifficulty(question.difficulty || "medium");
    setChapter(question.chapter || "");
    setEvaluationCriteria(question.evaluation_criteria || "");

    if (question.type === "mcq") {
      const questionChoices = choices.filter(c => c.question_id === question.id);
      
      if (questionChoices.length > 0) {
        const formattedChoices: McqChoice[] = questionChoices.map(c => ({
          text: c.text,
          is_correct: c.is_correct,
          id: c.id
        }));
        
        while (formattedChoices.length < 4) {
          formattedChoices.push({ text: "", is_correct: false });
        }
        
        setMcqChoices(formattedChoices);
      }
    }

    setIsEditDialogOpen(true);
  };

  const updateQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      const { error: questionError } = await supabase
        .from("questions")
        .update({
          text: questionText,
          chapter: chapter || null,
          difficulty: difficulty || null,
          evaluation_criteria: questionType === "written" ? evaluationCriteria : null,
        })
        .eq("id", selectedQuestion.id);

      if (questionError) throw questionError;

      if (questionType === "mcq") {
        for (const choice of mcqChoices) {
          if (choice.id) {
            const { error: updateError } = await supabase
              .from("choices")
              .update({
                text: choice.text,
                is_correct: choice.is_correct,
              })
              .eq("id", choice.id);

            if (updateError) throw updateError;
          } else if (choice.text.trim()) {
            const { error: insertError } = await supabase
              .from("choices")
              .insert({
                question_id: selectedQuestion.id,
                text: choice.text,
                is_correct: choice.is_correct,
              });

            if (insertError) throw insertError;
          }
        }
      }

      toast({
        title: "Success",
        description: "Question updated successfully",
      });

      resetForm();
      setIsEditDialogOpen(false);
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error updating question",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setQuestionType("mcq");
    setDifficulty("medium");
    setChapter("");
    setEvaluationCriteria("");
    setMcqChoices([
      { text: "", is_correct: true },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]);
    setSelectedQuestion(null);
  };

  const handleChoiceChange = (index: number, field: 'text' | 'is_correct', value: any) => {
    const updatedChoices = [...mcqChoices];
    
    if (field === 'is_correct') {
      updatedChoices.forEach((choice, i) => {
        updatedChoices[i] = {
          ...choice,
          is_correct: i === index
        };
      });
    } else {
      updatedChoices[index] = {
        ...updatedChoices[index],
        [field]: value
      };
    }
    
    setMcqChoices(updatedChoices);
  };

  const filteredQuestions = questions.filter(
    q => 
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.chapter && q.chapter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Question
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              {searchTerm
                ? "No questions match your search."
                : "No questions have been created yet. Click 'Add New Question' to create one."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredQuestions.map((question) => {
            const questionChoices = choices.filter(
              c => c.question_id === question.id
            );
            
            return (
              <Card key={question.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Type:</span>
                      <span className="bg-primary/10 px-2 py-0.5 rounded-md capitalize">
                        {question.type === "mcq" ? "Multiple Choice" : "Written"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Difficulty:</span>
                      <span className={`px-2 py-0.5 rounded-md capitalize ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        question.difficulty === 'hard' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100'
                      }`}>
                        {question.difficulty || "Not set"}
                      </span>
                    </div>
                  </div>
                  
                  {question.chapter && (
                    <div className="text-sm mb-2">
                      <span className="font-medium">Chapter:</span> {question.chapter}
                    </div>
                  )}
                  
                  {question.type === "mcq" && questionChoices.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-sm mb-1">Choices:</div>
                      <ul className="space-y-1 text-sm">
                        {questionChoices.map((choice) => (
                          <li
                            key={choice.id}
                            className={`pl-2 border-l-2 ${
                              choice.is_correct
                                ? "border-green-500 text-green-700"
                                : "border-gray-300"
                            }`}
                          >
                            {choice.text} {choice.is_correct && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {question.type === "written" && question.evaluation_criteria && (
                    <div className="mt-2">
                      <div className="font-medium text-sm">Evaluation Criteria:</div>
                      <p className="text-sm text-muted-foreground">
                        {question.evaluation_criteria}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                rows={3}
                placeholder="Enter your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="question-type">Question Type</Label>
                <Select
                  value={questionType}
                  onValueChange={(value: "mcq" | "written") => setQuestionType(value)}
                >
                  <SelectTrigger id="question-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="written">Written Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="chapter">Chapter (Optional)</Label>
              <Input
                id="chapter"
                placeholder="Enter chapter or topic"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
            
            {questionType === "mcq" && (
              <div className="grid gap-2">
                <Label>Answer Choices (mark one as correct)</Label>
                <div className="space-y-2">
                  {mcqChoices.map((choice, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Choice ${index + 1}`}
                        value={choice.text}
                        onChange={(e) => 
                          handleChoiceChange(index, 'text', e.target.value)
                        }
                      />
                      <div className="flex items-center space-x-2 whitespace-nowrap">
                        <input
                          type="radio"
                          id={`correct-${index}`}
                          name="correct-answer"
                          checked={choice.is_correct}
                          onChange={() => 
                            handleChoiceChange(index, 'is_correct', true)
                          }
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <Label htmlFor={`correct-${index}`} className="text-sm cursor-pointer">
                          Correct
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {questionType === "written" && (
              <div className="grid gap-2">
                <Label htmlFor="evaluation-criteria">Evaluation Criteria</Label>
                <Textarea
                  id="evaluation-criteria"
                  placeholder="Enter criteria for grading this written answer..."
                  rows={3}
                  value={evaluationCriteria}
                  onChange={(e) => setEvaluationCriteria(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question-text">Question Text</Label>
              <Textarea
                id="edit-question-text"
                rows={3}
                placeholder="Enter your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}
                >
                  <SelectTrigger id="edit-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-chapter">Chapter (Optional)</Label>
                <Input
                  id="edit-chapter"
                  placeholder="Enter chapter or topic"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
            </div>
            
            {questionType === "mcq" && (
              <div className="grid gap-2">
                <Label>Answer Choices (mark one as correct)</Label>
                <div className="space-y-2">
                  {mcqChoices.map((choice, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Choice ${index + 1}`}
                        value={choice.text}
                        onChange={(e) => 
                          handleChoiceChange(index, 'text', e.target.value)
                        }
                      />
                      <div className="flex items-center space-x-2 whitespace-nowrap">
                        <input
                          type="radio"
                          id={`edit-correct-${index}`}
                          name="edit-correct-answer"
                          checked={choice.is_correct}
                          onChange={() => 
                            handleChoiceChange(index, 'is_correct', true)
                          }
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <Label htmlFor={`edit-correct-${index}`} className="text-sm cursor-pointer">
                          Correct
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {questionType === "written" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-evaluation-criteria">Evaluation Criteria</Label>
                <Textarea
                  id="edit-evaluation-criteria"
                  placeholder="Enter criteria for grading this written answer..."
                  rows={3}
                  value={evaluationCriteria}
                  onChange={(e) => setEvaluationCriteria(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={updateQuestion}>Update Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorQuestions;
