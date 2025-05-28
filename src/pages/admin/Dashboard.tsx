import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminService } from '@/services';
import type { SystemStats } from '@/services/admin.service';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock recent activities data
    const mockActivities: ActivityItem[] = [
      { id: '1', user: 'John Doe', action: 'Created a new course', timestamp: '2024-07-15 10:30' },
      { id: '2', user: 'Jane Smith', action: 'Updated exam settings', timestamp: '2024-07-15 09:45' },
      { id: '3', user: 'Admin', action: 'Cleared system cache', timestamp: '2024-07-14 16:20' },
    ];
    setRecentActivities(mockActivities);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const systemStats = await AdminService.getSystemStats();
        setStats(systemStats);
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-2xl font-bold">Admin Dashboard</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users?.admins || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users?.doctors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users?.students || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.courses?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Majors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.majors?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.exams?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.exams?.published || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.exams?.draft || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div>
        <div className="text-lg font-semibold mb-2">Recent Activities</div>
        <ul>
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-2 border-b">
              <span className="font-medium">{activity.user}</span> {activity.action} -{' '}
              <span className="text-gray-500">{activity.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
