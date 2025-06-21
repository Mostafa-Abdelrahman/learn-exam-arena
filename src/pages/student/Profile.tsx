import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trophy, Award } from "lucide-react";

const StudentProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load data when component mounts
    console.log("Student Profile component mounted");
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile management features will be implemented here.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm"><strong>Name:</strong> Student Name</p>
              <p className="text-sm"><strong>Email:</strong> student@university.edu</p>
              <p className="text-sm"><strong>Role:</strong> Student</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate("/student/results")}
              className="w-full justify-start"
              variant="outline"
            >
              <Award className="mr-2 h-4 w-4" />
              View Exam Results
            </Button>
            <Button 
              onClick={() => navigate("/student/grades")}
              className="w-full justify-start"
              variant="outline"
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Grades
            </Button>
            <Button 
              onClick={() => navigate("/student/exams")}
              className="w-full justify-start"
              variant="outline"
            >
              <User className="mr-2 h-4 w-4" />
              Take Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
