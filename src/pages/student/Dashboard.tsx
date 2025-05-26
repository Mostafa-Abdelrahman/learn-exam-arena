
import { useState, useEffect } from "react";
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
import {
  BookOpen,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import CourseService from "@/services/course.service";
import ExamService from "@/services/exam.service";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      try {
        const response = await CourseService.getStudentCourses();
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: upcomingExams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["upcoming-exams"],
    queryFn: async () => {
      try {
        const response = await ExamService.getUpcomingExams();
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch upcoming exams",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: results, isLoading: isLoadingResults } = useQuery({
    queryKey: ["student-results"],
    queryFn: async () => {
      try {
        const response = await ExamService.getAllStudentResults();
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.name}!</h2>
          <p className="text-muted-foreground">Here's what's happening with your studies</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingExams ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{upcomingExams?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{results?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {results && results.length > 0 
                  ? Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)
                  : 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Your scheduled exams</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingExams ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : upcomingExams && upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {upcomingExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.course?.name} • {new Date(exam.exam_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/student/exams/${exam.id}/take`)}
                    >
                      Take
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={() => navigate("/student/exams")}
                >
                  View All Exams
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No upcoming exams
              </p>
            )}
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>Courses you're enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {course.exam_count || 0} exams
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/student/exams", { state: { courseId: course.id } })}
                    >
                      View
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={() => navigate("/student/courses")}
                >
                  View All Courses
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No courses enrolled
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Recent Results
          </CardTitle>
          <CardDescription>Your latest exam scores</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingResults ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-3">
              {results.slice(0, 5).map((result) => (
                <div key={result.exam_id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{result.exam_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.course_name} • {new Date(result.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    result.score >= 90 ? 'text-green-600' :
                    result.score >= 80 ? 'text-blue-600' :
                    result.score >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {result.score}%
                  </div>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full mt-2"
                onClick={() => navigate("/student/results")}
              >
                View All Results
              </Button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No exam results yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
