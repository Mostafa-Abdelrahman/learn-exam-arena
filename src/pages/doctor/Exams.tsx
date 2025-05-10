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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const DoctorExams = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [examName, setExamName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [courses, setCourses] = useState<{ id: string; name: string; code: string; }[]>([]);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      
      // Get courses assigned to this doctor
      const { data: doctorCourses, error: coursesError } = await supabase
        .from("doctor_courses")
        .select("course_id")
        .eq("doctor_id", currentUser.id);
      
      if (coursesError) throw coursesError;
      
      if (doctorCourses.length === 0) {
        setLoading(false);
        return;
      }
      
      const courseIds = doctorCourses.map(dc => dc.course_id);
      
      // Get exams for these courses with course information
      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select(`
          *,
          course:courses(name, code)
        `)
        .in("course_id", courseIds);
      
      if (examsError) throw examsError;
      
      // Type cast the exams to ensure compatibility
      setExams(examsData as Exam[]);

      // Also fetch all questions for potential use in exams
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("created_by", currentUser.id);
      
      if (questionsError) throw questionsError;
      
      // Type cast questions to ensure compatibility
      setAvailableQuestions(questionsData as Question[]);
      
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error fetching exams",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*");

      if (error) throw error;

      setCourses(data);
    } catch (error: any) {
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExam = async () => {
    try {
      if (!examName.trim() || !courseId || !examDate || !duration.trim()) {
        toast({
          title: "Validation error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("exams")
        .insert({
          name: examName,
          course_id: courseId,
          exam_date: examDate.toISOString(),
          duration: duration,
          instructions: instructions || null,
          status: status,
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam added successfully",
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchExams();
    } catch (error: any) {
      toast({
        title: "Error adding exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const { error } = await supabase
        .from("exams")
        .delete()
        .eq("id", examId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam deleted successfully",
      });

      fetchExams();
    } catch (error: any) {
      toast({
        title: "Error deleting exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setExamName(exam.name);
    setCourseId(exam.course_id);
    setExamDate(exam.exam_date ? new Date(exam.exam_date) : undefined);
    setDuration(exam.duration);
    setInstructions(exam.instructions || "");
    setStatus(exam.status);
    setIsEditDialogOpen(true);
    fetchExamQuestions(exam.id);
  };

  const updateExam = async () => {
    if (!selectedExam) return;

    try {
      const { error } = await supabase
        .from("exams")
        .update({
          name: examName,
          course_id: courseId,
          exam_date: examDate?.toISOString(),
          duration: duration,
          instructions: instructions || null,
          status: status,
        })
        .eq("id", selectedExam.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam updated successfully",
      });

      resetForm();
      setIsEditDialogOpen(false);
      fetchExams();
    } catch (error: any) {
      toast({
        title: "Error updating exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setExamName("");
    setCourseId("");
    setExamDate(undefined);
    setDuration("");
    setInstructions("");
    setStatus("draft");
    setSelectedExam(null);
    setExamQuestions([]);
  };

  const fetchExamQuestions = async (examId: string) => {
    try {
      setLoadingQuestions(true);
      
      const { data, error } = await supabase
        .from("exam_questions")
        .select(`
          *,
          question:questions(*)
        `)
        .eq("exam_id", examId);
      
      if (error) throw error;
      
      // Type cast to ensure compatibility
      setExamQuestions(data as ExamQuestion[]);
      setLoadingQuestions(false);
    } catch (error: any) {
      toast({
        title: "Error fetching exam questions",
        description: error.message,
        variant: "destructive",
      });
      setLoadingQuestions(false);
    }
  };

  const addQuestionToExam = async (questionId: string) => {
    if (!selectedExam) return;

    try {
      const { error } = await supabase
        .from("exam_questions")
        .insert({
          exam_id: selectedExam.id,
          question_id: questionId,
          weight: 1, // Default weight
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question added to exam",
      });

      fetchExamQuestions(selectedExam.id);
    } catch (error: any) {
      toast({
        title: "Error adding question to exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeQuestionFromExam = async (examQuestionId: string) => {
    if (!selectedExam) return;

    try {
      const { error } = await supabase
        .from("exam_questions")
        .delete()
        .eq("id", examQuestionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question removed from exam",
      });

      fetchExamQuestions(selectedExam.id);
    } catch (error: any) {
      toast({
        title: "Error removing question from exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Exam
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{exam.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExam(exam)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Course:</span>
                    <span>{exam.course?.name} ({exam.course?.code})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <span className="capitalize">{exam.status}</span>
                  </div>
                </div>
                <div className="text-sm mb-2">
                  <span className="font-medium">Date:</span> {format(new Date(exam.exam_date), 'PPP')}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Duration:</span> {exam.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddExam}>Add Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                          onClick={() => removeQuestionFromExam(eq.id)}
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
                        onClick={() => addQuestionToExam(question.id)}
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
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={updateExam}>Update Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorExams;
