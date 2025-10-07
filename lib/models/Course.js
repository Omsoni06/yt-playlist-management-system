import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  thumbnail: String,
  duration: String,
  position: Number,
  publishedAt: Date,
});

const CourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  playlistUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  channelTitle: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  videoCount: {
    type: Number,
    default: 0,
  },
  videos: [VideoSchema],
  category: {
    type: String,
    default: "Uncategorized",
  },
  tags: [String],
  isFavorite: {
    type: Boolean,
    default: false,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
