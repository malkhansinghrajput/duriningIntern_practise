import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ["super_admin", "admin", "user"],
    unique: true,
    required: true
  },
  description: String,
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);