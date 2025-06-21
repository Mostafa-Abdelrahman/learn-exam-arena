import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  role?: "admin" | "doctor" | "student";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role: propRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Use the role from props or from the current user
  const role = propRole || (currentUser?.role as "admin" | "doctor" | "student");

  // Redirect to login if user is not authenticated or role is not known
  if (!isAuthenticated || !currentUser || !role) {
    return <Navigate to="/login" replace />;
  }

  // Validate that the role is one of the expected values
  const validRoles = ["admin", "doctor", "student"];
  if (!validRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - show by default on desktop, controlled by state on mobile */}
      <div
        className={`${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar role={role} closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
        
        {/* Overlay to close sidebar on mobile when clicked */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
