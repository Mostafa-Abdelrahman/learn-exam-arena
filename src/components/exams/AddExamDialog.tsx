
import { useState } from "react";
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
import { format } from "date-fns";

interface Course {
  id: string;
  name: string;
  code: string;
}

interface AddExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (examData: ExamFormData) => void;
  courses: Course[];
}

export interface ExamFormData {
  name: string;
  course_id: string;
  exam_date?: Date;
  duration: string;
  instructions: string;
  status: "draft" | "published" | "archived";
}

const AddExamDialog = ({ isOpen, onOpenChange, onSubmit, courses }: AddExamDialogProps) => {
  const [examName, setExamName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  const resetForm = () => {
    setExamName("");
    setCourseId("");
    setExamDate(undefined);
    setDuration("");
    setInstructions("");
    setStatus("draft");
  };

  const handleSubmit = () => {
    onSubmit({
      name: examName,
      course_id: courseId,
      exam_date: examDate,
      duration,
      instructions,
      status,
    });
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="exam-name">Exam Name</Label>
            <Input
              id="exam-name"
              placeholder="Enter exam name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={courseId}
              onValueChange={(value) => setCourseId(value)}
            >
              <SelectTrigger id="course">
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
          
          <div className="grid gap-2">
            <Label htmlFor="exam-date">Exam Date</Label>
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
            <Label htmlFor="duration">Duration (e.g., 1 hour 30 minutes)</Label>
            <Input
              id="duration"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Enter instructions for the exam"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "draft" | "published" | "archived") => setStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Exam</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamDialog;
