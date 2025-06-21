import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, FileText, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamService from "@/services/exam.service";

interface ExamResult {
  exam_id: string;
  exam_name: string;
  course_name: string;
  score: string;
  status: string;
  submitted_at: string;
}

const StudentResults = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      console.log('Fetching exam results...');
      
      const response = await ExamService.getStudentResults();
      console.log('Results response:', response);
      
      setResults(response.data || []);
    } catch (error: any) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error fetching results",
        description: error.message || "Failed to load exam results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", variant: "default" as const };
    if (score >= 80) return { label: "Good", variant: "secondary" as const };
    if (score >= 70) return { label: "Average", variant: "outline" as const };
    if (score >= 60) return { label: "Fair", variant: "outline" as const };
    return { label: "Needs Improvement", variant: "destructive" as const };
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((acc, result) => acc + parseFloat(result.score), 0);
    return Math.round(totalScore / results.length);
  };

  const getPassedExamsCount = () => {
    return results.filter(result => parseFloat(result.score) >= 60).length;
  };

  const getBestScore = () => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(result => parseFloat(result.score)));
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Exam Results</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No exam results available yet. Take some exams to see your results here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => {
              const score = parseFloat(result.score);
              const gradeBadge = getGradeBadge(score);
              
              return (
                <Card key={result.exam_id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{result.exam_name}</CardTitle>
                      <Badge variant={gradeBadge.variant}>
                        {gradeBadge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.course_name}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score Display */}
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <Trophy className={`h-6 w-6 ${getGradeColor(score)}`} />
                        <span className={`text-3xl font-bold ${getGradeColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Final Score</p>
                    </div>

                    {/* Exam Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(result.submitted_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(result.submitted_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{result.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>Graded</span>
                      </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                          {score >= 60 ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Grade:</span>
                        <span className="font-medium">{gradeBadge.label}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Overall Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {results.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Exams Taken</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {calculateAverageScore()}%
                  </div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {getBestScore()}%
                  </div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {getPassedExamsCount()}
                  </div>
                  <p className="text-sm text-muted-foreground">Passed Exams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentResults;
