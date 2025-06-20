import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdminService, { SystemStats } from '@/services/admin.service';
import MajorService from '@/services/major.service';
import UserService, { UserFilters } from "@/services/user.service";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Users, BookOpen, GraduationCap, Database, Search, Plus, Edit, Trash2, Shield, UserCheck } from 'lucide-react';
import { CreateUserData, UpdateUserData, User } from "@/types/user";
import { useUsers, useSystemStats, useMajorStats } from '@/hooks/useLocalStorage';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "student" | "doctor" | "admin">("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: "student",
    gender: "male",
    major_id: ""
  });

  // Use real-time local storage hooks
  const users = useUsers();
  const stats = useSystemStats();
  const majorStats = useMajorStats();

  const { data: majors } = useQuery({
    queryKey: ["majors-for-users"],
    queryFn: async () => {
      try {
        const response = await MajorService.getAllMajors();
        return response.data;
      } catch (error) {
        return [];
      }
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => UserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => UserService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => UserService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Mock recent activities data
    const mockActivities: ActivityItem[] = [
      { id: '1', user: 'John Doe', action: 'Created a new course', timestamp: '2024-07-15 10:30' },
      { id: '2', user: 'Jane Smith', action: 'Updated exam settings', timestamp: '2024-07-15 09:45' },
      { id: '3', user: 'Admin', action: 'Cleared system cache', timestamp: '2024-07-14 16:20' },
    ];
    setRecentActivities(mockActivities);
  }, []);

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      gender: "male",
      major_id: ""
    });
    setSelectedUser(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateUserMutation.mutate({ id: selectedUser.id, data: updateData as UpdateUserData });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      gender: user.gender,
      major_id: (user as any).major_id || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const userCounts = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    doctors: users?.filter(u => u.role === 'doctor').length || 0,
    students: users?.filter(u => u.role === 'student').length || 0,
    active: users?.filter(u => u.status === 'active').length || 0
  };

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.courses?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Majors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{majorStats?.total_majors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div>
              <CardTitle>User Management</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={(value: "" | "student" | "doctor" | "admin") => setRoleFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <form onSubmit={handleCreateSubmit}>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value: "student" | "doctor" | "admin") => setFormData({...formData, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value: "male" | "female" | "other") => setFormData({...formData, gender: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(formData.role === 'student' || formData.role === 'doctor') && (
                        <div className="grid gap-2">
                          <Label htmlFor="major">Major (Optional)</Label>
                          <Select value={formData.major_id} onValueChange={(value) => setFormData({...formData, major_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select major" />
                            </SelectTrigger>
                            <SelectContent>
                              {majors?.map((major) => (
                                <SelectItem key={major.id} value={major.id}>
                                  {major.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create User
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full relative overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.slice(0, 10).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Major Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Major Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Students in Majors</div>
              <div className="text-2xl font-bold">{majorStats?.total_students || 0}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Courses in Majors</div>
              <div className="text-2xl font-bold">{majorStats?.total_courses || 0}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Average Students per Major</div>
              <div className="text-2xl font-bold">
                {majorStats?.total_majors ? 
                  Math.round(majorStats.total_students / majorStats.total_majors) : 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-2 border-b">
                <span className="font-medium">{activity.user}</span> {activity.action} -{' '}
                <span className="text-gray-500">{activity.timestamp}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">New Password (Leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: "student" | "doctor" | "admin") => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value: "male" | "female" | "other") => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(formData.role === 'student' || formData.role === 'doctor') && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-major">Major</Label>
                  <Select value={formData.major_id} onValueChange={(value) => setFormData({...formData, major_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors?.map((major) => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
