
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, BookOpen, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFromStorage, STORAGE_KEYS } from "@/data/exam-data";

const StudentExams = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      // Get mock exam data from local storage
      const mockExams = getFromStorage(STORAGE_KEYS.EXAMS, []);
      // Only show published exams to students
      const publishedExams = mockExams.filter((exam: Exam) => exam.status === 'published');
      setExams(publishedExams);
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

  const isUpcoming = (examDate: string) => {
    return new Date(examDate) > new Date();
  };

  const isCompleted = (examId: string) => {
    const results = getFromStorage(STORAGE_KEYS.EXAM_RESULTS, []);
    return results.some((result: any) => result.exam_id === examId);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.course?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "upcoming") {
      return matchesSearch && isUpcoming(exam.exam_date) && !isCompleted(exam.id);
    } else if (filter === "completed") {
      return matchesSearch && isCompleted(exam.id);
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Available Exams</h2>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Exams
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredExams.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              {searchTerm ? "No exams match your search." : "No exams available at the moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam) => {
            const upcoming = isUpcoming(exam.exam_date);
            const completed = isCompleted(exam.id);
            
            return (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{exam.name}</CardTitle>
                    <Badge 
                      variant={upcoming && !completed ? "default" : completed ? "secondary" : "destructive"}
                    >
                      {completed ? "Completed" : upcoming ? "Upcoming" : "Past Due"}
                    </Badge>
                  </div>
                  {exam.course && (
                    <p className="text-sm text-muted-foreground">
                      {exam.course.name} ({exam.course.code})
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(exam.exam_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.total_marks || 100} marks</span>
                    </div>
                  </div>

                  {exam.instructions && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Instructions:</p>
                      <p className="line-clamp-2">{exam.instructions}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    {completed ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/student/results")}
                      >
                        View Results
                      </Button>
                    ) : upcoming ? (
                      <Button 
                        className="w-full"
                        onClick={() => handleTakeExam(exam.id)}
                      >
                        Take Exam
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Exam Closed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
