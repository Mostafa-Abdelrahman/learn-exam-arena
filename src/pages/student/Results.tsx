
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, FileText, Clock } from "lucide-react";
import { getFromStorage, STORAGE_KEYS } from "@/data/exam-data";

interface ExamResult {
  id: string;
  exam_id: string;
  score: number;
  submitted_at: string;
  answers: any[];
}

const StudentResults = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const examResults = getFromStorage(STORAGE_KEYS.EXAM_RESULTS, []);
    const examData = getFromStorage(STORAGE_KEYS.EXAMS, []);
    setResults(examResults);
    setExams(examData);
  };

  const getExamDetails = (examId: string) => {
    return exams.find(exam => exam.id === examId);
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

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Exam Results</h2>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No exam results available yet. Take some exams to see your results here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const exam = getExamDetails(result.exam_id);
            const gradeBadge = getGradeBadge(result.score);
            
            if (!exam) return null;

            return (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{exam.name}</CardTitle>
                    <Badge variant={gradeBadge.variant}>
                      {gradeBadge.label}
                    </Badge>
                  </div>
                  {exam.course && (
                    <p className="text-sm text-muted-foreground">
                      {exam.course.name} ({exam.course.code})
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score Display */}
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className={`h-6 w-6 ${getGradeColor(result.score)}`} />
                      <span className={`text-3xl font-bold ${getGradeColor(result.score)}`}>
                        {result.score}%
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
                      <span>{result.answers.length} answered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.total_marks || 100} total marks</span>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions Answered:</span>
                      <span className="font-medium">
                        {result.answers.length} / {exam.questions?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${result.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.score >= 60 ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Overall Statistics */}
      {results.length > 0 && (
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
                  {Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)}%
                </div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...results.map(r => r.score))}%
                </div>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {results.filter(r => r.score >= 60).length}
                </div>
                <p className="text-sm text-muted-foreground">Passed Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentResults;
