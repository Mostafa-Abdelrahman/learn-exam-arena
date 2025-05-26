
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  BookOpen,
  Users,
  FileText,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import DoctorService from "@/services/doctor.service";

const DoctorCourses = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["doctor-courses", currentUser?.id],
    queryFn: async () => {
      try {
        if (!currentUser) return [];
        const response = await DoctorService.getCourses(currentUser.id);
        return response.data;
      } catch (error: any) {
        toast({
          title: "Error fetching courses",
          description: error.message || "Could not load your courses",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const filteredCourses = courses?.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No courses assigned
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No courses match your search."
                : "You don't have any courses assigned yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {course.code}
                    </CardDescription>
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Students</span>
                    </div>
                    <span className="font-semibold">{course.student_count || 0}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    View Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorCourses;
