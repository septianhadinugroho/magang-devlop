"use client";

import {
  LayoutDashboard,
  Package,
  Store,
  Component,
  ShoppingBag,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function MenuItemLink({ item, pathname }) {
  const Icon = item.icon;

  // Cek apakah menu induk (yang punya anak) atau salah satu anaknya aktif
  const isParentActive =
    item.children && item.children.some((child) => pathname === child.href);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(isParentActive);

  // Buka submenu secara otomatis jika salah satu anaknya aktif saat navigasi
  useEffect(() => {
    if (isParentActive) {
      setIsSubMenuOpen(true);
    }
  }, [pathname, isParentActive]);

  if (item.children) {
    return (
      <div>
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer",
            "transition-colors duration-200",
            isParentActive
              ? "bg-black text-white"
              : "text-black hover:bg-gray-200 hover:text-black",
            "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          )}
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            {item.name}
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isSubMenuOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isSubMenuOpen && (
          <div className="pl-8 space-y-1 mt-1">
            {item.children.map((child) => (
              <MenuItemLink
                key={child.name}
                item={child}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg",
        "transition-colors duration-200",
        isActive
          ? "bg-black text-white"
          : "text-black hover:bg-gray-200 hover:text-black",
        "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      )}
    >
      <Icon className="h-5 w-5" />
      {item.name}
    </Link>
  );
}

export default function Sidebar({ isSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname(); // Panggil hook di sini, hanya sekali.

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      name: "Grab Food Management",
      icon: ShoppingBag,
      children: [
        { name: "Orders", icon: ShoppingBag, href: "/order" },
        { name: "Stores", icon: Store, href: "/store" },
        { name: "Categories", icon: Component, href: "/category" },
        { name: "Items", icon: Package, href: "/item" },
        { name: "Logs", icon: ScrollText, href: "/log" },
      ],
    },
    {
      name: "Grab Mart Management",
      icon: Store,
      children: [{ name: "Items", icon: Package, href: "/grabmart/item" }],
    },
  ];

  const onLogout = () => {
    document.cookie = `is_login=`;
    toast("Logged Out", {
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed md:static z-50 w-64 bg-white border-r border-gray-200 h-full",
        "transition-all duration-300 ease-in-out shadow-md",
        isSidebarOpen ? "left-0" : "-left-64",
        "md:left-0 md:flex md:flex-col"
      )}
    >
      {/* Sidebar Content Wrapper */}
      <div className="flex flex-col h-full">
        {/* Sidebar Menu */}
        <nav className="px-4 py-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuItemLink
              key={item.name}
              item={item}
              pathname={pathname} // Teruskan pathname sebagai prop
            />
          ))}
        </nav>

        {/* Footer with Logout button */}
        <div className="relative mb-[60px] md:mb-[0px]  p-4 border-t border-gray-200 mt-auto">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-black hover:bg-black hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}