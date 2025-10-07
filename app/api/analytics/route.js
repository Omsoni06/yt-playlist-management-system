import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Progress from "@/lib/models/Progress";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/middleware/auth";

export async function GET(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const courses = await Course.find({ userId: authResult.user._id });
    const progressRecords = await Progress.find({
      userId: authResult.user._id,
    });
    const user = await User.findById(authResult.user._id);

    const totalCourses = courses.length;
    const completedCourses = progressRecords.filter(
      (p) => p.isCompleted
    ).length;
    const inProgressCourses = progressRecords.filter(
      (p) => p.completionPercentage > 0 && !p.isCompleted
    ).length;

    const totalVideos = progressRecords.reduce(
      (sum, p) => sum + p.totalVideos,
      0
    );
    const completedVideos = progressRecords.reduce(
      (sum, p) => sum + p.completedVideos,
      0
    );
    const totalTimeSpent = progressRecords.reduce(
      (sum, p) => sum + p.totalTimeSpent,
      0
    );

    const categoryStats = {};
    courses.forEach((course) => {
      const category = course.category || "Uncategorized";
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category]++;
    });

    const recentActivity = progressRecords
      .filter((p) => p.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      analytics: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalVideos,
        completedVideos,
        totalTimeSpent,
        studyStreak: user.studyStreak,
        categoryStats,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
