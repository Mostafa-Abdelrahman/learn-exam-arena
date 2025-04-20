
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  FileText,
  Loader2,
  Calendar,
  Clock,
  Book,
  Trash2,
  Edit,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Exam {
  id: string;
  name: string;
  course_id: string;
  exam_date: string;
  duration: string | unknown; // Updated to accept unknown
  status: "draft" | "published" | "archived";
  created_by: string;
  course?: {
    name: string;
    code: string;
  };
  questions?: ExamQuestion[];
}

interface Question {
  id: string;
  text: string;
  type: "mcq" | "written";
  chapter?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface ExamQuestion {
  exam_id: string;
  question_id: string;
  weight: number;
  question: Question;
}

const DoctorExams = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddQuestionsDialogOpen, setIsAddQuestionsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  
  // New exam form state
  const [examName, setExamName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [examDuration, setExamDuration] = useState("60");
  const [examInstructions, setExamInstructions] = useState("");
  
  // Question selection state
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Record<string, boolean>>({});
  const [questionWeights, setQuestionWeights] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses the doctor teaches
      const { data: doctorCourses, error: doctorCoursesError } = await supabase
        .from("doctor_courses")
        .select("course_id")
        .eq("doctor_id", currentUser.id);
      
      if (doctorCoursesError) throw doctorCoursesError;
      
      if (doctorCourses.length > 0) {
        const courseIds = doctorCourses.map(dc => dc.course_id);
        
        // Fetch course details
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds);
        
        if (coursesError) throw coursesError;
        setCourses(coursesData);
        
        // Fetch exams created by this doctor
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select(`
            *,
            course:courses(name, code)
          `)
          .eq("created_by", currentUser.id);
        
        if (examsError) throw examsError;
        setExams(examsData);
      }
      
      // Fetch questions created by this doctor
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("created_by", currentUser.id);
      
