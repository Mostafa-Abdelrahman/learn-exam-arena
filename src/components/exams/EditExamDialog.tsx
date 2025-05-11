
import { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Exam, ExamQuestion, Question } from "@/services/doctor.service";

interface Course {
  id: string;
  name: string;
  code: string;
}

interface EditExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (examId: string, examData: ExamFormData) => void;
  examToEdit: Exam | null;
  courses: Course[];
  availableQuestions: Question[];
  examQuestions: ExamQuestion[];
  loadingQuestions: boolean;
  onAddQuestion: (questionId: string) => void;
  onRemoveQuestion: (examQuestionId: string) => void;
}

export interface ExamFormData {
  name: string;
  course_id: string;
  exam_date?: Date;
  duration: string;
  instructions: string;
  status: "draft" | "published" | "archived";
}

const EditExamDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  examToEdit, 
  courses,
  availableQuestions,
  examQuestions,
  loadingQuestions,
  onAddQuestion,
  onRemoveQuestion
}: EditExamDialogProps) => {
  const [examName, setExamName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  useEffect(() => {
    if (examToEdit) {
      setExamName(examToEdit.name);
      setCourseId(examToEdit.course_id);
      setExamDate(examToEdit.exam_date ? new Date(examToEdit.exam_date) : undefined);
      setDuration(examToEdit.duration);
      setInstructions(examToEdit.instructions || "");
      setStatus(examToEdit.status);
    }
  }, [examToEdit]);

  const resetForm = () => {
    setExamName("");
    setCourseId("");
    setExamDate(undefined);
    setDuration("");
    setInstructions("");
    setStatus("draft");
  };

  const handleSubmit = () => {
    if (!examToEdit) return;
    
    onSubmit(examToEdit.id, {
      name: examName,
      course_id: courseId,
      exam_date: examDate,
      duration,
      instructions,
      status,
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Exam</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-name">Exam Name</Label>
              <Input
                id="edit-exam-name"
                placeholder="Enter exam name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-course">Course</Label>
              <Select
                value={courseId}
                onValueChange={(value) => setCourseId(value)}
              >
                <SelectTrigger id="edit-course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-date">Exam Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    {examDate ? (
                      format(examDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={setExamDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration (e.g., 1 hour 30 minutes)</Label>
              <Input
                id="edit-duration"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-instructions">Instructions (Optional)</Label>
            <Textarea
              id="edit-instructions"
              placeholder="Enter instructions for the exam"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "draft" | "published" | "archived") => setStatus(value)}
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Exam Questions</Label>
            {loadingQuestions ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {examQuestions.map((eq) => (
                  <Card key={eq.id}>
                    <CardContent className="flex items-center justify-between p-3">
                      <span>{eq.question?.text}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveQuestion(eq.id!)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {examQuestions.length === 0 && (
                  <div className="text-muted-foreground">No questions added yet.</div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label>Available Questions</Label>
            <div className="space-y-2">
              {availableQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <span>{question.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddQuestion(question.id)}
                    >
                      Add to Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {availableQuestions.length === 0 && (
                <div className="text-muted-foreground">No questions available.</div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Exam</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamDialog;
