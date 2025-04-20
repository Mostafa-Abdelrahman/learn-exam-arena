
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  FileText,
  User,
  GraduationCap,
  School,
  Award,
} from "lucide-react";
import UserService from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon, description, isLoading = false }) => {
  const Icon = icon;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { toast } = useToast();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["system-stats"],
    queryFn: async () => {
      try {
        const response = await UserService.getSystemStats();
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch system statistics",
          variant: "destructive",
        });
        return {
          users: { total: 0, admins: 0, doctors: 0, students: 0 },
          courses: { total: 0 },
          majors: { total: 0 },
          exams: { total: 0, published: 0, draft: 0 },
        };
      }
    },
  });

  // Mock data for the charts/stats if real data isn't loaded yet
  const defaultStats = {
    users: { total: 0, admins: 0, doctors: 0, students: 0 },
    courses: { total: 0 },
    majors: { total: 0 },
    exams: { total: 0, published: a0, draft: 0 },
  };

  const data = stats || defaultStats;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Create New User</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={data.users.total}
              icon={Users}
              description="Total registered users"
              isLoading={isLoading}
            />
            <StatCard
              title="Total Students"
              value={data.users.students}
              icon={GraduationCap}
              description="Registered students"
              isLoading={isLoading}
            />
            <StatCard
              title="Total Doctors"
              value={data.users.doctors}
              icon={User}
              description="Registered doctors"
              isLoading={isLoading}
            />
            <StatCard
              title="Total Courses"
              value={data.courses.total}
              icon={BookOpen}
              description="Available courses"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Majors"
              value={data.majors.total}
              icon={School}
              description="Academic majors"
              isLoading={isLoading}
            />
            <StatCard
              title="Total Exams"
              value={data.exams.total}
              icon={FileText}
              description="All exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Published Exams"
              value={data.exams.published}
              icon={Award}
              description="Active exams"
              isLoading={isLoading}
            />
            <StatCard
              title="Draft Exams"
              value={data.exams.draft}
              icon={FileText}
              description="Unpublished exams"
              isLoading={isLoading}
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No recent activity to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>
                System usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                Analytics data will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>
                Generate and view system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                Report generation tools will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
