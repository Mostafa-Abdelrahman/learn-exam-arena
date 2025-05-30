
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UpcomingExamsListProps {
  upcomingExams: Exam[];
  onViewExamDetails: (examId: string) => void;
}

const UpcomingExamsList = ({ upcomingExams, onViewExamDetails }: UpcomingExamsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Exams</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingExams.length > 0 ? (
          <div className="space-y-3">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{exam.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {exam.course?.name} - {new Date(exam.exam_date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onViewExamDetails(exam.id)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming exams</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingExamsList;
