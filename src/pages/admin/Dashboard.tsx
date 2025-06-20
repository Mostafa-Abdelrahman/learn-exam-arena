import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminService, { SystemStats } from '@/services/admin.service';
import MajorService from '@/services/major.service';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, BookOpen, GraduationCap, Database } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["admin-system-stats"],
    queryFn: async () => {
      try {
        return await AdminService.getSystemStats();
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
        return null;
      }
    },
  });

  const { data: majorStats, isLoading: isLoadingMajorStats } = useQuery({
    queryKey: ["admin-major-stats"],
    queryFn: async () => {
      try {
        const response = await MajorService.getMajorStats();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch major stats:', error);
        return null;
      }
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
            <div className="text-2xl font-bold">{stats?.users?.total || 0}</div>
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
            <CardTitle className="text-sm font-medium">Active Majors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{majorStats?.active_majors || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Major Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Major Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMajorStats ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
          )}
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
    </div>
  );
};

export default AdminDashboard;
