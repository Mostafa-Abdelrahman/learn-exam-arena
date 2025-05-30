
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import StudentService from "@/services/student.service";
import CourseService from "@/services/course.service";

export const useStudentCourses = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [unenrollingCourseId, setUnenrollingCourseId] = useState<string | null>(null);

  const { data: enrolledCourses, isLoading: isLoadingEnrolled, refetch: refetchEnrolled } = useQuery({
    queryKey: ["student-courses", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await StudentService.getStudentCourses();
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

  const { data: availableCourses, isLoading: isLoadingAvailable, refetch: refetchAvailable } = useQuery({
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

  const handleEnrollInCourse = async (courseId: string) => {
    if (!currentUser) return;

    try {
      await StudentService.enrollInCourse(courseId);
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });
      
      await Promise.all([refetchEnrolled(), refetchAvailable()]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const handleUnenrollFromCourse = async (courseId: string) => {
    if (!currentUser) return;

    try {
      setUnenrollingCourseId(courseId);
      await CourseService.unenrollFromCourse(courseId);
      toast({
        title: "Success",
        description: "Successfully unenrolled from course",
      });
      
      await Promise.all([refetchEnrolled(), refetchAvailable()]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unenroll from course",
        variant: "destructive",
      });
    } finally {
      setUnenrollingCourseId(null);
    }
  };

  const enrolledCourseIds = enrolledCourses?.map(ec => ec.course.course_id) || [];
  const unenrolledCourses = availableCourses?.filter(
    course => !enrolledCourseIds.includes(course.id)
  ) || [];

  return {
    enrolledCourses: enrolledCourses || [],
    availableCourses: unenrolledCourses,
    isLoadingEnrolled,
    isLoadingAvailable,
    unenrollingCourseId,
    handleEnrollInCourse,
    handleUnenrollFromCourse,
    refetchEnrolled,
    refetchAvailable,
  };
};
