
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorService from "@/services/doctor.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, Download, TrendingUp, Users, Calendar, Award } from "lucide-react";

const DoctorReports = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [reportType, setReportType] = useState<string>("performance");

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["doctor-courses", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await DoctorService.getCourses(currentUser.id);
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["doctor-exams", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await DoctorService.getExams(currentUser.id);
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  // Sample data for charts
  const performanceData = [
    { exam: "Midterm 1", average: 78, students: 25 },
    { exam: "Quiz 1", average: 85, students: 25 },
    { exam: "Midterm 2", average: 82, students: 24 },
    { exam: "Final", average: 79, students: 23 },
  ];

  const trendData = [
    { month: "Jan", exams: 3, avgScore: 75 },
    { month: "Feb", exams: 4, avgScore: 78 },
    { month: "Mar", exams: 5, avgScore: 80 },
    { month: "Apr", exams: 6, avgScore: 82 },
    { month: "May", exams: 4, avgScore: 85 },
  ];

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Report has been exported successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select course and report type to view analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance Analysis</SelectItem>
              <SelectItem value="trends">Grade Trends</SelectItem>
              <SelectItem value="participation">Student Participation</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Exam completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exam Performance</CardTitle>
            <CardDescription>Average scores by exam</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exam" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Trends</CardTitle>
            <CardDescription>Monthly average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exam Results</CardTitle>
          <CardDescription>Performance breakdown of recent exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingExams ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))
            ) : exams && exams.length > 0 ? (
              exams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{exam.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exam.course?.name} • {new Date(exam.exam_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {Math.floor(Math.random() * 25) + 15} students
                    </Badge>
                    <Badge variant={
                      Math.random() > 0.7 ? "default" : 
                      Math.random() > 0.4 ? "secondary" : "outline"
                    }>
                      {Math.floor(Math.random() * 20) + 70}% avg
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No exam data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorReports;
