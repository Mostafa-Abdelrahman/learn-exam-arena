import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ExamService, CourseService } from "@/services";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamCard from "@/components/exams/ExamCard";
import AddExamDialog, { ExamFormData } from "@/components/exams/AddExamDialog";
import EditExamDialog from "@/components/exams/EditExamDialog";
import AddExamQuestionDialog from "@/components/exams/AddExamQuestionDialog";
import { getFromStorage, STORAGE_KEYS } from "@/data/exam-data";

const DoctorExams = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState<string>("");
  const [isCreatingExam, setIsCreatingExam] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get exams from API
      const examsResponse = await ExamService.getDoctorExams();
      setExams(examsResponse.data);
      
      // Get courses
      const coursesResponse = await CourseService.getDoctorCourses();
      setCourses(coursesResponse.data);
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

  const handleAddExam = async (examData: ExamFormData) => {
    try {
      setIsCreatingExam(true);
      
      // Enhanced validation with specific error messages
      if (!examData.name.trim()) {
        toast({
          title: "Validation error",
          description: "Exam name is required",
          variant: "destructive",
        });
        return;
      }

      if (!examData.course_id) {
        toast({
          title: "Validation error",
          description: "Please select a course",
          variant: "destructive",
        });
        return;
      }

      if (!examData.exam_date) {
        toast({
          title: "Validation error",
          description: "Please select an exam date",
          variant: "destructive",
        });
        return;
      }

      if (!examData.duration.trim() || parseInt(examData.duration) < 30) {
        toast({
          title: "Validation error",
          description: "Duration must be at least 30 minutes",
          variant: "destructive",
        });
        return;
      }

      const response = await ExamService.createExam({
        name: examData.name.trim(),
        course_id: examData.course_id,
        exam_date: examData.exam_date.toISOString(),
        duration: parseInt(examData.duration).toString(),
        instructions: examData.instructions?.trim() || undefined,
      });

      toast({
        title: "Success",
        description: "Exam created successfully",
      });

      setIsAddDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error creating exam",
        description: error.message || "Failed to create exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingExam(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await ExamService.deleteExam(examId);

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

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditDialogOpen(true);
  };

  const handleAddQuestions = (examId: string) => {
    setSelectedExamForQuestions(examId);
    setIsAddQuestionDialogOpen(true);
  };

  const updateExam = async (examId: string, examData: ExamFormData) => {
    try {
      const response = await ExamService.updateExam(examId, {
        name: examData.name,
        exam_date: examData.exam_date?.toISOString(),
        duration: parseInt(examData.duration).toString(),
        instructions: examData.instructions || undefined,
        status: examData.status,
      });

      toast({
        title: "Success",
        description: "Exam updated successfully",
      });

      setIsEditDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error updating exam",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testExamCreation = async () => {
    try {
      console.log('Testing exam creation...');
      const testData = {
        name: "Test Exam from Frontend",
        course_id: "1",
        exam_date: new Date().toISOString(),
        duration: "60",
        instructions: "Test instructions"
      };
      
      console.log('Test data:', testData);
      const response = await ExamService.createExam(testData);
      console.log('Test response:', response);
      
      toast({
        title: "Test Success",
        description: "Exam creation test completed successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "Test Failed",
        description: "Exam creation test failed",
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
          <Button variant="outline" onClick={testExamCreation}>
            Test Creation
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
            <div key={exam.id} className="relative">
              <ExamCard 
                exam={exam} 
                onEdit={handleEditExam} 
                onDelete={handleDeleteExam} 
              />
              <div className="absolute top-2 right-12">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddQuestions(exam.id)}
                  className="bg-white hover:bg-gray-50"
                >
                  <BookOpen className="mr-1 h-3 w-3" />
                  Questions ({exam.questions?.length || 0})
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddExamDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddExam}
        courses={courses}
        isLoading={isCreatingExam}
      />

      <EditExamDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={updateExam}
        examToEdit={selectedExam}
        courses={courses}
        availableQuestions={[]}
        examQuestions={[]}
        loadingQuestions={false}
        onAddQuestion={() => {}}
        onRemoveQuestion={() => {}}
      />

      <AddExamQuestionDialog
        isOpen={isAddQuestionDialogOpen}
        onOpenChange={setIsAddQuestionDialogOpen}
        examId={selectedExamForQuestions}
        onQuestionsAdded={fetchData}
      />
    </div>
  );
};

export default DoctorExams;
