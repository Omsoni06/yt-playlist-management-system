import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Progress from "@/lib/models/Progress";
import { verifyToken } from "@/lib/middleware/auth";
import {
  extractPlaylistId,
  getPlaylistDetails,
  getPlaylistVideos,
  parseDuration,
} from "@/lib/youtube";

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

    const body = await request.json();
    const { playlistUrl, category, tags } = body;

    console.log("Received playlist URL:", playlistUrl);

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 }
      );
    }

    // Extract playlist ID (synchronous function)
    const playlistId = extractPlaylistId(playlistUrl);
    console.log("Extracted playlist ID:", playlistId);

    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid YouTube playlist URL" },
        { status: 400 }
      );
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({
      userId: authResult.user._id,
      playlistId: playlistId,
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "This playlist has already been imported" },
        { status: 400 }
      );
    }

    // Fetch playlist details
    console.log("Fetching playlist details...");
    const playlistDetails = await getPlaylistDetails(playlistId);
    console.log("Playlist details:", playlistDetails);

    // Fetch all videos
    console.log("Fetching playlist videos...");
    const videos = await getPlaylistVideos(playlistId);
    console.log(`Fetched ${videos.length} videos`);

    // Calculate total duration
    const totalDuration = videos.reduce((sum, video) => {
      return sum + parseDuration(video.duration);
    }, 0);

    // Create course
    const course = await Course.create({
      userId: authResult.user._id,
      playlistId: playlistId,
      playlistUrl: playlistUrl,
      title: playlistDetails.title,
      description: playlistDetails.description,
      channelTitle: playlistDetails.channelTitle,
      thumbnail: playlistDetails.thumbnail,
      videoCount: videos.length,
      videos: videos,
      category: category || "Uncategorized",
      tags: tags || [],
      totalDuration: totalDuration,
    });

    console.log("Course created:", course._id);

    // Create progress tracking
    const videoProgress = videos.map((video) => ({
      videoId: video.videoId,
      completed: false,
      watchedDuration: 0,
    }));

    await Progress.create({
      userId: authResult.user._id,
      courseId: course._id,
      videoProgress: videoProgress,
      totalVideos: videos.length,
      completedVideos: 0,
      completionPercentage: 0,
    });

    console.log("Progress tracking created");

    return NextResponse.json(
      {
        success: true,
        course: course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Import course error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to import course",
      },
      { status: 500 }
    );
  }
}