      if (questionsError) throw questionsError;
      setQuestions(questionsData);
      
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExamQuestions = async (examId: string) => {
    try {
      const { data, error } = await supabase
        .from("exam_questions")
        .select(`
          exam_id,
          question_id,
          weight,
          question:questions(*)
        `)
        .eq("exam_id", examId);
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching exam questions",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const handleAddExam = async () => {
    try {
      // Validate form
      if (!examName.trim() || !selectedCourseId || !examDate || !examTime || !examDuration) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Combine date and time for the exam_date
      const combinedDateTime = `${examDate}T${examTime}:00`;
      
      // Insert exam
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .insert({
          name: examName,
          course_id: selectedCourseId,
          exam_date: combinedDateTime,
          duration: `${examDuration} minutes`,
          created_by: currentUser.id,
          status: "draft",
        })
        .select()
        .single();
      
      if (examError) throw examError;
      
      toast({
        title: "Success",
        description: "Exam created successfully",
      });
      
      // Reset form and refetch exams
      resetExamForm();
      setIsAddDialogOpen(false);
      fetchData();
      
    } catch (error: any) {
      toast({
        title: "Error creating exam",
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
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error deleting exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePublishExam = async (examId: string) => {
    try {
      // First check if the exam has questions
      const examQuestions = await fetchExamQuestions(examId);
      if (examQuestions.length === 0) {
        toast({
          title: "Cannot publish",
          description: "Add questions to the exam before publishing",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("exams")
        .update({ status: "published" })
        .eq("id", examId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Exam published successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error publishing exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openAddQuestionsDialog = async (exam: Exam) => {
    setSelectedExam(exam);
    
    // Reset selection state
    setSelectedQuestionIds({});
    setQuestionWeights({});
    setActiveTab("all");
    setQuestionSearchTerm("");
    
    // Fetch existing questions for this exam
    const examQuestions = await fetchExamQuestions(exam.id);
    setExamQuestions(examQuestions);
    
    // Pre-select questions that are already in the exam
    const selectedIds: Record<string, boolean> = {};
    const weights: Record<string, number> = {};
    
    examQuestions.forEach(eq => {
      selectedIds[eq.question_id] = true;
      weights[eq.question_id] = eq.weight;
    });
    
    setSelectedQuestionIds(selectedIds);
    setQuestionWeights(weights);
    
    setIsAddQuestionsDialogOpen(true);
  };

  const handleAddQuestionsToExam = async () => {
    if (!selectedExam) return;
    
    try {
      // Get currently selected question IDs
      const selectedIds = Object.entries(selectedQuestionIds)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      if (selectedIds.length === 0) {
        toast({
          title: "No questions selected",
          description: "Please select at least one question to add to the exam",
          variant: "destructive",
        });
        return;
      }
      
      // Get existing question IDs in the exam
      const existingIds = examQuestions.map(eq => eq.question_id);
      
      // Questions to add (selected but not in existing)
      const toAdd = selectedIds.filter(id => !existingIds.includes(id));
      
      // Questions to remove (in existing but not selected)
      const toRemove = existingIds.filter(id => !selectedIds.includes(id));
      
      // Add new questions
      if (toAdd.length > 0) {
        const newExamQuestions = toAdd.map(questionId => ({
          exam_id: selectedExam.id,
          question_id: questionId,
          weight: questionWeights[questionId] || 1.0
        }));
        
        const { error: addError } = await supabase
          .from("exam_questions")
          .insert(newExamQuestions);
        
        if (addError) throw addError;
      }
      
      // Remove unselected questions
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("exam_questions")
          .delete()
          .eq("exam_id", selectedExam.id)
          .in("question_id", toRemove);
        
        if (removeError) throw removeError;
      }
      
      // Update weights for existing questions
      for (const eq of examQuestions) {
        if (selectedIds.includes(eq.question_id) && eq.weight !== questionWeights[eq.question_id]) {
          const { error: updateError } = await supabase
            .from("exam_questions")
            .update({ weight: questionWeights[eq.question_id] })
            .eq("exam_id", selectedExam.id)
            .eq("question_id", eq.question_id);
          
          if (updateError) throw updateError;
        }
      }
      
      toast({
        title: "Success",
        description: "Exam questions updated successfully",
      });
      
      setIsAddQuestionsDialogOpen(false);
      fetchData();
      
    } catch (error: any) {
      toast({
        title: "Error updating exam questions",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetExamForm = () => {
    setExamName("");
    setSelectedCourseId("");
    setExamDate("");
    setExamTime("");
    setExamDuration("60");
    setExamInstructions("");
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    
    // Initialize weight if not set
    if (!questionWeights[questionId]) {
      setQuestionWeights(prev => ({
        ...prev,
        [questionId]: 1.0
      }));
    }
  };

  const updateQuestionWeight = (questionId: string, weight: string) => {
    const numWeight = parseFloat(weight);
    if (!isNaN(numWeight) && numWeight > 0) {
      setQuestionWeights(prev => ({
        ...prev,
        [questionId]: numWeight
      }));
    }
  };

  const formatDuration = (duration: string) => {
    // Extract the minutes from the interval string (e.g., "60 minutes" -> 60)
    const minutes = parseInt(duration.split(" ")[0]);
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    }
  };

  const filteredQuestions = questions.filter(q => {
    // Filter by tab
    if (activeTab === "mcq" && q.type !== "mcq") return false;
    if (activeTab === "written" && q.type !== "written") return false;
    
    // Filter by search term
    if (questionSearchTerm) {
      return q.text.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
             (q.chapter && q.chapter.toLowerCase().includes(questionSearchTerm.toLowerCase()));
    }
    
    return true;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Manage Exams</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Exam
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exams created yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first exam to add questions and manage student assessments.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Exam
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{exam.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Book className="h-4 w-4 mr-1" />
                      {exam.course?.name}
                    </CardDescription>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    exam.status === 'published' ? 'bg-green-100 text-green-800' : 
                    exam.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{new Date(exam.exam_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDuration(exam.duration)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openAddQuestionsDialog(exam)}
                  >
                    <FileText className="h-4 w-4 mr-1" /> Questions
                  </Button>
                  {exam.status === "draft" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {exam.status === "draft" && (
                  <Button 
                    size="sm"
                    onClick={() => handlePublishExam(exam.id)}
                  >
                    Publish
                  </Button>
                )}
                {exam.status === "published" && (
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Exam Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
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
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="exam-date">Exam Date</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="exam-time">Exam Time</Label>
                <Input
                  id="exam-time"
                  type="time"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Enter instructions for students..."
                rows={3}
                value={examInstructions}
                onChange={(e) => setExamInstructions(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetExamForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddExam}>Create Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Questions Dialog */}
      <Dialog open={isAddQuestionsDialogOpen} onOpenChange={setIsAddQuestionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Manage Exam Questions</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="all">All Questions</TabsTrigger>
                  <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
                  <TabsTrigger value="written">Written</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Input
                placeholder="Search questions..."
                className="w-[250px]"
                value={questionSearchTerm}
                onChange={(e) => setQuestionSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {questionSearchTerm
                  ? "No questions match your search."
                  : "No questions available. Add questions in the Question Bank."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="w-[100px]">Difficulty</TableHead>
                    <TableHead className="w-[120px]">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Checkbox
                          checked={!!selectedQuestionIds[question.id]}
                          onCheckedChange={() => toggleQuestionSelection(question.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{question.text}</div>
                        {question.chapter && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Chapter: {question.chapter}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-md ${
                          question.type === 'mcq' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {question.type === 'mcq' ? 'Multiple Choice' : 'Written'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-md ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          question.difficulty === 'hard' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {question.difficulty || 'Not set'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {selectedQuestionIds[question.id] && (
                          <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={questionWeights[question.id] || 1.0}
                            onChange={(e) => updateQuestionWeight(question.id, e.target.value)}
                            className="w-20"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddQuestionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestionsToExam}>Save Questions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorExams;
