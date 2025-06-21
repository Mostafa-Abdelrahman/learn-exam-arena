
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Edit, Trash2, GraduationCap } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  showActions?: boolean;
  variant?: 'admin' | 'doctor' | 'student';
}

const CourseCard = ({ course, onEdit, onDelete, showActions = true, variant = 'admin' }: CourseCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <CardDescription className="text-sm font-medium text-primary">
              {course.code}
            </CardDescription>
          </div>
          <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
            {course.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}
        
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>Credits</span>
            </div>
            <span className="font-semibold">{course.credits}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Students</span>
            </div>
            <span className="font-semibold">{course.student_count || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>Semester</span>
            </div>
            <span className="font-semibold">{course.semester}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(course)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && variant === 'admin' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(course.id)}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
