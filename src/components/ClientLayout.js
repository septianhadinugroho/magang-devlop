"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmDialogProvider } from "@/lib/ConfirmDialogContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 p-6 bg-gray-100 overflow-y-auto",
            isSidebarOpen ? "md:ml-" : "md:ml-0",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <ConfirmDialogProvider>
            {children}
            <ConfirmDialog />
          </ConfirmDialogProvider>
          <Toaster />
        </main>
        {/* <div className="fixed bottom-0 right-0 w-full bg-white shadow border-t py-[22px] md:py-[24px] px-4">
  <div className="flex justify-end">
    <h1 className="text-sm">
      © {new Date().getFullYear()} <span className="font-bold">TRI DEV</span>. All rights reserved.
    </h1>
  </div>
</div> */}
      </div>
    </div>
  );
}
