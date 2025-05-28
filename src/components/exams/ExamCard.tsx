
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (examId: string) => void;
}

const ExamCard = ({ exam, onEdit, onDelete }: ExamCardProps) => {
  return (
    <Card key={exam.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{exam.name}</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(exam)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(exam.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Course:</span>
            <span>{exam.course?.name} ({exam.course?.code})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{exam.status}</span>
          </div>
        </div>
        <div className="text-sm mb-2">
          <span className="font-medium">Date:</span> {format(new Date(exam.exam_date), 'PPP')}
        </div>
        <div className="text-sm">
          <span className="font-medium">Duration:</span> {exam.duration}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamCard;
