"use client";

import React from "react";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  return (
    <nav className="h-16 bg-white shadow-md flex items-center justify-between px-6 sticky top-0 z-60 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-black">CMS GRABSMART</h1>

      <button
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          // Close icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </nav>
  );
}
