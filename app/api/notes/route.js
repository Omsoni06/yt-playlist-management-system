import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Note from "@/lib/models/Note";
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

    const { courseId, videoId, videoTitle, content, timestamp, tags } =
      await request.json();

    const note = await Note.create({
      userId: authResult.user._id,
      courseId,
      videoId,
      videoTitle,
      content,
      timestamp,
      tags,
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

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
    const courseId = searchParams.get("courseId");
    const search = searchParams.get("search");

    let query = { userId: authResult.user._id };

    if (courseId) {
      query.courseId = courseId;
    }

    if (search) {
      query.content = { $regex: search, $options: "i" };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
