
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
import AdminStatistics from "@/pages/admin/Statistics";

// Doctor Pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorExams from "@/pages/doctor/Exams";
import DoctorQuestions from "@/pages/doctor/Questions";
import DoctorCourses from "@/pages/doctor/Courses";
import DoctorStudents from "@/pages/doctor/Students";
import DoctorGrades from "@/pages/doctor/Grades";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentExams from "@/pages/student/Exams";
import StudentResults from "@/pages/student/Results";
import StudentCourses from "@/pages/student/Courses";
import StudentProfile from "@/pages/student/Profile";
import TakeExam from "@/pages/student/TakeExam";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  {/* Default redirect based on role */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Admin Routes */}
                  <Route path="admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/majors" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminMajors />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/courses" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCourses />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/doctors" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDoctors />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/students" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminStudents />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/statistics" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminStatistics />
                    </ProtectedRoute>
                  } />
                  
                  {/* Doctor Routes */}
                  <Route path="doctor/dashboard" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="doctor/exams" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorExams />
                    </ProtectedRoute>
                  } />
                  <Route path="doctor/questions" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorQuestions />
                    </ProtectedRoute>
                  } />
                  <Route path="doctor/courses" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorCourses />
                    </ProtectedRoute>
                  } />
                  <Route path="doctor/students" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorStudents />
                    </ProtectedRoute>
                  } />
                  <Route path="doctor/grades" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorGrades />
                    </ProtectedRoute>
                  } />
                  
                  {/* Student Routes */}
                  <Route path="student/dashboard" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="student/exams" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentExams />
                    </ProtectedRoute>
                  } />
                  <Route path="student/exams/:examId/take" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <TakeExam />
                    </ProtectedRoute>
                  } />
                  <Route path="student/results" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentResults />
                    </ProtectedRoute>
                  } />
                  <Route path="student/courses" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentCourses />
                    </ProtectedRoute>
                  } />
                  <Route path="student/profile" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Role-based dashboard redirect */}
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <Navigate to="/admin/dashboard" replace />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
