
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
  FileText,
  Users,
  Calendar,
  Plus,
  GraduationCap,
  Award,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorService from "@/services/doctor.service";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["doctor-courses", currentUser?.id],
    queryFn: async () => {
      try {
        if (!currentUser) return [];
        const response = await DoctorService.getCourses(currentUser.id);
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

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["doctor-exams", currentUser?.id],
    queryFn: async () => {
      try {
        if (!currentUser) return [];
        const response = await DoctorService.getExams(currentUser.id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exams",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["doctor-questions", currentUser?.id],
    queryFn: async () => {
      try {
        if (!currentUser) return [];
        const response = await DoctorService.getQuestions(currentUser.id);
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  const publishedExams = exams?.filter(exam => exam.status === 'published') || [];
  const needsGrading = exams?.filter(exam => exam.needs_grading) || [];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Dr. {currentUser?.name}!</h2>
          <p className="text-muted-foreground">Manage your courses, exams, and students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/doctor/questions")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button onClick={() => navigate("/doctor/exams")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingExams ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{exams?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Exams</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingExams ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{publishedExams.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Bank</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingQuestions ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{questions?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Exams
            </CardTitle>
            <CardDescription>Your latest created exams</CardDescription>
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
            ) : exams && exams.length > 0 ? (
              <div className="space-y-3">
                {exams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{exam.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.course?.name} • {exam.status}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/doctor/exams")}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={() => navigate("/doctor/exams")}
                >
                  View All Exams
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p>No exams created yet</p>
                <Button 
                  className="mt-2" 
                  size="sm"
                  onClick={() => navigate("/doctor/exams")}
                >
                  Create Your First Exam
                </Button>
              </div>
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
            <CardDescription>Courses you're teaching</CardDescription>
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
                        {course.code} • {course.student_count || 0} students
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate("/doctor/courses")}
                    >
                      View
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={() => navigate("/doctor/courses")}
                >
                  View All Courses
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No courses assigned
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Needs Attention */}
      {needsGrading.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Needs Your Attention
            </CardTitle>
            <CardDescription>Exams that require grading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needsGrading.map((exam) => (
                <div key={exam.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.course?.name} • Has submissions to grade
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => navigate("/doctor/grading")}
                  >
                    Grade Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorDashboard;
