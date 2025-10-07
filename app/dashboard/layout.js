"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">CourseFlow</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/courses">
                <Button variant="ghost">Courses</Button>
              </Link>
              <Link href="/add-course">
                <Button variant="ghost">Add Course</Button>
              </Link>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
