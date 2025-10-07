import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  },
  // Gamification Fields
  totalPoints: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  studyStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  totalStudyTime: {
    type: Number,
    default: 0,
  },
  coursesCompleted: {
    type: Number,
    default: 0,
  },
  notesCreated: {
    type: Number,
    default: 0,
  },
  lastStudyDate: {
    type: Date,
  },
  dailyGoal: {
    type: Number,
    default: 3, // videos per day
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level based on points
UserSchema.methods.calculateLevel = function () {
  this.level = Math.floor(this.totalPoints / 100) + 1;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
