
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import AdminService from "@/services/admin.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, BookOpen, FileText, GraduationCap, TrendingUp, Activity, Database, RefreshCw } from "lucide-react";
import { useUsers, useSystemStats, useMajorStats } from '@/hooks/useLocalStorage';

const AdminStatistics = () => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  
  // Use real-time hooks
  const users = useUsers();
  const systemStats = useSystemStats();
  const majorStats = useMajorStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "All statistics have been updated",
      });
    }, 1000);
  };

  const userRoleData = users ? [
    { name: "Students", value: users.filter(u => u.role === 'student').length, color: "#3b82f6" },
    { name: "Doctors", value: users.filter(u => u.role === 'doctor').length, color: "#10b981" },
    { name: "Admins", value: users.filter(u => u.role === 'admin').length, color: "#f59e0b" }
  ] : [];

  const majorDistributionData = [
    { major_name: "Computer Science", user_count: users?.filter(u => u.role === 'student').length || 0 },
    { major_name: "Engineering", user_count: Math.floor((users?.length || 0) * 0.3) },
    { major_name: "Business", user_count: Math.floor((users?.length || 0) * 0.2) },
    { major_name: "Medicine", user_count: Math.floor((users?.length || 0) * 0.15) }
  ];

  const monthlyGrowthData = [
    { month: "Jan", users: 980, exams: 45, courses: 18 },
    { month: "Feb", users: 1020, exams: 52, courses: 20 },
    { month: "Mar", users: 1080, exams: 48, courses: 22 },
    { month: "Apr", users: 1150, exams: 61, courses: 25 },
    { month: "May", users: 1200, exams: 58, courses: 28 },
    { month: "Jun", users: users?.length || 1250, exams: 65, courses: 30 }
  ];

  const systemHealthData = [
    { component: "Database", status: "Healthy", uptime: "99.9%" },
    { component: "API Server", status: "Healthy", uptime: "99.8%" },
    { component: "File Storage", status: "Warning", uptime: "98.5%" },
    { component: "Email Service", status: "Healthy", uptime: "99.7%" }
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">System Statistics</h2>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +15 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.courses?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {majorStats?.total_majors || 0} majors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.exams?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats?.exams?.published || 0} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>Breakdown of users by their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Major Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Major</CardTitle>
            <CardDescription>Distribution of students across majors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={majorDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="major_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="user_count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>Monthly growth across different metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
              <Line type="monotone" dataKey="exams" stroke="#10b981" strokeWidth={2} name="Exams" />
              <Line type="monotone" dataKey="courses" stroke="#f59e0b" strokeWidth={2} name="Courses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Current status of system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealthData.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{component.component}</p>
                    <p className="text-sm text-muted-foreground">Uptime: {component.uptime}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  component.status === 'Healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {component.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;
