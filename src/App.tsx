import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

// Auth Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMajors from "@/pages/admin/Majors";
import AdminCourses from "@/pages/admin/Courses";
import AdminCourseManagement from "@/pages/admin/AdminCourseManagement";
import AdminDoctors from "@/pages/admin/Doctors";
import AdminStudents from "@/pages/admin/Students";
import AdminStatistics from "@/pages/admin/Statistics";
import AdminSettings from "@/pages/admin/Settings";


// Doctor Pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorExams from "@/pages/doctor/Exams";
import DoctorQuestions from "@/pages/doctor/Questions";
import DoctorCourses from "@/pages/doctor/Courses";
import DoctorStudents from "@/pages/doctor/Students";
import DoctorGrading from "@/pages/doctor/Grading";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentExams from "@/pages/student/Exams";
import StudentResults from "@/pages/student/Results";
import StudentCourses from "@/pages/student/Courses";
import StudentProfile from "@/pages/student/Profile";
import TakeExam from "@/pages/student/TakeExam";
import DoctorReports from "./pages/doctor/Reports";
import DoctorSettings from "./pages/doctor/Settings";
import StudentSettings from "./pages/student/Settings";
import StudentSchedule from "./pages/student/Schedule";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  const role = currentUser.role;
  
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (role === 'doctor') {
    return <Navigate to="/doctor/dashboard" replace />;
  } else if (role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Root redirect */}
                <Route path="/" element={<RoleBasedRedirect />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout role="admin" />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="majors" element={<AdminMajors />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="course-management" element={<AdminCourseManagement />} />
                  <Route path="doctors" element={<AdminDoctors />} />
                  <Route path="students" element={<AdminStudents />} />
                  <Route path="statistics" element={<AdminStatistics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                
                <Route path="/doctor/*" element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DashboardLayout role="doctor" />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="exams" element={<DoctorExams />} />
                  <Route path="questions" element={<DoctorQuestions />} />
                  <Route path="courses" element={<DoctorCourses />} />
                  <Route path="students" element={<DoctorStudents />} />
                  <Route path="grading" element={<DoctorGrading />} />
                  <Route path="settings" element={<DoctorSettings />} />
                  <Route path="reports" element={<DoctorReports />} />
                </Route>
                
                <Route path="/student/*" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout role="student" />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="exams" element={<StudentExams />} />
                  <Route path="exams/:examId/take" element={<TakeExam />} />
                  <Route path="results" element={<StudentResults />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="settings" element={<StudentSettings />} />
                  <Route path="schedule" element={<StudentSchedule />} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
