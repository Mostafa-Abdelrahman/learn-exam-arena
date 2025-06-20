

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import DoctorService from "@/services/doctor.service";
import { Loader2, Search, Eye, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DoctorStudents = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["doctor-students", currentUser?.id],
    queryFn: async () => {
      try {
        if (!currentUser) return [];
        const response = await DoctorService.getStudents(currentUser.id);
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((student as any).major?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Students</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Students in Your Courses</CardTitle>
          <CardDescription>
            Manage and view students enrolled in your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="w-full relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Major</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell>{(student as any).major?.name || "N/A"}</TableCell>
                      <TableCell>{(student as any).course?.name || "N/A"}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getGradeColor((student as any).current_grade || 0)}`}>
                          {(student as any).current_grade ? `${(student as any).current_grade}%` : "No grade"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(student as any).status === 'active' ? 'default' : 'secondary'}>
                          {(student as any).status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorStudents;
