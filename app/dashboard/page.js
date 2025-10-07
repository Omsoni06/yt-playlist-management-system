"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import CourseImport from "@/components/CourseImport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardCharts from "@/components/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Flame,
  Calendar,
  Award,
  ArrowRight,
  Play,
  BarChart3,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    fetchDashboardData();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [analyticsRes, coursesRes] = await Promise.all([
        fetch("/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const analyticsData = await analyticsRes.json();
      const coursesData = await coursesRes.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }

      if (coursesData.success) {
        setRecentCourses(coursesData.courses.slice(0, 6));
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const stats = analytics || {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalVideos: 0,
    completedVideos: 0,
    totalTimeSpent: 0,
    studyStreak: 0,
  };

  const completionRate =
    stats.totalVideos > 0
      ? Math.round((stats.completedVideos / stats.totalVideos) * 100)
      : 0;

  const categoryData = analytics?.categoryStats || {};
  const topCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-8">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 text-white">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1 bg-white/20 text-white border-white/30"
              >
                <Zap className="h-3 w-3" />
                Learning Dashboard
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {greeting}! 👋
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <CourseImport />
              <Link href="/courses">
                <Button variant="secondary" size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Courses */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stats.inProgressCourses} in progress</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Courses */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-3xl font-bold">{stats.completedCourses}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Award className="h-3 w-3" />
                    <span>{completionRate}% completion rate</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Study Streak
                  </p>
                  <p className="text-3xl font-bold">{stats.studyStreak}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>days in a row</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Spent */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Time Spent
                  </p>
                  <p className="text-3xl font-bold">
                    {Math.round(stats.totalTimeSpent / 3600)}h
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>total learning time</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Overall Progress Card */}
          <Card className="lg:col-span-2 border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Overall Learning Progress
                </CardTitle>
                <Badge variant="secondary">{completionRate}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Progress value={completionRate} className="h-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stats.completedVideos} of {stats.totalVideos} videos
                    completed
                  </span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">
                    {stats.totalCourses}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total Courses
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {stats.completedCourses}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {stats.inProgressCourses}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map(([category, count], index) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-green-500"
                                : index === 2
                                ? "bg-orange-500"
                                : index === 3
                                ? "bg-purple-500"
                                : "bg-pink-500"
                            }`}
                          ></div>
                          <span className="font-medium">{category}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                      <Progress
                        value={(count / stats.totalCourses) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No category data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning Section */}
        {recentCourses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Play className="h-6 w-6 text-primary" />
                  Continue Learning
                </h2>
                <p className="text-muted-foreground mt-1">
                  Pick up where you left off
                </p>
              </div>
              <Link href="/courses">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentCourses.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Import your first YouTube playlist and begin tracking your
                progress with powerful learning tools.
              </p>
              <CourseImport />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group">
            <Link href="/courses">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Browse Courses</h3>
                    <p className="text-sm text-muted-foreground">
                      View all your courses
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.completedCourses} courses completed
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Study Streak</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.studyStreak} days streak
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
