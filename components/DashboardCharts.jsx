"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Clock, BookOpen, Award } from "lucide-react";

export default function DashboardCharts({ courses, progress }) {
  // Calculate stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => {
    const courseProgress = progress.find((p) => p.courseId === c._id);
    return courseProgress?.completionPercentage === 100;
  }).length;

  const inProgressCourses = totalCourses - completedCourses;

  // Pie chart data
  const pieData = [
    { name: "Completed", value: completedCourses, color: "#10b981" },
    { name: "In Progress", value: inProgressCourses, color: "#3b82f6" },
  ];

  // Weekly progress data (mock - you can make this real)
  const weeklyData = [
    { day: "Mon", videos: 3 },
    { day: "Tue", videos: 5 },
    { day: "Wed", videos: 2 },
    { day: "Thu", videos: 7 },
    { day: "Fri", videos: 4 },
    { day: "Sat", videos: 6 },
    { day: "Sun", videos: 3 },
  ];

  // Course progress data
  const courseProgressData = courses.slice(0, 5).map((course) => {
    const courseProgress = progress.find((p) => p.courseId === course._id);
    return {
      name: course.title.substring(0, 20) + "...",
      progress: courseProgress?.completionPercentage || 0,
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCourses}</div>
          <p className="text-xs text-muted-foreground">
            {completedCourses} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCourses > 0
              ? Math.round((completedCourses / totalCourses) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            {inProgressCourses} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7 days</div>
          <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24h</div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>

      {/* Pie Chart - Course Status */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Course Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Weekly Activity */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="videos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Course Progress */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseProgressData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="progress" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
