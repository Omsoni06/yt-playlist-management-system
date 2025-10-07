import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "first_course",
      "first_note",
      "streak_7",
      "streak_30",
      "complete_5",
      "complete_10",
      "speed_learner",
      "note_master",
      "early_bird",
      "night_owl",
    ],
    required: true,
  },
  title: String,
  description: String,
  icon: String,
  earnedAt: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);
