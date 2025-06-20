
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  course?: {
    name: string;
    code: string;
  };
  submission_count?: number;
}

interface ExamSelectorProps {
  exams: Exam[];
  isLoading: boolean;
  selectedExam: string;
  onSelectExam: (examId: string) => void;
}

const ExamSelector = ({ exams, isLoading, selectedExam, onSelectExam }: ExamSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Exam to Grade</CardTitle>
        <CardDescription>Choose an exam to view and grade student submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {exams?.map((exam) => (
              <Card 
                key={exam.id} 
                className={`cursor-pointer transition-colors ${
                  selectedExam === exam.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelectExam(exam.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{exam.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exam.course?.name} ({exam.course?.code})
                      </p>
                    </div>
                    <Badge variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      {exam.submission_count || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamSelector;
