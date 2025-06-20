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
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ExamService from "@/services/exam.service";
import StudentService from "@/services/student.service";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      try {
        const response = await StudentService.getStudentCourses();
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
        return [];
      }
    },
  });

  const { data: results, isLoading: isLoadingResults } = useQuery({
    queryKey: ["student-results"],
    queryFn: async () => {
      try {
        const response = await ExamService.getStudentResults();
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  const enrolledCourses = courses || [];
  const recentResults = (results || []).slice(0, 3);
  const avgGPA = results?.length > 0 ? 
    (results.reduce((acc: number, result: any) => acc + result.percentage, 0) / results.length / 100 * 4).toFixed(2) : "0.00";

  const handleStartExam = (examId: string) => {
    navigate(`/student/exams/${examId}/take`);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.name}!</h2>
          <p className="text-muted-foreground">Track your academic progress and upcoming exams</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/student/courses")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Courses
          </Button>
          <Button onClick={() => navigate("/student/exams")}>
            <FileText className="mr-2 h-4 w-4" />
            View All Exams
          </Button>
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
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{avgGPA}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{results?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams - Priority Section */}
      {upcomingExams && upcomingExams.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              Upcoming Exams - Action Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              Don't miss your scheduled exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.slice(0, 3).map((exam) => (
                <div key={`upcoming-exam-${exam.id}`} className="flex justify-between items-center p-3 bg-white rounded-md border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{exam.name}</p>
                      <Badge variant="outline">{exam.course?.name}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(exam.exam_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exam.duration} minutes
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleStartExam(exam.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Start Exam
                  </Button>
                </div>
              ))}
              {upcomingExams.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/student/exams")}
                >
                  View All Upcoming Exams ({upcomingExams.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>Courses you're currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="space-y-3">
                {enrolledCourses.slice(0, 3).map((studentCourse: any) => (
                  <div key={`enrolled-course-${studentCourse.course_id}`} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{studentCourse.course.course_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {studentCourse.course.course_code} • {studentCourse.course.doctor?.name || 'No instructor assigned'}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/student/courses")}
                    >
                      View
                    </Button>
                  </div>
                ))}
                {enrolledCourses.length > 3 && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2"
                    onClick={() => navigate("/student/courses")}
                  >
                    View All Courses
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p>No courses enrolled yet</p>
                <Button 
                  className="mt-2" 
                  size="sm"
                  onClick={() => navigate("/student/courses")}
                >
                  Browse Available Courses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam results</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : recentResults.length > 0 ? (
              <div className="space-y-3">
                {recentResults.map((result) => (
                  <div key={`result-${result.id}`} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{result.exam_name}</p>
                      <p className="text-sm text-muted-foreground">{result.course_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={result.percentage >= 60 ? "default" : "destructive"}
                        className="min-w-[50px] justify-center"
                      >
                        {result.percentage}%
                      </Badge>
                      {result.percentage >= 60 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate("/student/exams")}
            >
              <FileText className="h-6 w-6" />
              <span>Take an Exam</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate("/student/results")}
            >
              <Award className="h-6 w-6" />
              <span>View Results</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => navigate("/student/schedule")}
            >
              <Calendar className="h-6 w-6" />
              <span>Check Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
