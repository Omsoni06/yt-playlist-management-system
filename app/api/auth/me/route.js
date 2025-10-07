import { NextResponse } from "next/server";
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

    return NextResponse.json({
      success: true,
      user: authResult.user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
