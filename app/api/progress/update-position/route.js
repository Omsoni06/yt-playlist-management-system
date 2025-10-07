import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Progress from "@/lib/models/Progress";
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

    const { courseId, videoId, currentTime } = await request.json();

    if (!courseId || !videoId || currentTime === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find progress document
    let progress = await Progress.findOne({
      userId: authResult.user._id,
      courseId: courseId,
    });

    if (!progress) {
      // Create new progress if doesn't exist
      progress = new Progress({
        userId: authResult.user._id,
        courseId: courseId,
        videoProgress: [],
        totalVideos: 0,
        completedVideos: 0,
        completionPercentage: 0,
      });
    }

    // Update last watched video and timestamp
    progress.lastWatchedVideoId = videoId;
    progress.lastWatchedTimestamp = Math.floor(currentTime);
    progress.lastWatchedAt = new Date();

    // Find or create video progress entry
    let videoProgressIndex = progress.videoProgress.findIndex(
      (vp) => vp.videoId === videoId
    );

    if (videoProgressIndex === -1) {
      // Add new video progress
      progress.videoProgress.push({
        videoId: videoId,
        completed: false,
        watchedDuration: Math.floor(currentTime),
        lastPosition: Math.floor(currentTime),
        lastWatchedAt: new Date(),
      });
    } else {
      // Update existing video progress
      progress.videoProgress[videoProgressIndex].lastPosition =
        Math.floor(currentTime);
      progress.videoProgress[videoProgressIndex].watchedDuration = Math.max(
        progress.videoProgress[videoProgressIndex].watchedDuration || 0,
        Math.floor(currentTime)
      );
      progress.videoProgress[videoProgressIndex].lastWatchedAt = new Date();
    }

    await progress.save();

    return NextResponse.json({
      success: true,
      message: "Position saved",
      lastPosition: Math.floor(currentTime),
    });
  } catch (error) {
    console.error("Update position error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
