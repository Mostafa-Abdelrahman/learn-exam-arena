
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import EnrolledCoursesList from "@/components/student/EnrolledCoursesList";
import AvailableCoursesList from "@/components/student/AvailableCoursesList";

const StudentCourses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    enrolledCourses,
    availableCourses,
    isLoadingEnrolled,
    isLoadingAvailable,
    unenrollingCourseId,
    handleEnrollInCourse,
    handleUnenrollFromCourse,
    refetchEnrolled,
    refetchAvailable,
  } = useStudentCourses();

  const handleViewExams = (courseId: string) => {
    navigate("/student/exams", { state: { courseId } });
  };

  const handleRefresh = async () => {
    await Promise.all([refetchEnrolled(), refetchAvailable()]);
    toast({
      title: "Refreshed",
      description: "Course data has been updated",
    });
  };

  const filteredEnrolledCourses = enrolledCourses.filter(course =>
    course.course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
      </div>

      {isLoadingEnrolled ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <EnrolledCoursesList
          enrolledCourses={filteredEnrolledCourses}
          onViewExams={handleViewExams}
          onUnenroll={handleUnenrollFromCourse}
          unenrollingCourseId={unenrollingCourseId}
        />
      )}

      {isLoadingAvailable ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AvailableCoursesList
          availableCourses={filteredAvailableCourses}
          onEnroll={handleEnrollInCourse}
        />
      )}
    </div>
  );
};

export default StudentCourses;
