
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Auth Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMajors from "@/pages/admin/Majors";
import AdminCourses from "@/pages/admin/Courses";
import AdminDoctors from "@/pages/admin/Doctors";
import AdminStudents from "@/pages/admin/Students";
import AdminUsers from "@/pages/admin/Users";
import AdminStatistics from "@/pages/admin/Statistics";
import AdminSettings from "@/pages/admin/Settings";

// Doctor Pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorCourses from "@/pages/doctor/Courses";
import DoctorQuestions from "@/pages/doctor/Questions";
import DoctorExams from "@/pages/doctor/Exams";
import DoctorGrading from "@/pages/doctor/Grading";
import DoctorStudents from "@/pages/doctor/Students";
import DoctorReports from "@/pages/doctor/Reports";
import DoctorSettings from "@/pages/doctor/Settings";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentCourses from "@/pages/student/Courses";
import StudentExams from "@/pages/student/Exams";
import StudentSchedule from "@/pages/student/Schedule";
import StudentGrades from "@/pages/student/Grades";
import StudentProfile from "@/pages/student/Profile";
import StudentSettings from "@/pages/student/Settings";
import ExamView from "@/pages/student/ExamView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout role="admin" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="majors" element={<AdminMajors />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Doctor Routes */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DashboardLayout role="doctor" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="courses" element={<DoctorCourses />} />
                <Route path="questions" element={<DoctorQuestions />} />
                <Route path="exams" element={<DoctorExams />} />
                <Route path="grading" element={<DoctorGrading />} />
                <Route path="students" element={<DoctorStudents />} />
                <Route path="reports" element={<DoctorReports />} />
                <Route path="settings" element={<DoctorSettings />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <DashboardLayout role="student" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="exams" element={<StudentExams />} />
                <Route path="schedule" element={<StudentSchedule />} />
                <Route path="grades" element={<StudentGrades />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Special exam view page (full screen) */}
              <Route
                path="/student/exams/:examId/take"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <ExamView />
                  </ProtectedRoute>
                }
              />
              
              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
