import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Last watched video
    lastWatchedVideoId: {
      type: String,
      default: null,
    },
    lastWatchedTimestamp: {
      type: Number,
      default: 0,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
    // Video-specific progress
    videoProgress: [
      {
        videoId: String,
        completed: {
          type: Boolean,
          default: false,
        },
        watchedDuration: {
          type: Number,
          default: 0,
        },
        lastPosition: {
          type: Number,
          default: 0,
        },
        lastWatchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalVideos: {
      type: Number,
      default: 0,
    },
    completedVideos: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProgressSchema.index({ userId: 1, courseId: 1 });

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);
