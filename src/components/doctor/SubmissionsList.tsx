
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";

interface Submission {
  student_exam_answer_id: string;
  student_id: string;
  student_name: string;
  question_text: string;
  question_type: string;
  written_answer: string;
}

interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  selectedExam: string;
  onGradeSubmit: (studentId: string, examId: string, grade: number) => void;
}

const SubmissionsList = ({ submissions, isLoading, selectedExam, onGradeSubmit }: SubmissionsListProps) => {
  const [grades, setGrades] = useState<{ [key: string]: number }>({});

  const handleGradeChange = (studentId: string, examId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setGrades(prev => ({
        ...prev,
        [`${studentId}-${examId}`]: numValue,
      }));
    }
  };

  const handleSubmitGrade = (studentId: string, examId: string) => {
    const grade = grades[`${studentId}-${examId}`];
    if (grade !== undefined) {
      onGradeSubmit(studentId, examId, grade);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="mx-auto h-12 w-12 mb-4" />
            <p>No submissions found for this exam</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
        <CardDescription>Review and grade student answers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.student_exam_answer_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.student_name}</CardTitle>
                    <CardDescription>{submission.question_text}</CardDescription>
                  </div>
                  <Badge variant="secondary">{submission.question_type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Student Answer:</h4>
                  <Textarea
                    value={submission.written_answer}
                    readOnly
                    className="min-h-[100px] bg-muted"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Grade (0-100):</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      className="w-20"
                      value={grades[`${submission.student_id}-${selectedExam}`] || ''}
                      onChange={(e) => handleGradeChange(submission.student_id, selectedExam, e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitGrade(submission.student_id, selectedExam)}
                    size="sm"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit Grade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
