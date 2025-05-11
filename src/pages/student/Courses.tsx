import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Book, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CourseService from "@/services/course.service";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  doctors: {
    id: string;
    name: string;
  }[];
  exam_count: number;
}

const StudentCourses = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const fetchCourses = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Fetch courses from our Laravel API
      const response = await CourseService.getStudentCourses(currentUser.id);
      
      if (response && response.data) {
        setCourses(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error fetching courses",
        description: error.message || "Could not load your enrolled courses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewExams = (courseId: string) => {
    navigate("/student/exams", { state: { courseId } });
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No courses match your search" : "No courses enrolled"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try a different search term or clear your search"
                : "You are not enrolled in any courses yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md mr-2">
                    {course.code}
                  </span>
                  {course.name}
                </CardTitle>
                {course.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Instructor{course.doctors.length !== 1 ? 's' : ''}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.doctors.length > 0
                          ? course.doctors.map(doctor => doctor.name).join(", ")
                          : "No instructors assigned"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Exams</div>
                      <div className="text-sm text-muted-foreground">
                        {course.exam_count} exam{course.exam_count !== 1 ? 's' : ''} available
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewExams(course.id)}
                >
                  <FileText className="h-4 w-4 mr-2" /> View Exams
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
