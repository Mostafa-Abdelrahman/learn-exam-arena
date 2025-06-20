
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import MajorService from '@/services/major.service';
import UserService, { CreateUserData, UpdateUserData } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from "@/types/user";
import { useUsers, useSystemStats, useMajorStats } from '@/hooks/useLocalStorage';
import StatsCards from '@/components/admin/StatsCards';
import UserManagementTable from '@/components/admin/UserManagementTable';
import UserFormDialog from '@/components/admin/UserFormDialog';

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
      setSelectedUser(null);
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

  const handleCreateSubmit = (formData: CreateUserData) => {
    createUserMutation.mutate(formData);
  };

  const handleEditSubmit = (formData: CreateUserData) => {
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
    setIsEditDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const userCounts = {
    total: users?.length || 0,
    active: users?.filter(u => u.status === 'active').length || 0
  };

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>

      {/* System Stats */}
      <StatsCards 
        userCounts={userCounts}
        courseCount={stats?.courses?.total || 0}
        majorCount={majorStats?.total_majors || 0}
      />

      {/* User Management Section */}
      <UserManagementTable 
        users={users || []}
        onCreateUser={() => setIsCreateDialogOpen(true)}
        onEditUser={handleEdit}
        onDeleteUser={handleDelete}
      />

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

      {/* Create Dialog */}
      <UserFormDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createUserMutation.isPending}
        majors={majors || []}
        title="Create New User"
        description="Add a new user to the system"
      />

      {/* Edit Dialog */}
      <UserFormDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
        isLoading={updateUserMutation.isPending}
        editUser={selectedUser}
        majors={majors || []}
        title="Edit User"
        description="Update user information"
      />
    </div>
  );
};

export default AdminDashboard;
