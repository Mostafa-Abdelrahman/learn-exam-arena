
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  ClipboardList,
  Award,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import ExamService from "@/services/exam.service";
import CourseService from "@/services/course.service";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

const StudentDashboard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await CourseService.getStudentCourses(currentUser.user_id);
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
    queryKey: ["student-exams"],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await ExamService.getStudentExams(currentUser.user_id);
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

  // Calculate upcoming exams (those that haven't passed their date yet)
  const upcomingExams = exams?.filter(exam => {
    const examDate = new Date(exam.exam_date);
    const now = new Date();
    return examDate > now && exam.status === 'published';
  }) || [];

  // Sort upcoming exams by date (closest first)
  upcomingExams.sort((a, b) => {
    return new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
  });

  // Calculate past exams
  const pastExams = exams?.filter(exam => {
    const examDate = new Date(exam.exam_date);
    const now = new Date();
    return examDate < now && exam.status === 'published';
  }) || [];

  // Get urgent exams (within the next 48 hours)
  const urgentExams = upcomingExams.filter(exam => {
    const examDate = new Date(exam.exam_date);
    const now = new Date();
    const hoursDiff = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/student/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Link>
          </Button>
          <Button asChild>
            <Link to="/student/exams">
              <ClipboardList className="mr-2 h-4 w-4" />
              View Exams
            </Link>
          </Button>
        </div>
      </div>

      {urgentExams.length > 0 && (
        <Card className="border-warning bg-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-warning" />
              Urgent Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentExams.map((exam) => (
                <div key={exam.exam_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{exam.exam_name}</p>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-3 w-3 text-warning" />
                      {new Date(exam.exam_date).toLocaleString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-warning text-warning" asChild>
                    <Link to={`/student/exams/${exam.exam_id}/take`}>
                      Take Exam
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="exams">Upcoming Exams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Enrolled Courses"
              value={courses?.length || 0}
              icon={BookOpen}
              description="Courses you're taking"
              isLoading={isLoading}
            />
            <StatCard
              title="Upcoming Exams"
              value={upcomingExams.length}
              icon={ClipboardList}
              description="Scheduled exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Completed Exams"
              value={pastExams.length}
              icon={FileText}
              description="Past exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Average Grade"
              value="N/A"
              icon={Award}
              description="Your performance"
              isLoading={isLoading}
            />
          </div>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>
                Your scheduled exams
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
              ) : upcomingExams.length > 0 ? (
                <div className="space-y-4">
                  {upcomingExams.slice(0, 5).map((exam) => (
                    <div key={exam.exam_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{exam.exam_name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(exam.exam_date).toLocaleString()}
                            <span className="mx-2">•</span>
                            <span>Duration: {exam.exam_duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/student/exams/${exam.exam_id}/take`}>
                          Take Exam
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {upcomingExams.length > 5 && (
                    <Button variant="link" className="mt-2" asChild>
                      <Link to="/student/exams">View all exams</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No upcoming exams scheduled
                </div>
              )}
            </CardContent>
          </Card>

          {/* Courses Overview */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Your enrolled courses
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
                        <Link to={`/student/courses/${course.course_id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {courses.length > 5 && (
                    <Button variant="link" className="mt-2" asChild>
                      <Link to="/student/courses">View all courses</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No courses enrolled yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Your enrolled courses and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[100px]" />
                      <div className="pt-2">
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course.course_id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{course.course_name}</h3>
                        <Badge variant="outline">{course.course_code}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.description || "No description available"}
                      </p>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>N/A</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/student/courses/${course.course_id}`}>
                            View Course
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  You are not enrolled in any courses
                </div>
              )}
            </CardContent>
            {courses && courses.length > 0 && (
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/student/courses">
                    View All Courses
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exam Schedule</CardTitle>
              <CardDescription>
                Your upcoming and past exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingExams ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-8 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : exams && exams.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4">Upcoming Exams</h3>
                    {upcomingExams.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingExams.map((exam) => (
                          <div key={exam.exam_id} className="space-y-2 border-b pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{exam.exam_name}</h4>
                              <Badge>{exam.course_code}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(exam.exam_date).toLocaleString()}
                              <span className="mx-2">•</span>
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Duration: {exam.exam_duration}</span>
                            </div>
                            <div className="pt-2 flex justify-end">
                              <Button size="sm" asChild>
                                <Link to={`/student/exams/${exam.exam_id}/take`}>
                                  Take Exam
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        No upcoming exams
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Past Exams</h3>
                    {pastExams.length > 0 ? (
                      <div className="space-y-4">
                        {pastExams.map((exam) => (
                          <div key={exam.exam_id} className="space-y-2 border-b pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{exam.exam_name}</h4>
                              <Badge variant="outline">{exam.course_code}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(exam.exam_date).toLocaleString()}
                              <span className="mx-2">•</span>
                              <span>Status: {exam.submitted ? "Submitted" : "Missed"}</span>
                            </div>
                            <div className="pt-2 flex justify-end">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/student/exams/${exam.exam_id}`}>
                                  View Results
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        No past exams
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No exams scheduled
                </div>
              )}
            </CardContent>
            {exams && exams.length > 0 && (
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/student/exams">
                    View All Exams
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
