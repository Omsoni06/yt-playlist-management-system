import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/auth";
import { generateQuizFromNotes } from "@/lib/gemini";

export async function POST(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { videoTitle, notes } = await request.json();

    if (!notes || notes.length === 0) {
      return NextResponse.json(
        { error: "Notes are required to generate quiz" },
        { status: 400 }
      );
    }

    const quiz = await generateQuizFromNotes(videoTitle, notes);

    if (!quiz) {
      return NextResponse.json(
        { error: "Failed to generate quiz" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
