
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Loader2,
  Calendar,
  Clock,
  Book,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isBefore, isAfter } from "date-fns";

interface Exam {
  id: string;
  name: string;
  course_id: string;
  exam_date: string;
  duration: string;
  status: "draft" | "published" | "archived";
  course: {
    name: string;
    code: string;
  };
  student_exams?: StudentExam[];
}

interface StudentExam {
  id: string;
  student_id: string;
  exam_id: string;
  completed: boolean;
  start_time: string | null;
  end_time: string | null;
  score: number | null;
}

const StudentExams = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [completedExams, setCompletedExams] = useState<Exam[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchExams();
  }, [currentUser]);

  const fetchExams = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Fetch student courses
      const { data: studentCourses, error: coursesError } = await supabase
        .from("student_courses")
        .select("course_id")
        .eq("student_id", currentUser.id);
      
      if (coursesError) throw coursesError;
      
      if (studentCourses && studentCourses.length > 0) {
        const courseIds = studentCourses.map(sc => sc.course_id);
        
        // Fetch published exams for these courses
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select(`
            *,
            course:courses(name, code)
          `)
          .in("course_id", courseIds)
          .eq("status", "published");
        
        if (examsError) throw examsError;
        
        // Fetch student's exam attempts
        const { data: studentExams, error: studentExamsError } = await supabase
          .from("student_exams")
          .select("*")
          .eq("student_id", currentUser.id);
        
        if (studentExamsError) throw studentExamsError;
        
        // Get unique exam IDs from student answers
        const attemptedExamIds = studentExams ? [...new Set(studentExams.map(sa => sa.exam_id))] : [];
        
        // Categorize exams - make sure to convert duration to string
        const now = new Date();
        const upcoming: Exam[] = [];
        const available: Exam[] = [];
        const completed: Exam[] = [];
        
        if (examsData) {
          examsData.forEach(exam => {
            // Convert duration to string
            const processedExam = {
              ...exam,
              duration: String(exam.duration)
            };
            
            const examDate = new Date(processedExam.exam_date);
            const hasAttempted = attemptedExamIds.includes(processedExam.id);
            
            if (hasAttempted) {
              const studentExam = studentExams?.find(se => se.exam_id === processedExam.id);
              completed.push({
                ...processedExam,
                student_exams: studentExam ? [studentExam] : []
              });
            } else if (isAfter(examDate, now)) {
              upcoming.push(processedExam);
            } else {
              // Exam date has passed but not attempted - may still be available
              available.push(processedExam);
            }
          });
        }
        
        setUpcomingExams(upcoming);
        setAvailableExams(available);
        setCompletedExams(completed);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching exams",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTakeExam = (examId: string) => {
    navigate(`/student/exams/${examId}/take`);
  };

  const handleViewResults = (examId: string) => {
    navigate(`/student/grades`);
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

  const formatExamDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "PPP 'at' p"); // e.g., "April 20, 2025 at 2:30 PM"
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const examDate = new Date(exam.exam_date);
    
    if (isBefore(now, examDate)) {
      return {
        label: "Upcoming",
        icon: <Clock3 className="h-4 w-4 mr-1" />,
        color: "bg-yellow-100 text-yellow-800"
      };
    } else if (exam.student_exams?.some(a => a.completed)) {
      return {
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        color: "bg-green-100 text-green-800"
      };
    } else {
      return {
        label: "Available",
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        color: "bg-blue-100 text-blue-800"
      };
    }
  };

  const renderExamCard = (exam: Exam, showTakeButton = false, showResultsButton = false) => {
    const status = getExamStatus(exam);
    
    return (
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
            <div className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${status.color}`}>
              {status.icon}
              {status.label}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatExamDate(exam.exam_date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatDuration(exam.duration)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {showTakeButton && (
            <Button
              className="w-full"
              onClick={() => handleTakeExam(exam.id)}
            >
              <FileText className="h-4 w-4 mr-2" /> Take Exam
            </Button>
          )}
          {showResultsButton && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleViewResults(exam.id)}
            >
              View Results
            </Button>
          )}
          {!showTakeButton && !showResultsButton && (
            <div className="w-full text-center text-sm text-muted-foreground">
              This exam will be available on the scheduled date.
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-3xl font-bold tracking-tight">My Exams</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingExams.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableExams.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedExams.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingExams.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <h3 className="text-lg font-semibold mb-2">No upcoming exams</h3>
                <p className="text-muted-foreground">
                  You don't have any upcoming exams scheduled at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingExams.map(exam => renderExamCard(exam))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : availableExams.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <h3 className="text-lg font-semibold mb-2">No available exams</h3>
                <p className="text-muted-foreground">
                  There are no exams available for you to take right now.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableExams.map(exam => renderExamCard(exam, true))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : completedExams.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <h3 className="text-lg font-semibold mb-2">No completed exams</h3>
                <p className="text-muted-foreground">
                  You haven't completed any exams yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedExams.map(exam => renderExamCard(exam, false, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentExams;
