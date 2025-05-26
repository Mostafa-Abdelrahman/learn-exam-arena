
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import { Loader2, Search, Trophy, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

const StudentGrades = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: grades, isLoading } = useQuery({
    queryKey: ["student-grades", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await StudentService.getGrades(currentUser.id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch grades",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const filteredGrades = grades?.filter(grade =>
    grade.exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.exam.course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.exam.course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const averageGrade = grades && grades.length > 0
    ? Math.round(grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length)
    : 0;

  const passedExams = grades?.filter(grade => grade.grade >= 60).length || 0;
  const totalExams = grades?.length || 0;

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 90) return "default";
    if (grade >= 80) return "secondary";
    if (grade >= 70) return "outline";
    if (grade >= 60) return "outline";
    return "destructive";
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return "Excellent";
    if (grade >= 80) return "Very Good";
    if (grade >= 70) return "Good";
    if (grade >= 60) return "Pass";
    return "Fail";
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Grades</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grades..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
            <p className="text-xs text-muted-foreground">
              Graded exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Exams</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passedExams}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalExams} exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
          <CardDescription>
            Your performance in each exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredGrades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No grades available</h3>
              <p>You haven't received any grades yet.</p>
            </div>
          ) : (
            <div className="w-full relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((gradeEntry) => (
                    <TableRow key={gradeEntry.grade_id}>
                      <TableCell className="font-medium">
                        {gradeEntry.exam.exam_name}
                      </TableCell>
                      <TableCell>
                        {gradeEntry.exam.course.course_name} ({gradeEntry.exam.course.course_code})
                      </TableCell>
                      <TableCell>
                        <div className="text-lg font-bold">
                          {gradeEntry.grade}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getGradeBadgeVariant(gradeEntry.grade)}>
                          {getGradeLabel(gradeEntry.grade)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {gradeEntry.created_at && format(new Date(gradeEntry.created_at), "PPP")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGrades;
