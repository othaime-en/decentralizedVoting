import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";

import { Sidebar, Navbar } from "./components";
import {
  CampaignDetails,
  CreateInstance,
  Home,
  Profile,
  Analytics,
  InstanceConfigDetails,
  Landing,
} from "./pages";

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    // Add any authentication check here if needed
    // For now, just render the children
    return children;
  };

  // App layout component
  const AppLayout = ({ children }) => (
    <div className={`relative min-h-screen flex flex-row transition-colors duration-300 ${
      isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'
    }`}>
      <div className="sm:flex hidden relative">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-[2000px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
  
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />
      
      {/* Main App - All routes under /app */}
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout>
            <Navigate to="/app/home" replace />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/home" element={
        <ProtectedRoute>
          <AppLayout>
            <Home />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/create-instance" element={
        <ProtectedRoute>
          <AppLayout>
            <CreateInstance />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/instance-details/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <CampaignDetails />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/instance-config/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <InstanceConfigDetails />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/analytics" element={
        <ProtectedRoute>
          <AppLayout>
            <Analytics />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
