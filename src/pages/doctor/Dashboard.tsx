
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  PenTool,
  GraduationCap,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import ExamService from "@/services/exam.service";
import CourseService from "@/services/course.service";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon, description, isLoading = false }) => {
  const Icon = icon;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const DoctorDashboard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["doctor-courses"],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await CourseService.getDoctorCourses(currentUser.user_id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch course data",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["doctor-exams"],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await ExamService.getDoctorExams(currentUser.user_id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exam data",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const isLoading = isLoadingCourses || isLoadingExams;

  // Filter exams based on status
  const draftExams = exams?.filter(exam => exam.status === 'draft') || [];
  const publishedExams = exams?.filter(exam => exam.status === 'published') || [];
  const pendingGrading = exams?.filter(exam => {
    // Logic to determine exams with pending grades
    // This is a mock implementation, replace with actual logic based on your API
    return exam.status === 'published' && exam.needs_grading === true;
  }) || [];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Dr. {currentUser?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/doctor/questions">
              <PenTool className="mr-2 h-4 w-4" />
              Add Questions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/doctor/exams">
              <FileText className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          <TabsTrigger value="students">My Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="My Courses"
              value={courses?.length || 0}
              icon={BookOpen}
              description="Courses you teach"
              isLoading={isLoading}
            />
            <StatCard
              title="Draft Exams"
              value={draftExams.length}
              icon={FileText}
              description="Unpublished exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Published Exams"
              value={publishedExams.length}
              icon={CheckCircle2}
              description="Active exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Pending Grading"
              value={pendingGrading.length}
              icon={Clock}
              description="Exams to grade"
              isLoading={isLoading}
            />
          </div>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Courses you're currently teaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.course_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.course_code}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/doctor/courses/${course.course_id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {courses.length > 5 && (
                    <Button variant="link" className="mt-2" asChild>
                      <Link to="/doctor/courses">View all courses</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No courses assigned yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>
                Your recently created and published exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingExams ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : exams && exams.length > 0 ? (
                <div className="space-y-4">
                  {exams.slice(0, 5).map((exam) => (
                    <div key={exam.exam_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${
                          exam.status === 'published' ? 'bg-success/10' : 'bg-muted/50'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            exam.status === 'published' ? 'text-success' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{exam.exam_name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(exam.exam_date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <span className={`capitalize ${
                              exam.status === 'published' ? 'text-success' : 'text-muted-foreground'
                            }`}>
                              {exam.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/doctor/exams/${exam.exam_id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {exams.length > 5 && (
                    <Button variant="link" className="mt-2" asChild>
                      <Link to="/doctor/exams">View all exams</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No exams created yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>
                Your scheduled upcoming exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                Upcoming exams will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>
                Students enrolled in your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                Student information will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
