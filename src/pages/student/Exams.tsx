import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ExamService from "@/services/exam.service";

const StudentExams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if we have a specific courseId from navigation state
  const courseId = location.state?.courseId;

  useEffect(() => {
    if (currentUser) {
      fetchExams();
    }
  }, [currentUser, courseId]);

  const fetchExams = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      let response;
      if (courseId) {
        // If courseId is provided, fetch exams for that specific course
        response = await ExamService.getCourseExams(courseId);
      } else {
        // Otherwise fetch all available exams for the student
        response = await ExamService.getStudentExams();
      }
      
      if (response && response.data) {
        setExams(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      toast({
        title: "Error fetching exams",
        description: error.message || "Could not load your exams. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTakeExam = (examId: string) => {
    navigate(`/student/exams/${examId}/take`);
  };

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam.course?.name && exam.course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exam.course?.code && exam.course.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Exams</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredExams.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No exams available
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No exams match your search."
                : "No exams are currently available."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full relative overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Exam Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>
                    {exam.course?.name} ({exam.course?.code})
                  </TableCell>
                  <TableCell>
                    {format(new Date(exam.exam_date), "PPP")}
                  </TableCell>
                  <TableCell>{exam.duration} minutes</TableCell>
                  <TableCell className="text-right">
                    {exam.status === "published" ? (
                      <Badge variant="outline" className="space-x-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Published</span>
                      </Badge>
                    ) : exam.status === "archived" ? (
                      <Badge variant="destructive" className="space-x-2">
                        <XCircle className="h-4 w-4" />
                        <span>Archived</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Draft</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTakeExam(exam.id)}
                      disabled={exam.status !== "published"}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Take Exam
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
