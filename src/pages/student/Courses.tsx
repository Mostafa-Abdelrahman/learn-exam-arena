
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import CourseService from "@/services/course.service";
import { Loader2, Search, BookOpen, Users, Calendar, FileText } from "lucide-react";

const StudentCourses = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: enrolledCourses, isLoading: isLoadingEnrolled } = useQuery({
    queryKey: ["student-courses", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await StudentService.getStudentCourses(currentUser.id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch enrolled courses",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: availableCourses, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ["available-courses"],
    queryFn: async () => {
      try {
        const response = await CourseService.getAllCourses();
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  const handleViewExams = (courseId: string) => {
    navigate("/student/exams", { state: { courseId } });
  };

  const handleEnrollInCourse = async (courseId: string) => {
    if (!currentUser) return;

    try {
      await StudentService.enrollInCourse(currentUser.id, courseId);
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });
      // Refetch courses
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const enrolledCourseIds = enrolledCourses?.map(ec => ec.course.course_id) || [];
  const unenrolledCourses = availableCourses?.filter(
    course => !enrolledCourseIds.includes(course.course_id)
  ) || [];

  const filteredEnrolledCourses = enrolledCourses?.filter(course =>
    course.course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredAvailableCourses = unenrolledCourses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Enrolled Courses
          </CardTitle>
          <CardDescription>
            Courses you are currently enrolled in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEnrolled ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEnrolledCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEnrolledCourses.map((enrollment) => (
                <Card key={enrollment.student_course_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{enrollment.course.course_name}</CardTitle>
                        <CardDescription>{enrollment.course.course_code}</CardDescription>
                      </div>
                      <Badge variant="default">Enrolled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrollment.course.description && (
                      <p className="text-sm text-muted-foreground">
                        {enrollment.course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {enrollment.course.student_count || 0}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {enrollment.course.exam_count || 0}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleViewExams(enrollment.course.course_id)}
                    >
                      View Exams
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Available Courses
          </CardTitle>
          <CardDescription>
            Courses available for enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAvailable ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAvailableCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No available courses</h3>
              <p>All courses are either enrolled or no courses are available.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvailableCourses.map((course) => (
                <Card key={course.course_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.course_name}</CardTitle>
                        <CardDescription>{course.course_code}</CardDescription>
                      </div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.description && (
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.student_count || 0}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {course.exam_count || 0}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleEnrollInCourse(course.course_id)}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourses;
