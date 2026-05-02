import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["super_admin", "admin", "user"],
    default: "user",
    required: true
  },
  refreshToken: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);