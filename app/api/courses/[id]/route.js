import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/lib/models/Course";
import Progress from "@/lib/models/Progress";
import Note from "@/lib/models/Note";
import { verifyToken } from "@/lib/middleware/auth";

export async function GET(request, { params }) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const progress = await Progress.findOne({
      userId: authResult.user._id,
      courseId: params.id,
    });

    const notes = await Note.find({
      userId: authResult.user._id,
      courseId: params.id,
    }).sort({ createdAt: -1 });

    course.lastAccessedAt = Date.now();
    await course.save();

    return NextResponse.json({
      success: true,
      course,
      progress,
      notes,
    });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const updates = await request.json();

    const course = await Course.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
