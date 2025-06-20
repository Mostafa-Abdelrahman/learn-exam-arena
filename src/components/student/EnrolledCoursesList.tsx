import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, LogOut, Loader2, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EnrolledCoursesListProps {
  enrolledCourses: any[];
  onViewExams: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
  unenrollingCourseId: string | null;
}

const EnrolledCoursesList = ({ 
  enrolledCourses, 
  onViewExams, 
  onUnenroll, 
  unenrollingCourseId 
}: EnrolledCoursesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
        <CardDescription>Courses you are currently enrolled in</CardDescription>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((enrollment) => (
              <Card key={enrollment.student_course_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{enrollment.course.course_name}</CardTitle>
                      <CardDescription>{enrollment.course.course_code}</CardDescription>
                    </div>
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrollment.course.description && (
                    <p className="text-sm text-muted-foreground">
                      {enrollment.course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {enrollment.course.student_count || 0}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {enrollment.course.exam_count || 0}
                      </div>
                      {enrollment.course.doctor && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {enrollment.course.doctor.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => onViewExams(enrollment.course.course_id)}
                    >
                      View Exams
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={unenrollingCourseId === enrollment.course.course_id}
                        >
                          {unenrollingCourseId === enrollment.course.course_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Unenroll from Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to unenroll from "{enrollment.course.course_name}"? 
                            This action cannot be undone and you will lose access to all course materials and exams.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onUnenroll(enrollment.course.course_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Unenroll
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default EnrolledCoursesList;
