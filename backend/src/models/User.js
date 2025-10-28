import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },

  fullName: String,
  avatarUrl: String,
  bio: String,
  themePreference: { type: String, default: "light" },
  language: { type: String, default: "en" },

  resetToken: String,
  resetTokenExpires: Date,
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,

  lastLogin: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
