
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import GradeService from "@/services/grade.service";
import DoctorService from "@/services/doctor.service";
import { Search } from "lucide-react";
import ExamSelector from "@/components/doctor/ExamSelector";
import SubmissionsList from "@/components/doctor/SubmissionsList";

const DoctorGrading = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("");

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["doctor-grading-exams", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await DoctorService.getExams(currentUser.id);
        return response.data.filter(exam => exam.status === 'published');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exams",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["exam-submissions", selectedExam],
    queryFn: async () => {
      if (!selectedExam) return [];
      try {
        const response = await GradeService.getExamSubmissions(selectedExam);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch submissions",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!selectedExam,
  });

  const handleGradeSubmit = async (studentId: string, examId: string, grade: number) => {
    try {
      await GradeService.submitGrade({
        student_id: studentId,
        exam_id: examId,
        grade: grade,
      });

      toast({
        title: "Success",
        description: "Grade submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit grade",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions?.filter(submission =>
    submission.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Exam Grading</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Exam Selection */}
      <ExamSelector 
        exams={exams || []}
        isLoading={isLoadingExams}
        selectedExam={selectedExam}
        onSelectExam={setSelectedExam}
      />

      {/* Student Submissions */}
      {selectedExam && (
        <SubmissionsList 
          submissions={filteredSubmissions}
          isLoading={isLoadingSubmissions}
          selectedExam={selectedExam}
          onGradeSubmit={handleGradeSubmit}
        />
      )}
    </div>
  );
};

export default DoctorGrading;
