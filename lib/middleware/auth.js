import jwt from "jsonwebtoken";
import User from "../models/User";
import connectDB from "../mongodb";

export async function verifyToken(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user };
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}

export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}
