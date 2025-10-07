import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Progress from "@/lib/models/Progress";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/middleware/auth";

export async function POST(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { courseId, videoId, completed, watchedDuration } =
      await request.json();

    let progress = await Progress.findOne({
      userId: authResult.user._id,
      courseId,
    });

    if (!progress) {
      return NextResponse.json(
        { error: "Progress not found" },
        { status: 404 }
      );
    }

    const videoProgressIndex = progress.videoProgress.findIndex(
      (v) => v.videoId === videoId
    );

    if (videoProgressIndex !== -1) {
      progress.videoProgress[videoProgressIndex].completed = completed;
      progress.videoProgress[videoProgressIndex].watchedDuration =
        watchedDuration || 0;
      progress.videoProgress[videoProgressIndex].lastWatchedAt = Date.now();

      if (
        completed &&
        !progress.videoProgress[videoProgressIndex].completedAt
      ) {
        progress.videoProgress[videoProgressIndex].completedAt = Date.now();
      }
    }

    progress.updateProgress();
    await progress.save();

    if (progress.isCompleted) {
      await User.findByIdAndUpdate(authResult.user._id, {
        $inc: { coursesCompleted: 1 },
      });
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
