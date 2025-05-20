import React from "react";
import { Route, Routes } from "react-router-dom";
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
} from "./pages";

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative min-h-screen flex flex-row transition-colors duration-300 ${
      isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'
    }`}>
      <div className="sm:flex hidden relative">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-[2000px] mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-instance" element={<CreateInstance />} />
            <Route path="/instance-details/:id" element={<CampaignDetails />} />
            <Route
              path="/instance-config/:id"
              element={<InstanceConfigDetails />}
            />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
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
