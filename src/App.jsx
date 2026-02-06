import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Blogs from "./components/Blogs";
import Careers from "./components/Careers";

const AppShell = () => {
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/blogs")) return "Blogs";
    if (location.pathname.startsWith("/careers")) return "Careers";
    return "Dashboard";
  }, [location.pathname]);

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/blogs"))
      return "Create and manage content for the public blog.";
    if (location.pathname.startsWith("/careers"))
      return "Placeholder for upcoming careers & job posting tools.";
    return "Simple CMS to manage Inflecto marketing content.";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar />

      <main className="flex-1 p-10 flex flex-col gap-8 bg-black">
        <header className="flex justify-between items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="text-3xl font-semibold text-white">{title}</div>
            <div className="text-sm text-[#a0a0a0] mt-1">{subtitle}</div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppShell;
