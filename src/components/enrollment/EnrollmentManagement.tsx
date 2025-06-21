
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, UserMinus, Users } from "lucide-react";

interface EnrollmentRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  course_id: string;
  course_name: string;
  course_code: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'completed' | 'dropped';
}

interface EnrollmentManagementProps {
  enrollments: EnrollmentRecord[];
  onEnrollStudent: (studentId: string, courseId: string) => Promise<void>;
  onUnenrollStudent: (enrollmentId: string) => Promise<void>;
  onUpdateEnrollmentStatus: (enrollmentId: string, status: string) => Promise<void>;
}

const EnrollmentManagement = ({ 
  enrollments, 
  onEnrollStudent, 
  onUnenrollStudent, 
  onUpdateEnrollmentStatus 
}: EnrollmentManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'dropped':
        return 'destructive';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    try {
      await onUpdateEnrollmentStatus(enrollmentId, newStatus);
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Course Enrollments
            </CardTitle>
            <CardDescription>Manage student course enrollments</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search enrollments..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full relative overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.student_name}</div>
                      <div className="text-sm text-muted-foreground">{enrollment.student_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.course_name}</div>
                      <div className="text-sm text-muted-foreground">{enrollment.course_code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={enrollment.status} 
                      onValueChange={(value) => handleStatusChange(enrollment.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                          <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                            {enrollment.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUnenrollStudent(enrollment.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentManagement;
