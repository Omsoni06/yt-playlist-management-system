import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/auth";
import { generateVideoSummary } from "@/lib/gemini";

export async function POST(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { videoTitle, videoDescription, videoId } = await request.json();

    if (!videoTitle) {
      return NextResponse.json(
        { error: "Video title is required" },
        { status: 400 }
      );
    }

    // Pass videoId to get transcript-based summary
    const summary = await generateVideoSummary(
      videoTitle,
      videoDescription,
      videoId
    );

    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
