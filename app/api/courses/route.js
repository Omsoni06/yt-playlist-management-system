import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Progress from "@/lib/models/Progress";
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const favorite = searchParams.get("favorite");

    let query = { userId: authResult.user._id };

    if (category && category !== "all") {
      query.category = category;
    }

    if (favorite === "true") {
      query.isFavorite = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { channelTitle: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query).sort({ lastAccessedAt: -1 });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await Progress.findOne({
          userId: authResult.user._id,
          courseId: course._id,
        });

        return {
          ...course.toObject(),
          progress: progress
            ? {
                completionPercentage: progress.completionPercentage,
                completedVideos: progress.completedVideos,
                totalVideos: progress.totalVideos,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      courses: coursesWithProgress,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("id");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 }
      );
    }

    await Course.findByIdAndDelete(courseId);
    await Progress.findOneAndDelete({ courseId });

    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
