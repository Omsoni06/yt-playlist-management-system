"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">LearnHub</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master YouTube Learning with Smart Course Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform YouTube playlists into structured courses. Track progress,
            take notes, and achieve your learning goals efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-20">
            {[
              {
                icon: BookOpen,
                title: "Import Playlists",
                description:
                  "Paste any YouTube playlist URL and start tracking instantly",
              },
              {
                icon: CheckCircle,
                title: "Track Progress",
                description:
                  "Mark videos complete and visualize your learning journey",
              },
              {
                icon: Clock,
                title: "Time Management",
                description:
                  "Monitor study time and build consistent learning habits",
              },
              {
                icon: TrendingUp,
                title: "Stay Motivated",
                description:
                  "Track streaks, achievements, and course completion",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm space-y-3"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t mt-20">
        <p>© 2025 LearnHub. Track your YouTube learning journey efficiently.</p>
      </footer>
    </div>
  );
}
