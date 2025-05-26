
import { useState, useEffect } from "react";
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
import {
  Loader2,
  Search,
  Trophy,
  TrendingUp,
  TrendingDown,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExamService from "@/services/exam.service";

const StudentResults = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: results, isLoading } = useQuery({
    queryKey: ["student-results"],
    queryFn: async () => {
      try {
        const response = await ExamService.getAllStudentResults();
        return response.data;
      } catch (error: any) {
        toast({
          title: "Error fetching results",
          description: error.message || "Could not load your exam results",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const filteredResults = results?.filter(result =>
    result.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const averageScore = results && results.length > 0 
    ? Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)
    : 0;

  const highestScore = results && results.length > 0 
    ? Math.max(...results.map(result => result.score))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "C+";
    if (score >= 70) return "C";
    if (score >= 65) return "D+";
    if (score >= 60) return "D";
    return "F";
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Exam Results</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search results..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Grade: {getGradeFromScore(averageScore)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(highestScore)}`}>
              {highestScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Grade: {getGradeFromScore(highestScore)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exams Taken</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total completed
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No results available
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No results match your search."
                : "You haven't completed any exams yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full relative overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.exam_id}>
                  <TableCell className="font-medium">{result.exam_name}</TableCell>
                  <TableCell>{result.course_name}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getScoreColor(result.score)}>
                      {getGradeFromScore(result.score)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={result.status === "graded" ? "default" : "secondary"}
                    >
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(result.submitted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to detailed result view
                        window.open(`/student/results/${result.exam_id}`, '_blank');
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
