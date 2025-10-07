"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function DashboardStats({ analytics }) {
  if (!analytics) return null;

  const stats = [
    {
      title: "Total Courses",
      value: analytics.totalCourses,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      value: analytics.completedCourses,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Study Streak",
      value: `${analytics.studyStreak} days`,
      icon: TrendingUp,
      color: "text-orange-500",
    },
    {
      title: "Time Spent",
      value: `${Math.round(analytics.totalTimeSpent / 3600)}h`,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  const overallProgress =
    analytics.totalVideos > 0
      ? Math.round((analytics.completedVideos / analytics.totalVideos) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Learning Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={overallProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {analytics.completedVideos} of {analytics.totalVideos} videos
            completed ({overallProgress}%)
          </p>
        </CardContent>
      </Card>

      {Object.keys(analytics.categoryStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.categoryStats).map(
                ([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} courses
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
