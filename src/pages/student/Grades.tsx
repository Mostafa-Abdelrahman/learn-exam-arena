import { useState, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import { 
  Loader2, 
  Search, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  Download,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

// Types
interface Grade {
  id: string;
  grade_id: string;
  student_id: string;
  exam_id: string;
  score: number;
  percentage: number;
  feedback?: string;
  graded_by?: string;
  created_at: string;
  updated_at: string;
  exam: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface GradeStats {
  averageGrade: number;
  totalExams: number;
  passedExams: number;
  passRate: number;
  highestGrade: number;
  lowestGrade: number;
  recentGrades: Grade[];
}

// Utility functions
const getGradeBadgeVariant = (score: number): "default" | "secondary" | "outline" | "destructive" => {
  if (score >= 90) return "default";
  if (score >= 80) return "secondary";
  if (score >= 70) return "outline";
  if (score >= 60) return "outline";
  return "destructive";
};

const getGradeLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Pass";
  return "Fail";
};

const getGradeColor = (score: number): string => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
};

// Components
const GradeStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  className = "" 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const GradeTable = ({ 
  grades, 
  isLoading, 
  error, 
  onRetry
}: {
  grades: Grade[];
  isLoading: boolean;
  error: any;
  onRetry: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading grades</h3>
        <p>{error.message || 'Failed to load grades. Please try again.'}</p>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No grades available</h3>
        <p>You haven't received any grades yet.</p>
      </div>
    );
  }

  return (
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
          {grades.map((grade) => (
            <TableRow key={`grade-${grade.id || grade.grade_id}`}>
              <TableCell className="font-medium">
                {grade.exam?.name || 'Unknown Exam'}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {grade.exam?.course?.name || 'Unknown Course'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {grade.exam?.course?.code || 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={`text-lg font-bold ${getGradeColor(grade.score || grade.percentage || 0)}`}>
                  {grade.score || grade.percentage || 0}%
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getGradeBadgeVariant(grade.score || grade.percentage || 0)}>
                  {getGradeLabel(grade.score || grade.percentage || 0)}
                </Badge>
              </TableCell>
              <TableCell>
                {grade.created_at && format(new Date(grade.created_at), "PPP")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StudentGrades = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "grade" | "course">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch grades data
  const { 
    data: grades = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["student-grades", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        console.log('Fetching grades for student:', currentUser.id);
        const response = await StudentService.getStudentGrades(currentUser.id);
        console.log('Grades response:', response);
        return response.data;
      } catch (error) {
        console.error('Error fetching grades:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized calculations
  const filteredAndSortedGrades = useMemo(() => {
    let filtered = grades.filter((grade: Grade) =>
      (grade.exam?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (grade.exam?.course?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (grade.exam?.course?.code?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Sort grades
    filtered.sort((a: Grade, b: Grade) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "grade":
          aValue = a.score || a.percentage || 0;
          bValue = b.score || b.percentage || 0;
          break;
        case "course":
          aValue = a.exam?.course?.name || '';
          bValue = b.exam?.course?.name || '';
          break;
        case "date":
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [grades, searchTerm, sortBy, sortOrder]);

  const stats = useMemo((): GradeStats => {
    if (!grades.length) {
      return {
        averageGrade: 0,
        totalExams: 0,
        passedExams: 0,
        passRate: 0,
        highestGrade: 0,
        lowestGrade: 0,
        recentGrades: [],
      };
    }

    const scores = grades.map((grade: Grade) => grade.score || grade.percentage || 0);
    const averageGrade = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const totalExams = grades.length;
    const passedExams = scores.filter(score => score >= 60).length;
    const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
    const highestGrade = Math.max(...scores);
    const lowestGrade = Math.min(...scores);
    const recentGrades = grades.slice(0, 5);

    return {
      averageGrade,
      totalExams,
      passedExams,
      passRate,
      highestGrade,
      lowestGrade,
      recentGrades,
    };
  }, [grades]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "Grades refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh grades",
        variant: "destructive",
      });
    }
  }, [refetch, toast]);

  const handleExport = useCallback(() => {
    // Mock export functionality
    toast({
      title: "Export",
      description: "Grade export functionality would be implemented here",
    });
  }, [toast]);

  const handleSort = useCallback((field: "date" | "grade" | "course") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }, [sortBy, sortOrder]);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Grades</h2>
          <p className="text-muted-foreground">
            Track your academic performance and progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grades..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("date")}
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortBy === "grade" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("grade")}
          >
            Grade {sortBy === "grade" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortBy === "course" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort("course")}
          >
            Course {sortBy === "course" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GradeStatsCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          subtitle="Overall performance"
          icon={TrendingUp}
        />
        <GradeStatsCard
          title="Total Exams"
          value={stats.totalExams}
          subtitle="Graded exams"
          icon={BookOpen}
        />
        <GradeStatsCard
          title="Passed Exams"
          value={`${stats.passedExams}/${stats.totalExams}`}
          subtitle="Success rate"
          icon={Trophy}
        />
        <GradeStatsCard
          title="Pass Rate"
          value={`${stats.passRate}%`}
          subtitle="Overall success"
          icon={Calendar}
        />
      </div>

      {/* Additional Stats */}
      {stats.totalExams > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Highest Grade:</span>
                <span className={`font-bold ${getGradeColor(stats.highestGrade)}`}>
                  {stats.highestGrade}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lowest Grade:</span>
                <span className={`font-bold ${getGradeColor(stats.lowestGrade)}`}>
                  {stats.lowestGrade}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentGrades.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentGrades.map((grade) => (
                    <div key={grade.id} className="flex justify-between items-center">
                      <span className="text-sm truncate">{grade.exam?.name}</span>
                      <Badge variant={getGradeBadgeVariant(grade.score || grade.percentage || 0)}>
                        {grade.score || grade.percentage || 0}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent grades</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
          <CardDescription>
            Your performance in each exam ({filteredAndSortedGrades.length} results)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GradeTable 
            grades={filteredAndSortedGrades} 
            isLoading={isLoading} 
            error={error} 
            onRetry={handleRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGrades; 