
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import GradeService from "@/services/grade.service";
import DoctorService from "@/services/doctor.service";
import { Loader2, Search, FileText, Clock, CheckCircle2 } from "lucide-react";

const DoctorGrading = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [grades, setGrades] = useState<{ [key: string]: number }>({});

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

  const handleGradeSubmit = async (studentId: string, examId: string) => {
    const grade = grades[`${studentId}-${examId}`];
    if (grade === undefined) {
      toast({
        title: "Error",
        description: "Please enter a grade",
        variant: "destructive",
      });
      return;
    }

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

  const handleGradeChange = (studentId: string, examId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setGrades(prev => ({
        ...prev,
        [`${studentId}-${examId}`]: numValue,
      }));
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
      <Card>
        <CardHeader>
          <CardTitle>Select Exam to Grade</CardTitle>
          <CardDescription>Choose an exam to view and grade student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingExams ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {exams?.map((exam) => (
                <Card 
                  key={exam.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedExam === exam.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedExam(exam.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{exam.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exam.course?.name} ({exam.course?.code})
                        </p>
                      </div>
                      <Badge variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {exam.submission_count || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Submissions */}
      {selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Review and grade student answers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubmissions ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4" />
                <p>No submissions found for this exam</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.student_exam_answer_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{submission.student_name}</CardTitle>
                          <CardDescription>{submission.question_text}</CardDescription>
                        </div>
                        <Badge variant="secondary">{submission.question_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Student Answer:</h4>
                        <Textarea
                          value={submission.written_answer}
                          readOnly
                          className="min-h-[100px] bg-muted"
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Grade (0-100):</label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="w-20"
                            value={grades[`${submission.student_id}-${selectedExam}`] || ''}
                            onChange={(e) => handleGradeChange(submission.student_id, selectedExam, e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleGradeSubmit(submission.student_id, selectedExam)}
                          size="sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Submit Grade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorGrading;
