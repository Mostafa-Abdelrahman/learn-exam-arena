import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ExamService, CourseService } from "@/services";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamCard from "@/components/exams/ExamCard";
import AddExamDialog, { ExamFormData } from "@/components/exams/AddExamDialog";
import EditExamDialog from "@/components/exams/EditExamDialog";

const DoctorExams = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [examsResponse, coursesResponse] = await Promise.all([
        ExamService.getAllExams(),
        CourseService.getDoctorCourses()
      ]);
      
      setExams(examsResponse.data);
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
      if (!examData.name.trim() || !examData.course_id || !examData.exam_date || !examData.duration.trim()) {
        toast({
          title: "Validation error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }

      await ExamService.createExam({
        name: examData.name,
        course_id: examData.course_id,
        exam_date: examData.exam_date.toISOString(),
        duration: examData.duration,
        instructions: examData.instructions || undefined,
      });

      toast({
        title: "Success",
        description: "Exam created successfully",
      });

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

  const updateExam = async (examId: string, examData: ExamFormData) => {
    try {
      await ExamService.updateExam(examId, {
        name: examData.name,
        exam_date: examData.exam_date?.toISOString(),
        duration: examData.duration,
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
            <ExamCard 
              key={exam.id} 
              exam={exam} 
              onEdit={handleEditExam} 
              onDelete={handleDeleteExam} 
            />
          ))}
        </div>
      )}

      <AddExamDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddExam}
        courses={courses}
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
    </div>
  );
};

export default DoctorExams;
