import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Note from "@/lib/models/Note";
import { verifyToken } from "@/lib/middleware/auth";

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
    updates.updatedAt = Date.now();

    const note = await Note.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Update note error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    await Note.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
