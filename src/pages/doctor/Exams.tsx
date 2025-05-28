import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DoctorService, { ExamQuestion, Question } from "@/services/doctor.service";
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
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [courses, setCourses] = useState<{ id: string; name: string; code: string; }[]>([]);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      // Get exams for this doctor
      const { data: examsData } = await DoctorService.getExams(currentUser.id);
      setExams(examsData);

      // Also fetch all questions for potential use in exams
      const { data: questionsData } = await DoctorService.getQuestions(currentUser.id);
      setAvailableQuestions(questionsData);
      
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
      if (!currentUser) return;
      
      const { data } = await DoctorService.getCourses(currentUser.id);
      setCourses(data);
    } catch (error: any) {
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExam = async (examData: ExamFormData) => {
    try {
      if (!currentUser) {
        toast({
          title: "Validation error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      // Check if required fields are present in examData
      if (!examData.name.trim() || !examData.course_id || !examData.exam_date || !examData.duration.trim()) {
        toast({
          title: "Validation error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }

      await DoctorService.createExam({
        name: examData.name,
        course_id: examData.course_id,
        exam_date: examData.exam_date?.toISOString(),
        duration: examData.duration,
        instructions: examData.instructions || null,
        status: examData.status,
        created_by: currentUser.id,
      });

      toast({
        title: "Success",
        description: "Exam added successfully",
      });

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
      await DoctorService.deleteExam(examId);

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
    setIsEditDialogOpen(true);
    fetchExamQuestions(exam.id);
  };

  const updateExam = async (examId: string, examData: ExamFormData) => {
    try {
      await DoctorService.updateExam(examId, {
        name: examData.name,
        course_id: examData.course_id,
        exam_date: examData.exam_date?.toISOString(),
        duration: examData.duration,
        instructions: examData.instructions || null,
        status: examData.status,
      });

      toast({
        title: "Success",
        description: "Exam updated successfully",
      });

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

  const fetchExamQuestions = async (examId: string) => {
    try {
      setLoadingQuestions(true);
      
      const { data } = await DoctorService.getExamQuestions(examId);
      setExamQuestions(data);
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
      await DoctorService.addQuestionToExam(selectedExam.id, questionId);

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
      await DoctorService.removeQuestionFromExam(examQuestionId);

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
        availableQuestions={availableQuestions}
        examQuestions={examQuestions}
        loadingQuestions={loadingQuestions}
        onAddQuestion={addQuestionToExam}
        onRemoveQuestion={removeQuestionFromExam}
      />
    </div>
  );
};

export default DoctorExams;
