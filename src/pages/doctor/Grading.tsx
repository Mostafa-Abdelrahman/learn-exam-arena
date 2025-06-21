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
import { Button } from "@/components/ui/button";

const DoctorGrading = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("");

  // Check if user is authenticated and is a doctor
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Please log in to access the grading page.</p>
        </div>
      </div>
    );
  }

  if (currentUser.role !== 'doctor') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Access denied. Only doctors can access the grading page.</p>
        </div>
      </div>
    );
  }

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["doctor-grading-exams", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) {
        console.log('No current user found');
        return [];
      }
      try {
        console.log('Fetching exams for doctor:', currentUser.id, currentUser.name);
        const response = await DoctorService.getExams(currentUser.id);
        console.log('Exams response:', response);
        const filteredExams = response.data.filter(exam => exam.status === 'published');
        console.log('Filtered published exams:', filteredExams);
        return filteredExams;
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast({
          title: "Error",
          description: "Failed to fetch exams",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!currentUser,
  });

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["exam-submissions", selectedExam],
    queryFn: async () => {
      if (!selectedExam) return [];
      try {
        console.log('Fetching submissions for exam:', selectedExam);
        const response = await GradeService.getExamSubmissions(selectedExam);
        console.log('Submissions response:', response);
        return response.data;
      } catch (error) {
        console.error('Error fetching submissions:', error);
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Grading</h2>
          <p className="text-sm text-muted-foreground">
            Logged in as: {currentUser.name} (ID: {currentUser.id}, Role: {currentUser.role})
          </p>
        </div>
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

      {/* Loading State */}
      {isLoadingExams && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-800">Loading exams...</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isLoadingExams && exams && exams.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">
            <strong>Success:</strong> Found {exams.length} exam(s) for doctor {currentUser?.name}
          </p>
        </div>
      )}

      {/* Exam Selection */}
      <ExamSelector 
        exams={exams || []}
        isLoading={isLoadingExams}
        selectedExam={selectedExam}
        onSelectExam={setSelectedExam}
      />

      {/* Debug Information */}
      {!isLoadingExams && (!exams || exams.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            <strong>Debug:</strong> No exams found for doctor {currentUser?.id} ({currentUser?.name}). 
            This could be because:
          </p>
          <ul className="list-disc list-inside text-yellow-700 mt-2">
            <li>No exams have been created by this doctor</li>
            <li>All exams are in draft status (only published exams are shown)</li>
            <li>There's an issue with the API call</li>
            <li>Authentication token is invalid or expired</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-100 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Current user info:</strong> ID: {currentUser?.id}, Name: {currentUser?.name}, Role: {currentUser?.role}
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              <strong>Auth token:</strong> {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}
            </p>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  console.log('Testing API call...');
                  const response = await fetch('http://localhost:8000/api/doctor/exams', {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                      'Content-Type': 'application/json',
                    }
                  });
                  const data = await response.json();
                  console.log('API test response:', data);
                  alert(`API Response: ${JSON.stringify(data, null, 2)}`);
                } catch (error) {
                  console.error('API test error:', error);
                  alert(`API Error: ${error}`);
                }
              }}
            >
              Test API Call
            </Button>
          </div>
        </div>
      )}

      {/* Student Submissions */}
      {selectedExam && (
        <>
          <SubmissionsList 
            submissions={filteredSubmissions}
            isLoading={isLoadingSubmissions}
            selectedExam={selectedExam}
            onGradeSubmit={handleGradeSubmit}
          />
          
          {/* Debug Information for Submissions */}
          {!isLoadingSubmissions && filteredSubmissions.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                <strong>Debug:</strong> No submissions found for exam {selectedExam}. 
                This could be because:
              </p>
              <ul className="list-disc list-inside text-blue-700 mt-2">
                <li>No students have taken this exam yet</li>
                <li>No student answers exist for this exam</li>
                <li>There's an issue with the API call</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorGrading;
