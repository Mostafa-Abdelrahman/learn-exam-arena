import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Question, ExamQuestion } from "@/services/doctor.service";
import { ExamFormData } from "./AddExamDialog";

interface EditExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (examId: string, data: ExamFormData) => void;
  examToEdit: Exam | null;
  courses: { id: string; name: string; code: string; }[];
  availableQuestions: Question[];
  examQuestions: ExamQuestion[];
  loadingQuestions: boolean;
  onAddQuestion: (questionId: string) => void;
  onRemoveQuestion: (examQuestionId: string) => void;
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
  onRemoveQuestion,
}: EditExamDialogProps) => {
  const [formData, setFormData] = useState<ExamFormData>({
    name: "",
    course_id: "",
    exam_date: null,
    duration: "",
    instructions: "",
    status: "draft",
  });

  useEffect(() => {
    if (examToEdit) {
      setFormData({
        name: examToEdit.name,
        course_id: examToEdit.course_id,
        exam_date: new Date(examToEdit.exam_date),
        duration: examToEdit.duration,
        instructions: examToEdit.instructions || "",
        status: examToEdit.status === "archived" ? "draft" : examToEdit.status,
      });
    }
  }, [examToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (examToEdit) {
      onSubmit(examToEdit.id, formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      course_id: "",
      exam_date: null,
      duration: "",
      instructions: "",
      status: "draft",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Exam Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-exam-name">Exam Name</Label>
                <Input
                  id="edit-exam-name"
                  placeholder="Enter exam name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-course">Course</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
                  required
                >
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.exam_date ? format(formData.exam_date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.exam_date || undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, exam_date: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="120"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-instructions">Instructions (Optional)</Label>
                <Textarea
                  id="edit-instructions"
                  placeholder="Enter exam instructions..."
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Exam</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Exam Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exam Questions</h3>
                {loadingQuestions ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : examQuestions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No questions added to this exam yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {examQuestions.map((examQuestion) => (
                      <div
                        key={examQuestion.id}
                        className="flex justify-between items-start p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {examQuestion.question?.text}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Weight: {examQuestion.weight}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveQuestion(examQuestion.id!)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Questions</h3>
                {availableQuestions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No questions available. Create some questions first.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableQuestions
                      .filter(q => !examQuestions.some(eq => eq.question_id === q.id))
                      .map((question) => (
                        <div
                          key={question.id}
                          className="flex justify-between items-start p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{question.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {question.type} • {question.difficulty}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAddQuestion(question.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamDialog;
