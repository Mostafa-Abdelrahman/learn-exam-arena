
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText } from "lucide-react";

interface AvailableCoursesListProps {
  availableCourses: any[];
  onEnroll: (courseId: string) => void;
}

const AvailableCoursesList = ({ availableCourses, onEnroll }: AvailableCoursesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Courses</CardTitle>
        <CardDescription>Courses available for enrollment</CardDescription>
      </CardHeader>
      <CardContent>
        {availableCourses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>All courses are either enrolled or no courses are available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.description && (
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrolled_students || 0}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {course.exam_count || 0}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => onEnroll(course.id)}
                  >
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableCoursesList;
