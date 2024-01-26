import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  // username: String,
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: [true, "password is required"], unique: true },
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);
